import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>NexusKeep</h2>
      </div>

      <nav className="sidebar-nav">

        <a href="#" className="active">
          🏠 Inicio
        </a>

        <a href="#">
          📁 Proyectos
        </a>

        <a href="#">
          📋 Tareas
        </a>

        <a href="#">
          📅 Calendario
        </a>

        <a href="#">
          👥 Equipo
        </a>

      </nav>

    </aside>
  );
}

export default Sidebar;