from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Face(Base):
    __tablename__ = "faces"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(120), nullable=True)
    embedding = Column(JSON, nullable=False)  # Guardamos el vector de características
    image_path = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relación con usuario
    user = relationship("User", backref="faces")

    def __repr__(self):
        return f"<Face name={self.name}>"
