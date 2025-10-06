from sqlalchemy.orm import Session
from app.schemas.face_schema import FaceCreate
from app.models.face_model import FaceData

def create_face_entry(db: Session, user_id: int, embedding: list):
    new_face = FaceData(
        user_id=user_id,
        embedding=embedding
    )
    db.add(new_face)
    db.commit()
    db.refresh(new_face)
    return new_face

def obtener_rostros(db: Session):
    return db.query(FaceData ).all()


def obtener_rostro_por_id(db: Session, face_id: int):
    return db.query(FaceData).filter(FaceData.id == face_id).first()


def eliminar_rostro(db: Session, face_id: int):
    rostro = db.query(FaceData).filter(FaceData.id == face_id).first()
    if rostro:
        db.delete(rostro)
        db.commit()
        return True
    return False
