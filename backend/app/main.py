from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from app.database import Base, engine
from app.routes import users, recognition, auth, training
import logging
import time

# --------------------------------------------------
# Configuración básica
# --------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Reconocimiento Facial",
    description="Servicio backend para reconocimiento facial usando MediaPipe y PostgreSQL.",
    version="1.0.0"
)

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #allow_origins=["*"],  # Reemplazar por el dominio del frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Rutas principales
# --------------------------------------------------
app.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
app.include_router(recognition.router, prefix="/faces", tags=["Rostros"])
app.include_router(users.router, prefix="/users", tags=["Usuarios"])
app.include_router(training.router, prefix="/training", tags=["Entrenamiento"])

# --------------------------------------------------
# Endpoint raíz
# --------------------------------------------------
@app.get("/")
def root():
    return {"message": "🚀 API de Reconocimiento Facial funcionando correctamente"}


# --------------------------------------------------
# Verificación automática de la conexión a la BD
# --------------------------------------------------
@app.on_event("startup")
async def startup():
    max_retries = 3
    retry_delay = 5  # segundos entre intentos

    logger.info("Verificando conexión con la base de datos...")

    for attempt in range(max_retries):
        try:
            with engine.connect() as connection:
                logger.info("✅ Conexión exitosa a la base de datos PostgreSQL")
                return
        except OperationalError as e:
            logger.warning(f"Intento {attempt + 1}/{max_retries} fallido: {e}")
            if attempt + 1 == max_retries:
                logger.error(f"❌ Error al conectar tras {max_retries} intentos: {e}")
                raise HTTPException(
                    status_code=500,
                    detail="Error de conexión a la base de datos"
                )
            time.sleep(retry_delay)
