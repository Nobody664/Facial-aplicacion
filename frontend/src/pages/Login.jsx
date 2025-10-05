import { useState } from "react";
import axios from "axios";
import "../App.css";

const API_URL = "http://127.0.0.1:8000"; // Cambia si tu backend está en otro host

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      onLogin();
    } catch (err) {
      setError("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Iniciar Sesión</h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
