import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import Swal from "sweetalert2";

// Crear contexto global de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // 🟢 Cargar usuario al iniciar si existe token guardado
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("⚠️ Error al cargar usuario:", error);
        logout(); // Si el token ya no es válido
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // 🔐 Iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await api.post(
        "/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access_token } = response.data;

      if (!access_token) throw new Error("El servidor no devolvió un token válido.");

      // Guardar token localmente
      localStorage.setItem("token", access_token);
      setToken(access_token);

      // Obtener el usuario actual con el token
      const userResponse = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      setUser(userResponse.data);

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola, ${userResponse.data.email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);

      const msg =
        error.response?.data?.detail ||
        "No se pudo iniciar sesión. Verifica tus credenciales.";

      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: msg,
      });

      return false;
    }
  };

  // 🚪 Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    Swal.fire({
      icon: "info",
      title: "Sesión cerrada",
      text: "Has cerrado sesión correctamente.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Proveer valores globales
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
