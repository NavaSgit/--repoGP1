const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.7-4 3.4-6.5 7-6.5s6.3 2.5 7 6.5" />
  </svg>
);

function Header({ titulo, subtitulo, usuario, onLogout }) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>

      <div className="header-user">
        <span className="header-user-icon">
          <IconUser />
        </span>
        <span className="header-user-name">{usuario.usuario}</span>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;