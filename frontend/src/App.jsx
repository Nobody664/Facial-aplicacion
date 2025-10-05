import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterFace from "./pages/RegisterFace";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [currentPage, setCurrentPage] = useState("dashboard"); // dashboard | register

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      {currentPage === "dashboard" ? (
        <Dashboard
          onLogout={handleLogout}
          goToRegister={() => setCurrentPage("register")}
        />
      ) : (
        <RegisterFace goBack={() => setCurrentPage("dashboard")} />
      )}
    </>
  );
}
