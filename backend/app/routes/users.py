from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.security import OAuth2PasswordBearer

from app.schemas.user_schema import UserCreate, UserResponse
from app.crud import user_crud
from app.services.auth_service import create_access_token, decode_token
from app.db.session import get_db
from app.models.user_model import User
from app.models.role_models import Role

# Definir esquema de autenticación
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Retorna el usuario autenticado basado en el token JWT.
    """
    email = decode_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o usuario no encontrado.",
        )

    user = user_crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    return user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registro de nuevo usuario con validación de email, rol y contraseña encriptada.
    """
    # Verificar si ya existe un usuario con ese email
    existing_user = user_crud.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado."
        )

    # Verificar si el rol existe, o asignar 'admin' por defecto
    role = None
    if user.role:
        role = db.query(Role).filter(Role.name == user.role).first()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El rol '{user.role}' no existe. Use un rol válido."
            )
    else:
        # Asignar rol por defecto si no se especifica
        role = db.query(Role).filter(Role.name == "admin").first()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se encontró el rol por defecto 'admin'."
            )

    # Crear usuario
    new_user = user_crud.create_user(db=db, user=user, role_id=role.id)

    # Crear token JWT
    token = create_access_token(data={"sub": new_user.email})

    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        role=role.name,
        token=token
    )


@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    """
    Lista todos los usuarios registrados.
    """
    users = user_crud.get_all_users(db)
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron usuarios registrados."
        )
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un usuario por su ID.
    """
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    return user


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Elimina un usuario por ID.
    """
    deleted = user_crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    return {"message": "Usuario eliminado correctamente."}
