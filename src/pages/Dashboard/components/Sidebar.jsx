import "./Sidebar.css";

const NAV_ITEMS = [
  { id: "inicio", label: "🏠 Inicio" },
  { id: "proyectos", label: "📁 Proyectos" },
  { id: "tareas", label: "📋 Tareas" },
  { id: "calendario", label: "📅 Calendario" },
  { id: "equipo", label: "👥 Equipo" },
  { id: "personas", label: "🗂️ Personas (BD)" },
  { id: "estadisticas", label: "📊 Estadísticas (BD)" },
];

function Sidebar({ vistaActiva, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>NexusKeep</h2>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href="#"
            className={vistaActiva === item.id ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
