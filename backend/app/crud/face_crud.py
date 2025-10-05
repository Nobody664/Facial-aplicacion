from sqlalchemy.orm import Session
from app.models.face_model import Face
from app.schemas.face_schema import FaceCreate

def crear_rostro(db: Session, face: FaceCreate):
    db_face = Face(nombre=face.nombre, embedding=face.embedding)
    db.add(db_face)
    db.commit()
    db.refresh(db_face)
    return db_face


def obtener_rostros(db: Session):
    return db.query(Face).all()


def obtener_rostro_por_id(db: Session, face_id: int):
    return db.query(Face).filter(Face.id == face_id).first()


def eliminar_rostro(db: Session, face_id: int):
    rostro = db.query(Face).filter(Face.id == face_id).first()
    if rostro:
        db.delete(rostro)
        db.commit()
        return True
    return False
