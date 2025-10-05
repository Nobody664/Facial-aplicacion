import { useState } from "react";
import api from "../api/api";
import"../styles/global.css";
import InputField from "../components/InputField";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      onLogin();
    } catch (err) {
      setError("Credenciales inválidas o error del servidor.");
    }
  };

  return (
    <div className="container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
        />
        <InputField
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
        />
        <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>
          Entrar
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
