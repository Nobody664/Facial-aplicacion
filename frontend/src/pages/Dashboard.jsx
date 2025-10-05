import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import RegisterFace from "./RegisterFace";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("register-face");

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="dashboard-content">
          {activePage === "register-face" && <RegisterFace />}
          {activePage === "users" && <h2>Gestión de Usuarios</h2>}
          {activePage === "roles" && <h2>Gestión de Roles</h2>}
        </main>
      </div>
    </div>
  );
}
