# Crear entorno virtual
python -m venv venv

# En Windows: source venv/Scripts/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor 
uvicorn app.main:app --reload