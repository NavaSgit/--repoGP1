import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Projects from "./components/Projects";
import "./Dashboard.css";

function Dashboard({ usuario, onLogout }) {
  return (
    <div className="dashboard">

      <Sidebar />

      <section className="dashboard-content">

        <Header usuario={usuario} />

        <main className="dashboard-main">

          <h2>Resumen</h2>

          <div className="dashboard-cards">
            <div className="card">
              <h3>Proyectos</h3>
              <p>0</p>
            </div>

            

            <div className="card">
              <h3>Tareas</h3>
              <p>0</p>
            </div>

            <div className="card">
              <h3>Equipo</h3>
              <p>0</p>
            </div>
          </div>

          <Projects />

          <button onClick={onLogout}>
            Cerrar sesión
          </button>

        </main>

      </section>

    </div>
  );
}

export default Dashboard;