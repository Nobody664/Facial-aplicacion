# app/config.py
import os
from dotenv import load_dotenv

# Carga las variables de entorno desde el archivo .env
load_dotenv()

# Configuraciones de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")
