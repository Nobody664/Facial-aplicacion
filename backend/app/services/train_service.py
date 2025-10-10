""" import numpy as np
from app.models.person_model import Person
from app.services.face_recognition import get_face_embedding

async def update_embeddings(db, file):
    embedding = await get_face_embedding(file)
    if embedding is None:
        return "No se pudo extraer embedding."

    # Aquí podrías actualizar el registro en base de datos
    # por ejemplo, para mejorar el promedio del embedding
    # o para añadir nuevas muestras de un usuario existente

    # Guardar o actualizar un embedding de ejemplo
    new_face = Person(name="Unknown", embedding=np.array(embedding).tolist())
    db.add(new_face)
    db.commit()

    return "Embedding actualizado correctamente."
 """