const ETIQUETAS_TIPO = {
  IN: "Individual",
  EM: "Empleado",
  SC: "Contacto de tienda",
  VC: "Contacto de proveedor",
  GC: "Contacto general",
  SP: "Vendedor",
};

const IconUser = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.7-4 3.4-6.5 7-6.5s6.3 2.5 7 6.5" />
  </svg>
);

const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

const IconPhone = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 4.5h3.5l1.5 4-2 1.5c.9 2.3 2.7 4.1 5 5l1.5-2 4 1.5V18c0 1-.9 1.8-1.9 1.6-6-1.1-10.3-5.4-11.4-11.4C4.7 7.1 4.8 4.5 5 4.5Z" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function PersonaCard({ persona, onVerPerfil }) {
  const nombreCompleto = `${persona.FirstName} ${persona.LastName}`;
  const etiquetaTipo = ETIQUETAS_TIPO[persona.PersonType] || persona.PersonType;

  return (
    <div className="persona-card">
      <div className="persona-card-top">
        <span className="persona-avatar">
          <IconUser />
        </span>
        <div className="persona-card-info">
          <h3>{nombreCompleto}</h3>
          <span className="persona-badge">{etiquetaTipo}</span>
        </div>
      </div>

      <div className="persona-card-contact">
        <span>
          <IconMail /> {persona.EmailAddress || "Sin correo"}
        </span>
        <span>
          <IconPhone /> {persona.PhoneNumber || "Sin teléfono"}
        </span>
      </div>

       <div className="persona-card-footer">
        <button
          className="persona-card-link"
          onClick={() => onVerPerfil?.(persona.BusinessEntityID)}
        >
          Perfil
          <IconArrow />
        </button>
      </div>
    </div>
  );
}

export default PersonaCard;
