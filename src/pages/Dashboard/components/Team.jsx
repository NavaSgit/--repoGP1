import { useEffect, useState } from "react";
import "./Team.css";

const CLAVE_EQUIPO = "gp_equipo";

const obtenerEquipo = () => {
  try {
    const datos = localStorage.getItem(CLAVE_EQUIPO);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
};

const guardarEquipo = (equipo) => {
  localStorage.setItem(CLAVE_EQUIPO, JSON.stringify(equipo));
};

function Team() {
  const [equipo, setEquipo] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEquipo(obtenerEquipo());
  }, []);

  const handleAgregar = () => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre.trim() || !rol.trim()) {
      setError("Nombre y rol son obligatorios");
      return;
    }

    if (correo && !correoRegex.test(correo)) {
      setError("Ingresa un correo válido o déjalo vacío");
      return;
    }

    setError("");

    const nuevo = {
      id: Date.now(),
      nombre: nombre.trim(),
      rol: rol.trim(),
      correo: correo.trim(),
    };

    const actualizado = [...equipo, nuevo];
    setEquipo(actualizado);
    guardarEquipo(actualizado);

    setNombre("");
    setRol("");
    setCorreo("");
    setMostrarForm(false);
  };

  const handleEliminar = (id) => {
    const actualizado = equipo.filter((m) => m.id !== id);
    setEquipo(actualizado);
    guardarEquipo(actualizado);
  };

  const iniciales = (nombreCompleto) =>
    nombreCompleto
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <section className="team">
      <div className="team-header">
        <div>
          <h2>Mi equipo</h2>
          <p>Gestiona a los miembros de tu equipo.</p>
        </div>

        <button
          className="new-project"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Cancelar" : "+ Agregar miembro"}
        </button>
      </div>

      {mostrarForm && (
        <div className="add-form">
          {error && <p className="form-error">{error}</p>}
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rol (ej. Diseñador)"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo (opcional)"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <button className="save-btn" onClick={handleAgregar}>
            Guardar miembro
          </button>
        </div>
      )}

      <div className="team-list">
        {equipo.length === 0 ? (
          <p className="empty-msg">
            Aún no has agregado a nadie a tu equipo.
          </p>
        ) : (
          equipo.map((m) => (
            <div className="team-card" key={m.id}>
              <div className="team-avatar">{iniciales(m.nombre)}</div>
              <div className="team-info">
                <h3>{m.nombre}</h3>
                <p>{m.rol}</p>
                {m.correo && <span>{m.correo}</span>}
              </div>
              <span
                className="delete-link"
                onClick={() => handleEliminar(m.id)}
              >
                🗑️
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Team;
