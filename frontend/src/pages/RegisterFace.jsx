import React, { useState } from "react";
import api from "../api/api";
import InputField from "../components/InputField";
import FaceCapture from "../components/FaceCapture";
import "../styles/global.css";

export default function RegisterFace() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [faceImage, setFaceImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!faceImage) {
      alert("Por favor, capture su rostro antes de continuar.");
      return;
    }

    try {
      const res = await api.post("/users/register-face", {
        ...form,
        face_image: faceImage,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Error al registrar: " + err.response?.data?.detail);
    }
  };

  return (
    <div className="container">
      <h1>Registro Facial</h1>
      <form onSubmit={handleRegister}>
        <InputField label="Nombre completo" type="text" value={form.full_name} onChange={handleChange("full_name")} />
        <InputField label="Correo electrónico" type="email" value={form.email} onChange={handleChange("email")} />
        <InputField label="Contraseña" type="password" value={form.password} onChange={handleChange("password")} />

        <label>Rol</label>
        <select value={form.role} onChange={handleChange("role")}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        <FaceCapture onCapture={setFaceImage} />

        <button type="submit" style={{ marginTop: "1rem", width: "100%" }}>
          Registrar usuario
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", color: "#1d3557", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
}
