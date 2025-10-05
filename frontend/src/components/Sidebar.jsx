export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <h2>Panel</h2>
      <ul>
        <li
          className={activePage === "register-face" ? "active" : ""}
          onClick={() => setActivePage("register-face")}
        >
          Registro Facial
        </li>
        <li
          className={activePage === "users" ? "active" : ""}
          onClick={() => setActivePage("users")}
        >
          Usuarios
        </li>
        <li
          className={activePage === "roles" ? "active" : ""}
          onClick={() => setActivePage("roles")}
        >
          Roles
        </li>
      </ul>
    </aside>
  );
}
