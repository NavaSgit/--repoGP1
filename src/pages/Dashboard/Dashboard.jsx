import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";
import Calendar from "./components/Calendar";
import Team from "./components/Team";
import Personas from "./components/Personas";
import "./Dashboard.css";

const contarStorage = (clave) => {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos).length : 0;
  } catch {
    return 0;
  }
};

const TITULOS = {
  inicio: { titulo: "Dashboard", subtitulo: "Resumen general" },
  proyectos: {
    titulo: "Proyectos",
    subtitulo: "Administra tus proyectos actuales",
  },
  tareas: { titulo: "Tareas", subtitulo: "Organiza tus pendientes" },
  calendario: {
    titulo: "Calendario",
    subtitulo: "Visualiza tus fechas importantes",
  },
  equipo: {
    titulo: "Equipo",
    subtitulo: "Gestiona a los miembros de tu equipo",
  },
  personas: {
    titulo: "Personas",
    subtitulo: "Datos reales desde AdventureWorks2008R2 (esquema Person)",
  },
};

function Dashboard({ usuario, onLogout }) {
  const [vista, setVista] = useState("inicio");
  const [contadores, setContadores] = useState({
    proyectos: 0,
    tareas: 0,
    equipo: 0,
  });

  useEffect(() => {
    setContadores({
      proyectos: contarStorage("gp_proyectos"),
      tareas: contarStorage("gp_tareas"),
      equipo: contarStorage("gp_equipo"),
    });
  }, [vista]);

  return (
    <div className="dashboard">
      <Sidebar vistaActiva={vista} onNavigate={setVista} />

      <section className="dashboard-content">
        <Header
          titulo={TITULOS[vista].titulo}
          subtitulo={
            vista === "inicio"
              ? `Bienvenido de nuevo, ${usuario.usuario}`
              : TITULOS[vista].subtitulo
          }
          usuario={usuario}
          onLogout={onLogout}
        />

        <main className="dashboard-main">
          {vista === "inicio" && (
            <>
              <div className="dashboard-cards">
                <div className="card">
                  <h3>Proyectos</h3>
                  <p>{contadores.proyectos}</p>
                </div>
                <div className="card">
                  <h3>Tareas</h3>
                  <p>{contadores.tareas}</p>
                </div>
                <div className="card">
                  <h3>Equipo</h3>
                  <p>{contadores.equipo}</p>
                </div>
              </div>

              <Projects />
            </>
          )}

          {vista === "proyectos" && <Projects />}
          {vista === "tareas" && <Tasks />}
          {vista === "calendario" && <Calendar />}
          {vista === "equipo" && <Team />}
          {vista === "personas" && <Personas />}
        </main>
      </section>
    </div>
  );
}

export default Dashboard;
