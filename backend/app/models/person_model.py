from sqlalchemy import Column, Integer, String, LargeBinary, Enum
from app.db.base import Base
import enum

class GroupType(enum.Enum):
    estudiante = "estudiante"
    profesor = "profesor"
    limpieza = "limpieza"
    seguridad = "seguridad"

class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    genero = Column(String(10))
    edad = Column(Integer)
    direccion = Column(String(255))
    telefono = Column(String(20))
    grado = Column(String(50))
    seccion = Column(String(50))
    grupo = Column(Enum(GroupType), nullable=False)
    face_encoding = Column(LargeBinary, nullable=True)  # Codificación facial almacenada como bytes

    def __repr__(self):
        return f"<Person(nombre={self.nombre}, grupo={self.grupo})>"
