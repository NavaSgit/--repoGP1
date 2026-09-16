import "./Sidebar.css";

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
    <path d="M9.5 20v-6h5v6" />
  </svg>
);

const IconFolder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 6.5c0-.83.67-1.5 1.5-1.5h4l2 2.5h8c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5H5c-.83 0-1.5-.67-1.5-1.5Z" />
  </svg>
);

const IconTasks = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5.5" width="16" height="15" rx="2" />
    <path d="M4 10h16M8 3.5v3M16 3.5v3" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.5-3 2.7-5 5.5-5s5 2 5.5 5" />
    <circle cx="17" cy="8.5" r="2.3" />
    <path d="M15.5 14.2c2.3.3 4 2.1 4.5 4.6" />
  </svg>
);

const IconDatabase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="6" rx="7" ry="2.8" />
    <path d="M5 6v6c0 1.5 3 2.8 7 2.8s7-1.3 7-2.8V6" />
    <path d="M5 12v6c0 1.5 3 2.8 7 2.8s7-1.3 7-2.8v-6" />
  </svg>
);

const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10M11 20V4M18 20v-7" />
    <path d="M2.5 20h19" />
  </svg>
);

const NAV_ITEMS = [
  { id: "inicio", label: "Inicio", Icon: IconHome },
  { id: "proyectos", label: "Proyectos", Icon: IconFolder },
  { id: "tareas", label: "Tareas", Icon: IconTasks },
  { id: "calendario", label: "Calendario", Icon: IconCalendar },
  { id: "equipo", label: "Equipo", Icon: IconUsers },
  { id: "personas", label: "Personas (BD)", Icon: IconDatabase },
  { id: "estadisticas", label: "Estadísticas (BD)", Icon: IconChart },
];

function Sidebar({ vistaActiva, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>NexusKeep</h2>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <a
            key={id}
            href="#"
            className={vistaActiva === id ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(id);
            }}
          >
            <span className="sidebar-icon">
              <Icon />
            </span>
            {label}
          </a>
        ))}
        </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-dot" />
        <span>NexusKeep</span>
      </div>
    </aside>
  );
}

export default Sidebar;