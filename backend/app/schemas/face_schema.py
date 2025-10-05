from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FaceBase(BaseModel):
    name: Optional[str] = None
    embedding: List[float]

class FaceCreate(FaceBase):
    nombre: str
    user_id: Optional[int] = None
    image_path: Optional[str] = None

class FaceResponse(FaceBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
