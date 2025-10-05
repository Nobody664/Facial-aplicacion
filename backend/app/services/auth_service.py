from datetime import datetime, timedelta
from fastapi import HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

from requests import Session

from app.crud import user_crud

# Clave secreta y configuración del token
SECRET_KEY = "supersecreto123"  # ⚠️ Mueve esto a tu archivo .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# --- Hash y verificación de contraseñas ---
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(db: Session, email: str, password: str):
    user = user_crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    if not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return create_access_token({"sub": user.email})

# --- Creación de JWT ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# --- Decodificación de JWT (para middlewares si deseas autenticación futura) ---
def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
