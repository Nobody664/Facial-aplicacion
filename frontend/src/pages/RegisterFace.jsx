import { useState, useEffect } from "react";
import FaceCapture from "../components/FaceCapture";
import Swal from "sweetalert2";
import api from "../api/api";
import { useAuth } from "../authcontext/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterFace() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [genero, setGenero] = useState("");
  const [edad, setEdad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [grupo, setGrupo] = useState("estudiante");
  const [grado, setGrado] = useState("");
  const [seccion, setSeccion] = useState("");
  const [faceImage, setFaceImage] = useState(null);

  const { token, user, loading } = useAuth();
  const navigate = useNavigate();

  // 🔐 Si no hay sesión activa, redirigir al login
  useEffect(() => {
    if (!loading && !token) {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Debes iniciar sesión para registrar rostros.",
        confirmButtonText: "Ir al login",
      }).then(() => navigate("/login"));
    }
  }, [token, loading, navigate]);

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

    if (!nombre || !apellido || !grupo || !faceImage) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa los datos requeridos y captura tu rostro.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("genero", genero);
    formData.append("edad", edad);
    formData.append("direccion", direccion);
    formData.append("telefono", telefono);
    formData.append("grupo", grupo);
    formData.append("grado", grado);
    formData.append("seccion", seccion);
    formData.append("face_image", faceImage, "face.jpg");

    try {
      const response = await api.post("/persons/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Persona registrada",
        text: response.data.message || "El rostro se registró exitosamente.",
      });

      // Reset campos
      setNombre("");
      setApellido("");
      setGenero("");
      setEdad("");
      setDireccion("");
      setTelefono("");
      setGrupo("estudiante");
      setGrado("");
      setSeccion("");
      setFaceImage(null);
    } catch (error) {
      console.error("Error al registrar persona:", error);
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: error.response?.data?.detail || "No se pudo registrar el rostro.",
      });
    }
  };

  // 🧭 Mostrar loader mientras se valida sesión
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Registro con Reconocimiento Facial
      </h2>

      {user && (
        <p className="mb-4 text-gray-600">
          Sesión activa como: <b>{user.email || user.nombre}</b>
        </p>
      )}

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-6 w-full max-w-md border"
      >
        <input
          type="text"
          placeholder="Nombre"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Apellido"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        >
          <option value="">Seleccionar género</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>

        <input
          type="number"
          placeholder="Edad"
          className="border rounded-lg px-3 py-2"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />

        <input
          type="text"
          placeholder="Dirección"
          className="border rounded-lg px-3 py-2"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />

        <input
          type="text"
          placeholder="Teléfono"
          className="border rounded-lg px-3 py-2"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
        >
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
          <option value="limpieza">Limpieza</option>
          <option value="seguridad">Seguridad</option>
        </select>

        <input
          type="text"
          placeholder="Grado"
          className="border rounded-lg px-3 py-2"
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
        />

        <input
          type="text"
          placeholder="Sección"
          className="border rounded-lg px-3 py-2"
          value={seccion}
          onChange={(e) => setSeccion(e.target.value)}
        />

        <FaceCapture onCapture={handleFaceCapture} />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mt-4"
        >
          Registrar Persona
        </button>
      </form>
    </div>
  );
}
