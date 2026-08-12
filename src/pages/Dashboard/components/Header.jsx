function Header({ usuario }) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Bienvenido de nuevo, {usuario.usuario}</p>
      </div>

      <div className="header-user">
        👤 {usuario.usuario}
      </div>
    </header>
  );
}

export default Header;