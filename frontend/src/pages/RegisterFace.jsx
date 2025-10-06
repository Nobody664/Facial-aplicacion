// src/pages/RegisterFace.jsx
import { useState } from "react";
import FaceCapture from "../components/FaceCapture";
import Swal from "sweetalert2";
import api from "../api/api"; 

export default function RegisterFace() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [faceImage, setFaceImage] = useState(null);

  const handleFaceCapture = (blob) => {
    setFaceImage(blob);
    Swal.fire({
      icon: "success",
      title: "Rostro capturado correctamente",
      text: "Puedes proceder con el registro.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !faceImage) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos y captura tu rostro.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("face_image", faceImage, "face.jpg");

    try {
      const response = await api.post("/users/register-face", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Usuario registrado",
        text: response.data.message || "El rostro se registró exitosamente.",
      });

      setName("");
      setEmail("");
      setFaceImage(null);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: error.response?.data?.detail || "No se pudo registrar el rostro.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Registro con Reconocimiento Facial</h2>

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-6 w-full max-w-md border"
      >
        <input
          type="text"
          placeholder="Nombre completo"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FaceCapture onCapture={handleFaceCapture} />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mt-4"
        >
          Registrar Usuario
        </button>
      </form>
    </div>
  );
}
