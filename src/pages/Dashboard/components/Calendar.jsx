import { useEffect, useMemo, useState } from "react";
import "./Calendar.css";

const CLAVE_TAREAS = "gp_tareas";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const obtenerTareas = () => {
  try {
    const datos = localStorage.getItem(CLAVE_TAREAS);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
};

function Calendar() {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    setTareas(obtenerTareas());
  }, []);

  const diasDelMes = useMemo(() => {
    const primerDia = new Date(anioActual, mesActual, 1).getDay();
    const totalDias = new Date(anioActual, mesActual + 1, 0).getDate();

    const celdas = [];
    for (let i = 0; i < primerDia; i++) celdas.push(null);
    for (let d = 1; d <= totalDias; d++) celdas.push(d);
    return celdas;
  }, [mesActual, anioActual]);

  const tareasPorDia = (dia) => {
    if (!dia) return [];
    const fechaStr = `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return tareas.filter((t) => t.fecha === fechaStr);
  };

  const esHoy = (dia) =>
    dia === hoy.getDate() &&
    mesActual === hoy.getMonth() &&
    anioActual === hoy.getFullYear();

  const cambiarMes = (delta) => {
    let nuevoMes = mesActual + delta;
    let nuevoAnio = anioActual;

    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio -= 1;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio += 1;
    }

    setMesActual(nuevoMes);
    setAnioActual(nuevoAnio);
  };

  return (
    <section className="calendar">
      <div className="calendar-header">
        <button onClick={() => cambiarMes(-1)}>←</button>
        <h2>
          {MESES[mesActual]} {anioActual}
        </h2>
        <button onClick={() => cambiarMes(1)}>→</button>
      </div>

      <div className="calendar-grid calendar-days-label">
        {DIAS.map((d) => (
          <div key={d} className="calendar-day-label">
            {d}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {diasDelMes.map((dia, idx) => (
          <div
            key={idx}
            className={`calendar-cell ${dia ? "" : "empty"} ${
              esHoy(dia) ? "today" : ""
            }`}
          >
            {dia && (
              <>
                <span className="cell-number">{dia}</span>
                {tareasPorDia(dia).map((t) => (
                  <span key={t.id} className="cell-task" title={t.titulo}>
                    • {t.titulo}
                  </span>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Calendar;
