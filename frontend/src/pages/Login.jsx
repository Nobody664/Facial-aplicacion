import { useState } from "react";
import { useAuth } from "../authcontext/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Por favor, ingresa tu correo y contraseña.",
      });
      return;
    }

    setLoading(true);
    const success = await login(email.trim(), password.trim());
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="bg-white shadow-2xl p-8 rounded-2xl w-96">
        <h2 className="text-2xl font-extrabold text-center text-blue-700 mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 rounded-lg outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 rounded-lg outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>

        {/* Texto opcional */}
        <p className="text-sm text-center text-gray-500 mt-4">
          ¿No tienes cuenta? Pide acceso al administrador.
        </p>
      </div>
    </div>
  );
}
