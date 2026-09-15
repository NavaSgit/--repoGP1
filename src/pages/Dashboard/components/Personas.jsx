import { useEffect, useState } from "react";
import { obtenerPersonas } from "../../../services/api";
import "./Personas.css";

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 15;

  useEffect(() => {
    let cancelado = false;

    setCargando(true);
    setError("");

    obtenerPersonas({ search, page, pageSize })
      .then((res) => {
        if (cancelado) return;
        setPersonas(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelado) return;
        setError(
          err.message ||
            "No se pudo conectar con el backend/base de datos"
        );
        setPersonas([]);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [search, page]);

  const totalPaginas = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="personas-container">
      <div className="personas-toolbar">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o correo..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="personas-search"
        />
      </div>

      {error && (
        <p className="personas-error">
          ⚠️ {error} — verifica que el backend (server/) esté
          corriendo y conectado a AdventureWorks2008R2.
        </p>
      )}

      {cargando ? (
        <p className="personas-loading">Cargando personas...</p>
      ) : (
        <>
          <table className="personas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((p) => (
                <tr key={p.BusinessEntityID}>
                  <td>{p.BusinessEntityID}</td>
                  <td>{p.FirstName}</td>
                  <td>{p.LastName}</td>
                  <td>{p.EmailAddress || "—"}</td>
                  <td>{p.PhoneNumber || "—"}</td>
                </tr>
              ))}

              {personas.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="personas-vacio">
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="personas-paginacion">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Anterior
            </button>

            <span>
              Página {page} de {totalPaginas} ({total} personas)
            </span>

            <button
              disabled={page >= totalPaginas}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Personas;
