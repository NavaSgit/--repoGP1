import { useEffect, useState } from "react";
import { obtenerPersonaPorId } from "../../../services/api";
import UbicacionesSeccion from "./UbicacionesSeccion";
import "./PersonaPerfil.css";

const ETIQUETAS_TIPO = {
  IN: "Individual",
  EM: "Empleado",
  SC: "Contacto de tienda",
  VC: "Contacto de proveedor",
  GC: "Contacto general",
  SP: "Vendedor",
};

// Nombres reales de Person.PhoneNumberType (1 Cell, 2 Home, 3 Work)
const ETIQUETAS_TELEFONO = {
  Cell: "Celular",
  Home: "Casa",
  Work: "Trabajo",
};

const FUTURAS = [
  "Favoritos",
  "Relaciones",
  "Actividad",
  "Notas",
  "Organizaciones",
  "Contactos",
];

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const IconBack = () => (
  <svg {...svgProps}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
const IconMail = () => (
  <svg {...svgProps}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);
const IconPhone = () => (
  <svg {...svgProps}>
    <path d="M5 4.5h3.5l1.5 4-2 1.5c.9 2.3 2.7 4.1 5 5l1.5-2 4 1.5V18c0 1-.9 1.8-1.9 1.6-6-1.1-10.3-5.4-11.4-11.4C4.7 7.1 4.8 4.5 5 4.5Z" />
  </svg>
);
const IconPin = () => (
  <svg {...svgProps}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
const IconCopy = () => (
  <svg {...svgProps}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);
const IconCheck = () => (
  <svg {...svgProps}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

function BotonCopiar({ texto, claro = false }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      /* si el navegador bloquea el portapapeles, no se hace nada */
    }
  };

  return (
    <button
      type="button"
      className={`perfil-copiar${claro ? " perfil-copiar-claro" : ""}`}
      onClick={copiar}
      title={copiado ? "Copiado" : "Copiar"}
      aria-label={copiado ? "Copiado" : "Copiar"}
    >
      {copiado ? <IconCheck /> : <IconCopy />}
    </button>
  );
}

function Dato({ label, valor }) {
  return (
    <div className="perfil-dato">
      <dt>{label}</dt>
      <dd>{valor || <span className="perfil-vacio">No disponible</span>}</dd>
    </div>
  );
}

function formatearFecha(valor) {
  if (!valor) return null;
  const f = new Date(valor);
  if (Number.isNaN(f.getTime())) return null;
  return f.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PersonaPerfil({ id, onVolver }) {
  const [persona, setPersona] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState(""); // "", "error", "noEncontrada"

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setEstado("");
    setPersona(null);

    obtenerPersonaPorId(id)
      .then((data) => {
        if (!cancelado) setPersona(data);
      })
      .catch((err) => {
        if (cancelado) return;
        setEstado(err.status === 404 ? "noEncontrada" : "error");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  const volver = (
    <button className="perfil-volver" onClick={onVolver}>
      <IconBack /> Volver a Personas
    </button>
  );

  if (cargando) {
    return (
      <div className="perfil-container">
        {volver}
        <p className="perfil-mensaje">Cargando información...</p>
      </div>
    );
  }

  if (estado === "noEncontrada") {
    return (
      <div className="perfil-container">
        {volver}
        <p className="perfil-mensaje">No se encontró la persona solicitada.</p>
      </div>
    );
  }

  if (estado === "error" || !persona) {
    return (
      <div className="perfil-container">
        {volver}
        <p className="perfil-mensaje perfil-mensaje-error">
          No fue posible cargar la información de esta persona.
        </p>
      </div>
    );
  }

  const correos = persona.correos || [];
  const telefonos = persona.telefonos || [];
  const direcciones = persona.direcciones || [];

  console.log("Perfil", persona.BusinessEntityID, "direcciones:", direcciones);
  
  const nombreCompleto = [
    persona.Title,
    persona.FirstName,
    persona.MiddleName,
    persona.LastName,
    persona.Suffix,
  ]
    .filter(Boolean)
    .join(" ");

  const iniciales = `${persona.FirstName?.[0] || ""}${
    persona.LastName?.[0] || ""
  }`.toUpperCase();
  const etiquetaTipo = ETIQUETAS_TIPO[persona.PersonType] || persona.PersonType;
  const correoPrincipal = correos[0];
  const telefonoPrincipal = telefonos[0];
  const fechaModificacion = formatearFecha(persona.ModifiedDate);

  return (
    <div className="perfil-container">
      {volver}

      {/* 1. ENCABEZADO */}
      <section className="perfil-hero">
        <span className="perfil-avatar">{iniciales || "?"}</span>

        <div className="perfil-hero-info">
          <h2>{nombreCompleto}</h2>

          <div className="perfil-hero-meta">
            <span className="perfil-badge">{etiquetaTipo}</span>
            <span className="perfil-id">ID {persona.BusinessEntityID}</span>
          </div>

          <div className="perfil-hero-contacto">
            {correoPrincipal && (
              <span className="perfil-hero-linea">
                <IconMail />
                {correoPrincipal}
                <BotonCopiar texto={correoPrincipal} claro />
              </span>
            )}
            {telefonoPrincipal && (
              <span className="perfil-hero-linea">
                <IconPhone />
                {telefonoPrincipal.PhoneNumber}
                <BotonCopiar texto={telefonoPrincipal.PhoneNumber} claro />
              </span>
            )}
            {!correoPrincipal && !telefonoPrincipal && (
              <span className="perfil-hero-linea perfil-hero-vacio">
                Sin datos de contacto
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 5. RESUMEN */}
      <section className="perfil-resumen">
        <div className="perfil-stat">
          <strong>{correos.length}</strong>
          <span>Correo{correos.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="perfil-stat">
          <strong>{telefonos.length}</strong>
          <span>Teléfono{telefonos.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="perfil-stat">
          <strong>{direcciones.length}</strong>
          <span>Ubicaci{direcciones.length !== 1 ? "ones" : "ón"}</span>
        </div>
      </section>

      <div className="perfil-grid">
        {/* 2. INFORMACIÓN PERSONAL */}
        <section className="perfil-card">
          <h3>Información personal</h3>
          <dl className="perfil-datos">
            <Dato label="Nombre" valor={persona.FirstName} />
            <Dato label="Segundo nombre" valor={persona.MiddleName} />
            <Dato label="Apellido" valor={persona.LastName} />
            <Dato label="Título" valor={persona.Title} />
            <Dato label="Sufijo" valor={persona.Suffix} />
            <Dato
              label="Tipo de persona"
              valor={`${etiquetaTipo} (${persona.PersonType})`}
            />
            <Dato label="BusinessEntityID" valor={persona.BusinessEntityID} />
            <Dato label="Última modificación" valor={fechaModificacion} />
          </dl>
        </section>

        {/* 3. CONTACTO */}
        <section className="perfil-card">
          <h3>Contacto</h3>

          <p className="perfil-subtitulo">Correos electrónicos</p>
          {correos.length ? (
            correos.map((c, i) => (
              <p className="perfil-linea" key={`${c}-${i}`}>
                <IconMail />
                <a href={`mailto:${c}`}>{c}</a>
                <BotonCopiar texto={c} />
              </p>
            ))
          ) : (
            <p className="perfil-vacio">No disponible</p>
          )}

          <p className="perfil-subtitulo">Teléfonos</p>
          {telefonos.length ? (
            telefonos.map((t, i) => (
              <p className="perfil-linea" key={`${t.PhoneNumber}-${i}`}>
                <IconPhone />
                <span>{t.PhoneNumber}</span>
                {t.PhoneNumberType && (
                  <span className="perfil-tag">
                    {ETIQUETAS_TELEFONO[t.PhoneNumberType] || t.PhoneNumberType}
                  </span>
                )}
                <BotonCopiar texto={t.PhoneNumber} />
              </p>
            ))
          ) : (
            <p className="perfil-vacio">No disponible</p>
          )}
        </section>
      </div>

            {/* 4. UBICACIONES (texto + mapa) */}
      <UbicacionesSeccion id={persona.BusinessEntityID} direcciones={direcciones} />

      {/* 9. FUNCIONALIDADES FUTURAS (solo estructura, sin datos ni lógica) */}
      <section className="perfil-card">
        <h3>Próximamente</h3>
        <div className="perfil-futuras">
          {FUTURAS.map((nombre) => (
            <span
              key={nombre}
              className="perfil-futura"
              aria-disabled="true"
              title="Disponible en una etapa posterior"
            >
              {nombre}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PersonaPerfil;