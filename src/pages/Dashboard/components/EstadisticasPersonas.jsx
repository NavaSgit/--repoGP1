import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { obtenerEstadisticasPersonas } from "../../../services/api";
import "./EstadisticasPersonas.css";

// Paleta distinguible (no todo el mismo morado), con el morado de marca
// como color principal para la categoría más grande.
const COLORES = [
  "#621b7c", // morado marca (Individual)
  "#f2994a", // naranja
  "#2f9e6e", // verde
  "#2b8fd6", // azul
  "#e0475a", // rojo coral
  "#c9a227", // dorado
];

function formatearNumero(n) {
  return new Intl.NumberFormat("es-CO").format(n);
}

function EstadisticasPersonas() {
  const [porTipo, setPorTipo] = useState([]);
  const [porCiudad, setPorCiudad] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerEstadisticasPersonas()
      .then((res) => {
        setPorTipo(res.porTipo);
        setPorCiudad(res.porCiudad);
      })
      .catch((err) => {
        setError(
          err.message ||
            "No se pudo conectar con el backend/base de datos"
        );
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <p className="estadisticas-loading">Cargando estadísticas...</p>;
  }

  if (error) {
    return (
      <p className="estadisticas-error">
        ⚠️ {error} — verifica que el backend (Backend/) esté corriendo y
        conectado a la base de datos.
      </p>
    );
  }

  const totalPersonas = porTipo.reduce((acc, d) => acc + d.total, 0);

  return (
    <div className="estadisticas-container">
      {/* ===== PERSONAS POR TIPO ===== */}
      <div className="estadisticas-card">
        <h3>Personas por tipo</h3>

        <div className="estadisticas-tipo-layout">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={porTipo}
                dataKey="total"
                nameKey="etiqueta"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={100}
                paddingAngle={1.5}
                labelLine={false}
                label={({ percent }) =>
                  percent > 0.04 ? `${(percent * 100).toFixed(0)}%` : ""
                }
              >
                {porTipo.map((_, i) => (
                  <Cell key={i} fill={COLORES[i % COLORES.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [formatearNumero(value), name]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Lista propia en vez de la leyenda de recharts: más legible
              cuando una categoría domina sobre las demás */}
          <ul className="estadisticas-leyenda">
            {porTipo.map((item, i) => (
              <li key={item.tipo}>
                <span
                  className="estadisticas-punto"
                  style={{ background: COLORES[i % COLORES.length] }}
                />
                <span className="estadisticas-leyenda-nombre">
                  {item.etiqueta}
                </span>
                <span className="estadisticas-leyenda-valor">
                  {formatearNumero(item.total)}{" "}
                  <span className="estadisticas-leyenda-pct">
                    ({((item.total / totalPersonas) * 100).toFixed(1)}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ===== TOP 10 CIUDADES ===== */}
      <div className="estadisticas-card">
        <h3>Top 10 ciudades con más personas</h3>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={porCiudad}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
            barCategoryGap={14}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="ciudad"
              width={110}
              tick={{ fontSize: 13 }}
            />
            <Tooltip formatter={(value) => formatearNumero(value)} />
            <Bar dataKey="total" fill="#621b7c" radius={[0, 6, 6, 0]}>
              {porCiudad.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#621b7c" : "#9a4bb8"} />
              ))}
              <LabelList
                dataKey="total"
                position="right"
                formatter={formatearNumero}
                style={{ fill: "#333", fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EstadisticasPersonas;
