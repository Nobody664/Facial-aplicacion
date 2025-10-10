from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.schemas.person_schema import PersonResponse
from app.services.person_service import register_person_with_face
from app.db.session import get_db
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/persons", tags=["Registro Facial"])

@router.post("/register", response_model=PersonResponse)
def register_person(
    nombre: str = Form(...),
    apellido: str = Form(...),
    genero: str = Form(None),
    edad: int = Form(None),
    direccion: str = Form(None),
    telefono: str = Form(None),
    grupo: str = Form(...),
    grado: str = Form(None),
    seccion: str = Form(None),
    face_image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    person_data = {
        "nombre": nombre,
        "apellido": apellido,
        "genero": genero,
        "edad": edad,
        "direccion": direccion,
        "telefono": telefono,
        "grupo": grupo,
        "grado": grado,
        "seccion": seccion,
    }
    new_person = register_person_with_face(
        db=db,
        user_id=current_user.id,
        person_data=type("obj", (object,), person_data),
        file=face_image,
    )
    return new_person
