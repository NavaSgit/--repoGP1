import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { obtenerResumenDashboard } from "../../../services/api";
import "./Home.css";
import MapaMundial from "./MapaMundial";

function Home({ usuario }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError("");

    obtenerResumenDashboard()
      .then((res) => {
        if (!cancelado) setDatos(res);
      })
      .catch((err) => {
        if (!cancelado) setError(err.message || "No se pudo cargar el resumen");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  if (cargando)
    return <p className="empty-msg">Cargando resumen de NexusKeep...</p>;
  if (error) return <p className="empty-msg">⚠️ {error}</p>;
  if (!datos) return null;

  const { totales, porTipo, geografia, telefonosPorTipo } = datos;

  return (
    <div className="home">
      <div className="home-header">
        <h2>
          Bienvenido a NexusKeep{usuario?.usuario ? `, ${usuario.usuario}` : ""}
        </h2>
        <p>
          Hay <strong>{totales.personas.toLocaleString()}</strong> personas
          registradas en el sistema, distribuidas en {geografia.paises} países.
        </p>
      </div>

      <div className="home-kpis">
        <div className="card kpi-card">
          <h3>Total personas</h3>
          <p>{totales.personas.toLocaleString()}</p>
        </div>
        <div className="card kpi-card">
          <h3>Con correo</h3>
          <p>{totales.conCorreo.toLocaleString()}</p>
        </div>
        <div className="card kpi-card">
          <h3>Con teléfono</h3>
          <p>{totales.conTelefono.toLocaleString()}</p>
        </div>
        <div className="card kpi-card">
          <h3>Con dirección</h3>
          <p>{totales.conDireccion.toLocaleString()}</p>
        </div>
      </div>

      <div className="home-panels">
        <div className="card home-panel">
          <h3>Distribución por tipo de persona</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porTipo} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                horizontal={false}
              />
              <XAxis type="number" stroke="var(--text)" fontSize={12} />
              <YAxis
                type="category"
                dataKey="etiqueta"
                stroke="var(--text)"
                fontSize={12}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-strong)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text-h)",
                }}
              />
              <Bar dataKey="total" fill="var(--accent)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card home-panel">
          <h3>Geografía</h3>
          <div className="home-geo-mini">
            <div>
              <span className="home-geo-number">{geografia.paises}</span>
              <span className="home-geo-label">Países</span>
            </div>
            <div>
              <span className="home-geo-number">{geografia.estados}</span>
              <span className="home-geo-label">Estados/Prov.</span>
            </div>
            <div>
              <span className="home-geo-number">{geografia.ciudades}</span>
              <span className="home-geo-label">Ciudades</span>
            </div>
          </div>

          <p className="home-subtitle">Top países por personas</p>
          <ul className="home-list">
            {geografia.topPaises.map((p) => (
              <li key={p.pais}>
                <span>{p.pais}</span>
                <span className="home-list-total">
                  {p.total.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card home-panel">
          <h3>Contactabilidad · Teléfonos por tipo</h3>
          <ul className="home-list">
            {telefonosPorTipo.map((t) => (
              <li key={t.tipo}>
                <span>{t.tipo}</span>
                <span className="home-list-total">
                  {t.total.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card home-map-panel">
        <h3>Mapa global de personas</h3>
        <MapaMundial paises={geografia.todosPaises} />
      </div>
    </div>
  );
}

export default Home;
