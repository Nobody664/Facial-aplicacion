import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./authcontext/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterFace from "./pages/RegisterFace";

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/register-face"
          element={
            <PrivateRoute>
              <RegisterFace />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
