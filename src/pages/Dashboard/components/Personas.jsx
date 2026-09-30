import { useEffect, useState } from "react";
import { obtenerPersonas } from "../../../services/api";
import PersonaCard from "./PersonaCard";
import "./Personas.css";

const FILTROS_TIPO = [
  { value: "", label: "Todos" },
  { value: "IN", label: "Individual" },
  { value: "EM", label: "Empleado" },
  { value: "GC", label: "Contacto general" },
  { value: "SC", label: "Contacto de tienda" },
  { value: "SP", label: "Vendedor" },
  { value: "VC", label: "Contacto de proveedor" },
];

function Personas({ onVerPerfil }) {
  const [personas, setPersonas] = useState([]);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 25;

  useEffect(() => {
    let cancelado = false;

    setCargando(true);
    setError("");

    obtenerPersonas({ search, page, pageSize, type: tipo, sortBy: "lastName" })
      .then((res) => {
        if (cancelado) return;
        setPersonas(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelado) return;
        setError(err.message || "No se pudo conectar con el backend/base de datos");
        setPersonas([]);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [search, tipo, page]);

  const totalPaginas = Math.max(1, Math.ceil(total / pageSize));

  const handleVerPerfil = (id) => {
    onVerPerfil?.(id);
  };

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

        <div className="personas-filtros">
          {FILTROS_TIPO.map((f) => (
            <button
              key={f.value}
              className={`personas-chip${tipo === f.value ? " active" : ""}`}
              onClick={() => {
                setTipo(f.value);
                setPage(1);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="personas-total">
          {total.toLocaleString()} persona{total !== 1 ? "s" : ""}
        </p>
      </div>

      {error && (
        <p className="personas-error">
          ⚠️ {error} — verifica que el backend esté corriendo y conectado a
          AdventureWorks.
        </p>
      )}

      {cargando ? (
        <p className="empty-msg">Cargando personas...</p>
      ) : (
        <>
          <div className="personas-grid">
            {personas.map((p) => (
              <PersonaCard
                key={p.BusinessEntityID}
                persona={p}
                onVerPerfil={handleVerPerfil}
              />
            ))}

            {personas.length === 0 && !error && (
              <p className="empty-msg">Sin resultados para este filtro.</p>
            )}
          </div>

          <div className="personas-paginacion">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ← Anterior
            </button>

            <span>
              Página {page} de {totalPaginas} ({total.toLocaleString()} personas)
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
