from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_schema import UserLogin, Token
from app.services import auth_service

router = APIRouter()

@router.post("/login", response_model=Token, tags=["Autenticación"])
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    token = auth_service.authenticate_user(db, user_data.email, user_data.password)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    return {"access_token": token, "token_type": "bearer"}
