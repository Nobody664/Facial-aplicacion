from sqlalchemy.orm import Session
from app.schemas.person_schema import PersonCreate
from backend.app.models.person_model import Person

def create_face_entry(db: Session, user_id: int, embedding: list):
    new_face = Person(
        user_id=user_id,
        embedding=embedding
    )
    db.add(new_face)
    db.commit()
    db.refresh(new_face)
    return new_face

def obtener_rostros(db: Session):
    return db.query(Person).all()


def obtener_rostro_por_id(db: Session, face_id: int):
    return db.query(Person).filter(Person.id == face_id).first()


def eliminar_rostro(db: Session, face_id: int):
    rostro = db.query(Person).filter(Person.id == face_id).first()
    if rostro:
        db.delete(rostro)
        db.commit()
        return True
    return False
