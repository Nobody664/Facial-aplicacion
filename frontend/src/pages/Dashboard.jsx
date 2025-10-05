import "../App.css";
import { useState } from "react";

export default function Dashboard() {
  const [section, setSection] = useState("inicio");

  const renderContent = () => {
    switch (section) {
      case "usuarios":
        return <p> Gestión de usuarios</p>;
      case "rostros":
        return <p> Gestión de rostros</p>;
      default:
        return <p> Bienvenido al panel de administración</p>;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside
        style={{
          width: "220px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
        }}
      >
        <h3>Panel</h3>
        <nav style={{ marginTop: 20 }}>
          <button onClick={() => setSection("inicio")}>Inicio</button>
          <button onClick={() => setSection("usuarios")}>Usuarios</button>
          <button onClick={() => setSection("rostros")}>Rostros</button>
          <button
            onClick={logout}
            style={{ backgroundColor: "#e74c3c", marginTop: 20 }}
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "40px" }}>{renderContent()}</main>
    </div>
  );
}
