from sqlalchemy.orm import declarative_base

Base = declarative_base()


# Importa todos los modelos aquí
from app.models.user_model import User
from app.models.role_models import Role
from app.models.person_model import Person