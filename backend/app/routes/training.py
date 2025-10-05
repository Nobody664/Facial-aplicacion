from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import train_service

router = APIRouter()

@router.post("/update", tags=["Entrenamiento"])
async def update_face_embeddings(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        result = await train_service.update_embeddings(db, file)
        return {"status": "ok", "details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
