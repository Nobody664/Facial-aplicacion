import face_recognition
import numpy as np
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.person_model import Person
import io
from PIL import Image

def register_person_with_face(db: Session, user_id: int, person_data, file):
    try:
        # Leer imagen recibida
        image = face_recognition.load_image_file(file.file)
        encodings = face_recognition.face_encodings(image)

        if len(encodings) == 0:
            raise HTTPException(status_code=400, detail="No se detectó ningún rostro en la imagen")
        if len(encodings) > 1:
            raise HTTPException(status_code=400, detail="Se detectaron múltiples rostros. Usa solo una persona por registro")

        face_encoding = encodings[0]
        # Convertimos el encoding (numpy array) a bytes
        encoding_bytes = np.array(face_encoding).tobytes()

        new_person = Person(
            nombre=person_data.nombre,
            apellido=person_data.apellido,
            genero=person_data.genero,
            edad=person_data.edad,
            direccion=person_data.direccion,
            telefono=person_data.telefono,
            grupo=person_data.grupo,
            grado=person_data.grado,
            seccion=person_data.seccion,
            face_encoding=encoding_bytes,
            user_id=user_id,
        )
        db.add(new_person)
        db.commit()
        db.refresh(new_person)
        return new_person

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando rostro: {str(e)}")
