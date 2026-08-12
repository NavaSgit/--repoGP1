import "./Projects.css";

function Projects() {
  return (
    <section className="projects">

      <div className="projects-header">
        <div>
          <h2>Mis proyectos</h2>
          <p>Administra tus proyectos actuales.</p>
        </div>

        <button className="new-project">
          + Nuevo proyecto
        </button>
      </div>

      <div className="projects-list">

        <div className="project-card">
          <h3>Proyecto de prueba</h3>
          <p>Descripción del proyecto</p>

          <div className="project-info">
            <span>📅 Fecha límite</span>
            <span>📊 En progreso</span>
          </div>
        </div>

        <div className="project-card">
          <h3>Proyecto académico</h3>
          <p>Proyecto de Gerencia de Proyectos</p>

          <div className="project-info">
            <span>📅 Fecha límite</span>
            <span>📊 Pendiente</span>
          </div>
        </div>

      </div>

    </section>
  );
}

export default Projects;