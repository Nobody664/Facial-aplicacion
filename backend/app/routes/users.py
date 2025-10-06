from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin, Token
from app.crud import user_crud
from app.services.auth_service import create_access_token, verify_password
from app.services.face_recognition import process_face_from_bytes
from app.crud.face_crud import create_face_entry
from app.crud import face_crud
from app.schemas.face_schema import FaceCreate

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registro de nuevo usuario (nombre, email, contraseña y rol).
    """
    db_user = user_crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    new_user = user_crud.create_user(db=db, user=user)
    return new_user

@router.post("/register-face")
async def register_face(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    masked_face, embedding = process_face_from_bytes(image_bytes)

    if embedding is None:
        raise HTTPException(status_code=400, detail="No se detectó un rostro válido.")

    face_create = FaceCreate(user_id=user_id, embedding=embedding.tolist())
    new_face = face_crud.create_face_entry(db, face_create)

    return {"message": "Rostro registrado correctamente", "face_id": new_face.id}


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login de usuario. Devuelve un token JWT si las credenciales son válidas.
    """
    user = user_crud.get_user_by_email(db, user_data.email)
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    """
    Lista todos los usuarios registrados.
    """
    return user_crud.get_all_users(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un usuario por ID.
    """
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Elimina un usuario por ID.
    """
    deleted = user_crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado correctamente"}
