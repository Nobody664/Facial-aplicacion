from pydantic import BaseModel
from typing import Optional

class PersonBase(BaseModel):
    nombre: str
    apellido: str
    genero: Optional[str] = None
    edad: Optional[int] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    grupo: str
    grado: Optional[str] = None
    seccion: Optional[str] = None

class PersonCreate(PersonBase):
    pass

class PersonResponse(PersonBase):
    id: int
    class Config:
        from_atributtes = True 
