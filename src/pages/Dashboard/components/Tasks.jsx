import { useEffect, useState } from "react";
import "./Tasks.css";

const CLAVE_TAREAS = "gp_tareas";

const obtenerTareas = () => {
  try {
    const datos = localStorage.getItem(CLAVE_TAREAS);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
};

const guardarTareas = (tareas) => {
  localStorage.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
};

function Tasks() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [prioridad, setPrioridad] = useState("Media");

  useEffect(() => {
    setTareas(obtenerTareas());
  }, []);

  const handleAgregar = () => {
    if (!titulo.trim()) return;

    const nueva = {
      id: Date.now(),
      titulo: titulo.trim(),
      fecha,
      prioridad,
      completada: false,
    };

    const actualizadas = [...tareas, nueva];
    setTareas(actualizadas);
    guardarTareas(actualizadas);

    setTitulo("");
    setFecha("");
    setPrioridad("Media");
  };

  const handleToggle = (id) => {
    const actualizadas = tareas.map((t) =>
      t.id === id ? { ...t, completada: !t.completada } : t
    );
    setTareas(actualizadas);
    guardarTareas(actualizadas);
  };

  const handleEliminar = (id) => {
    const actualizadas = tareas.filter((t) => t.id !== id);
    setTareas(actualizadas);
    guardarTareas(actualizadas);
  };

  const pendientes = tareas.filter((t) => !t.completada);
  const completadas = tareas.filter((t) => t.completada);

  return (
    <section className="tasks">
      <div className="tasks-header">
        <div>
          <h2>Mis tareas</h2>
          <p>Organiza tus pendientes.</p>
        </div>
      </div>

      <div className="add-form">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <button className="save-btn" onClick={handleAgregar}>
          + Agregar tarea
        </button>
      </div>

      <div className="tasks-columns">
        <div className="tasks-column">
          <h3>Pendientes ({pendientes.length})</h3>

          {pendientes.length === 0 ? (
            <p className="empty-msg">No tienes tareas pendientes.</p>
          ) : (
            pendientes.map((t) => (
              <div
                className={`task-card prioridad-${t.prioridad.toLowerCase()}`}
                key={t.id}
              >
                <label className="task-check">
                  <input
                    type="checkbox"
                    checked={t.completada}
                    onChange={() => handleToggle(t.id)}
                  />
                  <span>{t.titulo}</span>
                </label>

                <div className="task-info">
                  {t.fecha && <span>📅 {t.fecha}</span>}
                  <span className="badge">{t.prioridad}</span>
                  <span
                    className="delete-link"
                    onClick={() => handleEliminar(t.id)}
                  >
                    🗑️
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="tasks-column">
          <h3>Completadas ({completadas.length})</h3>

          {completadas.length === 0 ? (
            <p className="empty-msg">Aún no completas tareas.</p>
          ) : (
            completadas.map((t) => (
              <div className="task-card completada" key={t.id}>
                <label className="task-check">
                  <input
                    type="checkbox"
                    checked={t.completada}
                    onChange={() => handleToggle(t.id)}
                  />
                  <span>{t.titulo}</span>
                </label>

                <div className="task-info">
                  {t.fecha && <span>📅 {t.fecha}</span>}
                  <span
                    className="delete-link"
                    onClick={() => handleEliminar(t.id)}
                  >
                    🗑️
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Tasks;
