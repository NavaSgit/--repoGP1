function Header({ titulo, subtitulo, usuario, onLogout }) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>

      <div className="header-user">
        <span className="header-user-name">👤 {usuario.usuario}</span>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
