import { useEffect, useState } from "react";
import "./Projects.css";
const IconStatus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V13M11 20V7M18 20v-5" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7h14M9.5 7V5.2c0-.6.5-1.2 1.2-1.2h2.6c.7 0 1.2.6 1.2 1.2V7M7 7l.8 12c0 .8.7 1.5 1.5 1.5h5.4c.8 0 1.5-.7 1.5-1.5L17 7" />
  </svg>
);

const CLAVE_PROYECTOS = "gp_proyectos";

const obtenerProyectos = () => {
  try {
    const datos = localStorage.getItem(CLAVE_PROYECTOS);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
};

const guardarProyectos = (proyectos) => {
  localStorage.setItem(CLAVE_PROYECTOS, JSON.stringify(proyectos));
};

function Projects() {
  const [proyectos, setProyectos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("Pendiente");

  useEffect(() => {
    setProyectos(obtenerProyectos());
  }, []);

  const handleAgregar = () => {
    if (!nombre.trim()) return;

    const nuevo = {
      id: Date.now(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado,
    };

    const actualizados = [...proyectos, nuevo];
    setProyectos(actualizados);
    guardarProyectos(actualizados);

    setNombre("");
    setDescripcion("");
    setEstado("Pendiente");
    setMostrarForm(false);
  };

  const handleEliminar = (id) => {
    const actualizados = proyectos.filter((p) => p.id !== id);
    setProyectos(actualizados);
    guardarProyectos(actualizados);
  };

  return (
    <section className="projects">
      <div className="projects-header">
        <div>
          <h2>Mis proyectos</h2>
          <p>Administra tus proyectos actuales.</p>
        </div>

        <button
          className="new-project"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Cancelar" : "+ Nuevo proyecto"}
        </button>
      </div>

      {mostrarForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completado">Completado</option>
          </select>
          <button className="save-btn" onClick={handleAgregar}>
            Guardar proyecto
          </button>
        </div>
      )}

      <div className="projects-list">
        {proyectos.length === 0 ? (
          <p className="empty-msg">
            Aún no tienes proyectos. Crea el primero.
          </p>
        ) : (
          proyectos.map((p) => (
            <div className="project-card" key={p.id}>
              <h3>{p.nombre}</h3>
              <p>{p.descripcion || "Sin descripción"}</p>

                            <div className="project-info">
                <span>
                  <IconStatus /> {p.estado}
                </span>
                <span
                  className="delete-link"
                  onClick={() => handleEliminar(p.id)}
                >
                  <IconTrash /> Eliminar
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Projects;
