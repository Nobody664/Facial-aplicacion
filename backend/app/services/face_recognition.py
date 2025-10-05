import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"  # Silencia logs TensorFlow
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import cv2
import numpy as np
import mediapipe as mp
from typing import Tuple, Optional

# Inicializar MediaPipe
mp_face_mesh = mp.solutions.face_mesh
mp_face_detection = mp.solutions.face_detection

# --- FACE MESH CONFIG (para obtener la máscara del rostro) ---
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5
)


def get_face_mask(image: np.ndarray) -> Optional[np.ndarray]:
    """
    Crea una máscara para eliminar el fondo y conservar solo el rostro.
    Devuelve la imagen recortada con fondo negro.
    """
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return None

    h, w, _ = image.shape
    mask = np.zeros((h, w), np.uint8)

    # Dibujar la máscara a partir de los puntos de la cara
    for face_landmarks in results.multi_face_landmarks:
        points = np.array(
            [(int(p.x * w), int(p.y * h)) for p in face_landmarks.landmark]
        )
        hull = cv2.convexHull(points)
        cv2.fillConvexPoly(mask, hull, 255)

    # Aplicar máscara al rostro original
    face_only = cv2.bitwise_and(image, image, mask=mask)
    return face_only


def get_face_embedding(image: np.ndarray) -> Optional[np.ndarray]:
    """
    Obtiene el embedding del rostro usando MediaPipe.
    Devuelve un vector de características normalizado (128D aprox).
    """
    face_detector = mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_detector.process(rgb)

    if not results.detections:
        return None

    # Tomar la primera detección
    detection = results.detections[0]
    bbox = detection.location_data.relative_bounding_box

    h, w, _ = image.shape
    x1, y1, x2, y2 = (
        int(bbox.xmin * w),
        int(bbox.ymin * h),
        int((bbox.xmin + bbox.width) * w),
        int((bbox.ymin + bbox.height) * h),
    )

    face_crop = image[y1:y2, x1:x2]
    if face_crop.size == 0:
        return None

    # Redimensionar rostro a tamaño estándar
    face_crop = cv2.resize(face_crop, (128, 128))
    face_crop = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)

    # Obtener puntos de malla para generar embedding
    mesh_results = face_mesh.process(face_crop)
    if not mesh_results.multi_face_landmarks:
        return None

    # Extraer coordenadas normalizadas de landmarks
    landmarks = []
    for lm in mesh_results.multi_face_landmarks[0].landmark:
        landmarks.extend([lm.x, lm.y, lm.z])

    embedding = np.array(landmarks, dtype=np.float32)

    # Normalizar
    embedding = embedding / np.linalg.norm(embedding)
    return embedding


def compare_embeddings(emb1: np.ndarray, emb2: np.ndarray, threshold: float = 0.6) -> bool:
    """
    Compara dos embeddings usando distancia euclidiana.
    Devuelve True si se consideran del mismo rostro.
    """
    distance = np.linalg.norm(emb1 - emb2)
    return distance < threshold


def process_face_from_bytes(image_bytes: bytes) -> Tuple[Optional[np.ndarray], Optional[np.ndarray]]:
    """
    Recibe bytes de imagen (por ejemplo desde un upload en FastAPI),
    genera la máscara y el embedding.
    """
    npimg = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    masked_face = get_face_mask(image)
    embedding = get_face_embedding(image)
    return masked_face, embedding
