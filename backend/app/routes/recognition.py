from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import face_crud
from app.schemas.face_schema import FaceCreate
from app.services.face_recognition import process_face_from_bytes
from app.services.dependencies import get_current_user 

router = APIRouter()

@router.post("/register")
async def registrar_rostro(
    file: UploadFile = File(...),
    nombre: str = "",
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Captura un rostro desde una imagen, genera la máscara y el embedding con MediaPipe,
    y lo guarda en la base de datos.
    """
    try:
        image_bytes = await file.read()
        masked_face, embedding, *_ = process_face_from_bytes(image_bytes)

        if embedding is None:
            raise HTTPException(status_code=400, detail="No se detectó ningún rostro válido")

        # Convertir el embedding a lista (para almacenarlo en PostgreSQL tipo JSON o ARRAY)
        embedding_list = embedding.tolist()

        face_data = FaceCreate(nombre=nombre, embedding=embedding_list)
        rostro_creado = face_crud.crear_rostro(db=db, face=face_data)

        return {
            "message": " Rostro registrado exitosamente",
            "nombre": nombre,
            "id": rostro_creado.id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el rostro: {str(e)}")


@router.get("/")
def listar_rostros(db: Session = Depends(get_db)):
    """
    Devuelve la lista de todos los rostros registrados.
    """
    return face_crud.obtener_rostros(db)


@router.get("/{face_id}")
def obtener_rostro(face_id: int, db: Session = Depends(get_db)):
    """
    Obtiene la información de un rostro por su ID.
    """
    rostro = face_crud.obtener_rostro_por_id(db, face_id)
    if not rostro:
        raise HTTPException(status_code=404, detail="Rostro no encontrado")
    return rostro


@router.delete("/{face_id}")
def eliminar_rostro(face_id: int, db: Session = Depends(get_db)):
    """
    Elimina un rostro de la base de datos.
    """
    eliminado = face_crud.eliminar_rostro(db, face_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="No se pudo eliminar el rostro (no encontrado)")
    return {"message": "Rostro eliminado correctamente"}
