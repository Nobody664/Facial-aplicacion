import cv2
import requests

API_URL = "http://127.0.0.1:8000/faces/register"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZXNhckBkZW1vLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1OTYyOTc5MH0.ZpfJNOGupdEd6sITrudcVd5X8YEO3fobrp4yHCwD770"  # reemplaza con el obtenido del login

# Abrir cámara
cap = cv2.VideoCapture(0)
print("Presiona [ESPACIO] para capturar rostro, [ESC] para salir")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    cv2.imshow("Captura de rostro", frame)
    key = cv2.waitKey(1)

    if key == 27:  # ESC
        break
    elif key == 32:  # ESPACIO
        cv2.imwrite("captura.jpg", frame)
        print("📸 Imagen capturada y enviada al backend...")

        with open("captura.jpg", "rb") as f:
            response = requests.post(
                API_URL,
                headers={"Authorization": f"Bearer {TOKEN}"},
                files={"file": f},
                data={"nombre": "Cesar"},
            )
        print("🔹 Respuesta del backend:", response.json())

cap.release()
cv2.destroyAllWindows()
