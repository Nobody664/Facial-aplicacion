export default function Header() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="header">
      <h1>🧠 Sistema de Reconocimiento Facial</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </header>
  );
}
