import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <>
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}
