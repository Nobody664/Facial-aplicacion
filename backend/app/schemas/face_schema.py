from pydantic import BaseModel
from typing import List, Optional

class FaceBase(BaseModel):
    user_id: int
    embedding: List[float]

class FaceCreate(FaceBase):
    pass

class FaceResponse(FaceBase):
    id: int

    class Config:
        from_attributes = True
