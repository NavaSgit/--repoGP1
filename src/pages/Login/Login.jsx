import { useState } from "react";

import GradientWaves from "../../components/GradientWaves/GradientWaves";
import DepthText from "../../components/DepthText/DepthText";
import MaskedHeading from "../../components/Maskedheading/Maskedheading";

const CLAVE_STORAGE = "gp_usuarios_registrados";

// ========================================
// FUNCIONES PARA USUARIOS
// ========================================

const obtenerUsuariosRegistrados = () => {
  try {
    const datos = localStorage.getItem(CLAVE_STORAGE);

    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
};

const guardarUsuarioRegistrado = (nuevoUsuario) => {
  const usuarios = obtenerUsuariosRegistrados();

  usuarios.push(nuevoUsuario);

  localStorage.setItem(
    CLAVE_STORAGE,
    JSON.stringify(usuarios)
  );
};


// ========================================
// COMPONENTE LOGIN
// ========================================

function Login({ onLogin }) {

  // ======================================
  // LOGIN
  // ======================================

  const [modo, setModo] = useState("login");

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [usuarioError, setUsuarioError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPass, setShowPass] = useState(false);


  // ======================================
  // REGISTRO
  // ======================================

  const [regUsuario, setRegUsuario] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmar, setRegConfirmar] = useState("");

  const [regError, setRegError] = useState("");
  const [regUsuarioError, setRegUsuarioError] = useState("");
  const [regCorreoError, setRegCorreoError] = useState("");
  const [regPasswordError, setRegPasswordError] = useState("");
  const [regConfirmarError, setRegConfirmarError] = useState("");

  const [showRegPass, setShowRegPass] = useState(false);


  // ======================================
  // RECUPERACIÓN
  // ======================================

  const [recCorreo, setRecCorreo] = useState("");
  const [recCorreoError, setRecCorreoError] = useState("");

  const [recPassword, setRecPassword] = useState("");
  const [recConfirmar, setRecConfirmar] = useState("");

  const [recPasswordError, setRecPasswordError] = useState("");
  const [recConfirmarError, setRecConfirmarError] = useState("");

  const [recError, setRecError] = useState("");

  const [recStep, setRecStep] = useState(1);

  const [showRecPass, setShowRecPass] = useState(false);


  // ========================================
  // VALIDAR LOGIN
  // ========================================

  const validar = () => {

    let esValido = true;


    if (usuario.trim().length < 3) {

      setUsuarioError(
        "El usuario debe tener al menos 3 caracteres"
      );

      esValido = false;

    } else {

      setUsuarioError("");

    }


    if (password.length < 4) {

      setPasswordError(
        "La contraseña debe tener al menos 4 caracteres"
      );

      esValido = false;

    } else {

      setPasswordError("");

    }


    return esValido;
  };


  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = () => {

    setError("");

    if (!validar()) {
      return;
    }


    // Usuario temporal para pruebas
    if (
      usuario === "admin" &&
      password === "1234"
    ) {

      onLogin({
        usuario: "admin",
      });

      return;
    }


    // Buscar usuario registrado
    const usuarios =
      obtenerUsuariosRegistrados();


    const encontrado = usuarios.find(
      (u) =>
        u.usuario === usuario &&
        u.password === password
    );


    if (encontrado) {

      onLogin({
        usuario: encontrado.usuario,
      });

    } else {

      setError(
        "Usuario o contraseña incorrectos"
      );

    }
  };


  // ========================================
  // VALIDAR REGISTRO
  // ========================================

  const validarRegistro = () => {

    let esValido = true;

    const correoRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const usuarios =
      obtenerUsuariosRegistrados();


    // Usuario

    if (regUsuario.trim().length < 3) {

      setRegUsuarioError(
        "El usuario debe tener al menos 3 caracteres"
      );

      esValido = false;

    } else if (
      regUsuario.trim() === "admin" ||
      usuarios.some(
        (u) =>
          u.usuario ===
          regUsuario.trim()
      )
    ) {

      setRegUsuarioError(
        "Ese usuario ya está registrado"
      );

      esValido = false;

    } else {

      setRegUsuarioError("");

    }


    // Correo

    if (!correoRegex.test(regCorreo)) {

      setRegCorreoError(
        "Ingresa un correo electrónico válido"
      );

      esValido = false;

    } else if (
      usuarios.some(
        (u) =>
          u.correo ===
          regCorreo.trim()
      )
    ) {

      setRegCorreoError(
        "Ese correo ya está registrado"
      );

      esValido = false;

    } else {

      setRegCorreoError("");

    }


    // Contraseña

    if (regPassword.length < 4) {

      setRegPasswordError(
        "La contraseña debe tener al menos 4 caracteres"
      );

      esValido = false;

    } else {

      setRegPasswordError("");

    }


    // Confirmación

    if (
      regConfirmar !== regPassword
    ) {

      setRegConfirmarError(
        "Las contraseñas no coinciden"
      );

      esValido = false;

    } else {

      setRegConfirmarError("");

    }


    return esValido;
  };


  // ========================================
  // REGISTRO
  // ========================================

  const handleRegistro = () => {

    setRegError("");

    if (!validarRegistro()) {
      return;
    }


    guardarUsuarioRegistrado({

      usuario: regUsuario.trim(),

      correo: regCorreo.trim(),

      password: regPassword,

    });


    alert(
      "Cuenta creada 🎉 Ahora inicia sesión"
    );


    // Limpiar formulario

    setRegUsuario("");
    setRegCorreo("");
    setRegPassword("");
    setRegConfirmar("");

    setModo("login");
  };


  // ========================================
  // LOGIN CON CORREO
  // ========================================

  const handleLoginConCorreo = () => {

    alert(
      "Inicio de sesión con correo — próximamente"
    );

  };


  // ========================================
  // RECUPERAR CONTRASEÑA
  // ========================================

  const validarRecuperarCorreo = () => {

    const correoRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const usuarios =
      obtenerUsuariosRegistrados();


    if (!correoRegex.test(recCorreo)) {

      setRecCorreoError(
        "Ingresa un correo electrónico válido"
      );

      return false;
    }


    const encontrado =
      usuarios.find(
        (u) =>
          u.correo ===
          recCorreo.trim()
      );


    if (!encontrado) {

      setRecCorreoError(
        "No encontramos una cuenta con ese correo"
      );

      return false;
    }


    setRecCorreoError("");

    return true;
  };


  const handleVerificarCorreo = () => {

    if (validarRecuperarCorreo()) {

      setRecStep(2);

    }

  };


  // ========================================
  // VALIDAR NUEVA CONTRASEÑA
  // ========================================

  const validarCambiarPassword = () => {

    let esValido = true;


    if (recPassword.length < 4) {

      setRecPasswordError(
        "La contraseña debe tener al menos 4 caracteres"
      );

      esValido = false;

    } else {

      setRecPasswordError("");

    }


    if (
      recConfirmar !== recPassword
    ) {

      setRecConfirmarError(
        "Las contraseñas no coinciden"
      );

      esValido = false;

    } else {

      setRecConfirmarError("");

    }


    return esValido;
  };


  // ========================================
  // CAMBIAR CONTRASEÑA
  // ========================================

  const handleCambiarPassword = () => {

    setRecError("");

    if (!validarCambiarPassword()) {
      return;
    }


    const usuarios =
      obtenerUsuariosRegistrados();


    const indice =
      usuarios.findIndex(
        (u) =>
          u.correo ===
          recCorreo.trim()
      );


    if (indice !== -1) {

      usuarios[indice].password =
        recPassword;


      localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify(usuarios)
      );


      alert(
        "Contraseña cambiada exitosamente 🎉"
      );


      // Limpiar

      setRecCorreo("");
      setRecPassword("");
      setRecConfirmar("");

      setRecStep(1);

      setModo("login");
    }

  };


  // ========================================
  // INTERFAZ
  // ========================================

  return (

    <div style={containerStyle}>

      {/* FONDO */}

      <div
        style={gradientWavesWrapperStyle}
      >

        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#ca9fff"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />

      </div>


      {/* ==================================
          SECCIÓN IZQUIERDA
      ================================== */}

      <div
        style={leftSectionStyle}
        data-left-section
      >

        <MaskedHeading
          text="Bienvenido a NexusKeep"
          tag="h1"
          align="left"
          textScale={0.18}
          weight={900}
          tracking={-0.003}
          style={{
            width: "100%",
            maxWidth:
              "clamp(350px, 45vw, 900px)",
            marginBottom:
              "clamp(50px, 15vh, 200px)",
          }}
        />


        <p style={descriptionStyle}>

          Una plataforma segura y eficiente
          para gestionar tu base de datos.

          Almacena, organiza y accede a tu
          información desde cualquier lugar.

        </p>

      </div>


      {/* ==================================
          SECCIÓN DERECHA
      ================================== */}

      <div
        style={rightSectionStyle}
        data-right-section
      >

        <div
          style={cardStyle}
          className="card-responsive"
        >

          {/* LOGO */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              marginBottom:
                "clamp(8px, 1.5vw, 14px)",
            }}
          >

            <DepthText
              text="NexusKeep"
              layers={24}
              depth={1.6}
              faceColor="#e7dce9"
              depthColor="#621b7c"
              fontSize="clamp(1.8rem, 5vw, 1.8rem)"
              fontWeight={900}
              perspective={600}
            />

          </div>


          {/* TÍTULO */}

          {modo !== "login" && (

            <h1 style={titleStyle}>

              {modo === "registro" &&
                "Crear cuenta"}

              {modo === "recuperar" &&
                "Recuperar contraseña"}

            </h1>

          )}


          {/* ==================================
              LOGIN
          ================================== */}

          {modo === "login" ? (

            <>

              {error && (

                <p style={errorStyle}>
                  {error}
                </p>

              )}


              {/* Usuario */}

              <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) =>
                  setUsuario(e.target.value)
                }
                style={inputStyle}
              />


              {usuarioError && (

                <p style={fieldErrorStyle}>
                  {usuarioError}
                </p>

              )}


              {/* Contraseña */}

              <div
                style={{
                  position: "relative",
                }}
              >

                <input
                  type={
                    showPass
                      ? "text"
                      : "password"
                  }
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  style={inputStyle}
                />


                <span
                  onClick={() =>
                    setShowPass(!showPass)
                  }
                  style={eyeStyle}
                >

                  {showPass
                    ? "🙈"
                    : "👁️"}

                </span>

              </div>


              {passwordError && (

                <p style={fieldErrorStyle}>
                  {passwordError}
                </p>

              )}


              {/* Botón */}

              <button
                onClick={handleLogin}
                style={buttonStyle}
                onMouseOver={(e) =>
                  (e.target.style.background =
                    "#625a5a")
                }
                onMouseOut={(e) =>
                  (e.target.style.background =
                    "#621b7c")
                }
              >

                Ingresar

              </button>


              {/* Separador */}

              <div style={dividerStyle}>

                <span
                  style={dividerLineStyle}
                />

                <span
                  style={dividerTextStyle}
                >
                  o
                </span>

                <span
                  style={dividerLineStyle}
                />

              </div>


              {/* Correo */}

              <button
                onClick={handleLoginConCorreo}
                style={correoButtonStyle}
                type="button"
              >

                <span
                  style={correoIconStyle}
                >
                  ✉️
                </span>

                Ingresar con correo
                electrónico

              </button>


              {/* Recuperar */}

              <p style={footerStyle}>

                <span
                  style={switchModoLinkStyle}
                  onClick={() =>
                    setModo("recuperar")
                  }
                >

                  ¿Olvidaste tu contraseña?

                </span>

              </p>


              {/* Registro */}

              <p style={switchModoStyle}>

                ¿No tienes cuenta?{" "}

                <span
                  style={switchModoLinkStyle}
                  onClick={() =>
                    setModo("registro")
                  }
                >

                  Regístrate

                </span>

              </p>

            </>

          ) : modo === "registro" ? (

            /* ==================================
               REGISTRO
            ================================== */

            <>

              {regError && (

                <p style={errorStyle}>
                  {regError}
                </p>

              )}


              <input
                type="text"
                placeholder="Usuario"
                value={regUsuario}
                onChange={(e) =>
                  setRegUsuario(e.target.value)
                }
                style={inputStyle}
              />


              {regUsuarioError && (

                <p style={fieldErrorStyle}>
                  {regUsuarioError}
                </p>

              )}


              <input
                type="email"
                placeholder="Correo electrónico"
                value={regCorreo}
                onChange={(e) =>
                  setRegCorreo(e.target.value)
                }
                style={inputStyle}
              />


              {regCorreoError && (

                <p style={fieldErrorStyle}>
                  {regCorreoError}
                </p>

              )}


              <div
                style={{
                  position: "relative",
                }}
              >

                <input
                  type={
                    showRegPass
                      ? "text"
                      : "password"
                  }
                  placeholder="Contraseña"
                  value={regPassword}
                  onChange={(e) =>
                    setRegPassword(e.target.value)
                  }
                  style={inputStyle}
                />


                <span
                  onClick={() =>
                    setShowRegPass(!showRegPass)
                  }
                  style={eyeStyle}
                >

                  {showRegPass
                    ? "🙈"
                    : "👁️"}

                </span>

              </div>


              {regPasswordError && (

                <p style={fieldErrorStyle}>
                  {regPasswordError}
                </p>

              )}


              <input
                type={
                  showRegPass
                    ? "text"
                    : "password"
                }
                placeholder="Confirmar contraseña"
                value={regConfirmar}
                onChange={(e) =>
                  setRegConfirmar(e.target.value)
                }
                style={inputStyle}
              />


              {regConfirmarError && (

                <p style={fieldErrorStyle}>
                  {regConfirmarError}
                </p>

              )}


              <button
                onClick={handleRegistro}
                style={buttonStyle}
              >

                Crear cuenta

              </button>


              <p style={switchModoStyle}>

                ¿Ya tienes cuenta?{" "}

                <span
                  style={switchModoLinkStyle}
                  onClick={() =>
                    setModo("login")
                  }
                >

                  Inicia sesión

                </span>

              </p>

            </>

          ) : (

            /* ==================================
               RECUPERACIÓN
            ================================== */

            <>

              {recStep === 1 ? (

                <>

                  <p style={recInfoStyle}>

                    Ingresa el correo electrónico
                    asociado a tu cuenta y te
                    ayudaremos a recuperarla.

                  </p>


                  {recCorreoError && (

                    <p style={errorStyle}>
                      {recCorreoError}
                    </p>

                  )}


                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={recCorreo}
                    onChange={(e) =>
                      setRecCorreo(e.target.value)
                    }
                    style={inputStyle}
                  />


                  <button
                    onClick={handleVerificarCorreo}
                    style={buttonStyle}
                  >

                    Verificar correo

                  </button>

                </>

              ) : (

                <>

                  <p style={recInfoStyle}>

                    Correo verificado ✅

                    <br />

                    Ingresa tu nueva contraseña.

                  </p>


                  {recError && (

                    <p style={errorStyle}>
                      {recError}
                    </p>

                  )}


                  <div
                    style={{
                      position: "relative",
                    }}
                  >

                    <input
                      type={
                        showRecPass
                          ? "text"
                          : "password"
                      }
                      placeholder="Nueva contraseña"
                      value={recPassword}
                      onChange={(e) =>
                        setRecPassword(e.target.value)
                      }
                      style={inputStyle}
                    />


                    <span
                      onClick={() =>
                        setShowRecPass(
                          !showRecPass
                        )
                      }
                      style={eyeStyle}
                    >

                      {showRecPass
                        ? "🙈"
                        : "👁️"}

                    </span>

                  </div>


                  {recPasswordError && (

                    <p style={fieldErrorStyle}>
                      {recPasswordError}
                    </p>

                  )}


                  <input
                    type={
                      showRecPass
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirmar nueva contraseña"
                    value={recConfirmar}
                    onChange={(e) =>
                      setRecConfirmar(e.target.value)
                    }
                    style={inputStyle}
                  />


                  {recConfirmarError && (

                    <p style={fieldErrorStyle}>
                      {recConfirmarError}
                    </p>

                  )}


                  <button
                    onClick={
                      handleCambiarPassword
                    }
                    style={buttonStyle}
                  >

                    Cambiar contraseña

                  </button>

                </>

              )}


              <p style={switchModoStyle}>

                <span
                  style={switchModoLinkStyle}
                  onClick={() => {

                    setModo("login");
                    setRecStep(1);

                  }}
                >

                  Volver a iniciar sesión

                </span>

              </p>

            </>

          )}

        </div>

      </div>

    </div>
  );
}


// ========================================
// ESTILOS
// ========================================

const containerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background:
    "linear-gradient(135deg, #11102c, #621b7c)",
  overflow: "hidden",
  boxSizing: "border-box",
  padding: "40px 60px",
};


const gradientWavesWrapperStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
};


const leftSectionStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  zIndex: 1,
  maxWidth: "900px",
  paddingRight: "40px",
};


const descriptionStyle = {
  position: "fixed",
  bottom: "5vh",
  left: "20vw",
  width:
    "clamp(200px, 105vw, 700px)",
  color: "#f7f6fa",
  fontSize:
    "clamp(14px, 1.9vw, 20px)",
  lineHeight: "1.6",
  textAlign: "center",
};


const rightSectionStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  zIndex: 1,
};


const cardStyle = {
  position: "relative",
  zIndex: 1,
  width: "320px",
  padding: "40px",
  borderRadius: "20px",
  background:
    "rgba(20,20,20,0.85)",
  backdropFilter: "blur(15px)",
  boxShadow:
    "0 0 40px rgba(0,0,0,0.6)",
  animation:
    "fadeIn 0.8s ease",
  boxSizing: "border-box",
};


const titleStyle = {
  color: "white",
  textAlign: "center",
  marginBottom: "25px",
  fontSize: "28px",
  fontWeight: "bold",
};


const inputStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "none",
  background: "#333",
  color: "white",
  outline: "none",
  boxSizing: "border-box",
};


const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#621b7c",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s",
};


const errorStyle = {
  color: "#ff6b6b",
  textAlign: "center",
  marginBottom: "10px",
};


const fieldErrorStyle = {
  color: "#ff6b6b",
  fontSize: "12px",
  textAlign: "left",
  margin:
    "-10px 0 12px 4px",
};


const dividerStyle = {
  display: "flex",
  alignItems: "center",
  margin: "16px 0",
};


const dividerLineStyle = {
  flex: 1,
  height: "1px",
  background:
    "rgba(255,255,255,0.2)",
};


const dividerTextStyle = {
  color: "#9a8fb0",
  fontSize: "12px",
  margin: "0 10px",
};


const correoButtonStyle = {
  width: "100%",
  padding: "12px",
  background:
    "rgba(52, 51, 51, 0.3)",
  color: "white",
  border:
    "1px solid rgba(255,255,255,0.3)",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};


const correoIconStyle = {
  fontSize: "16px",
};


const switchModoStyle = {
  color: "#b8a8d8",
  fontSize: "13px",
  textAlign: "center",
  marginTop: "18px",
};


const switchModoLinkStyle = {
  color: "#ca9fff",
  fontWeight: "bold",
  cursor: "pointer",
  textDecoration: "underline",
};


const footerStyle = {
  color: "#7b52b8",
  fontSize: "12px",
  textAlign: "center",
  marginTop: "15px",
  cursor: "pointer",
};


const recInfoStyle = {
  color: "#b8a8d8",
  fontSize: "13px",
  textAlign: "center",
  marginBottom: "18px",
  lineHeight: "1.5",
};


const eyeStyle = {
  position: "absolute",
  right: "10px",
  top: "10px",
  cursor: "pointer",
  color: "#6744c7",
};


// ========================================
// ANIMACIONES Y RESPONSIVE
// ========================================

const styleSheet =
  document.createElement("style");

styleSheet.innerHTML = `

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

@keyframes fadeIn {

  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }

}


@media (max-width: 768px) {

  div[data-left-section] {
    max-width: 100% !important;
    margin-bottom: 40px !important;
  }

  div[data-right-section] {
    justify-content: center !important;
  }

}


@media (max-width: 480px) {

  .card-responsive {
    width: calc(100% - 30px) !important;
    padding: 30px 15px !important;
    max-width: 100% !important;
  }

  .card-responsive input {
    font-size: 14px !important;
    padding: 10px 12px !important;
  }

  .card-responsive h1 {
    font-size: 24px !important;
  }

  .card-responsive button {
    font-size: 13px !important;
    padding: 10px !important;
  }

}


@media (min-width: 481px) and (max-width: 768px) {

  .card-responsive {
    width: calc(100% - 40px) !important;
    padding: 35px 20px !important;
    max-width: 95% !important;
  }

  .card-responsive input {
    font-size: 14px !important;
  }

}


@media (min-width: 769px) {

  .card-responsive {
    width: 320px !important;
    padding: 40px !important;
  }

  .card-responsive input {
    font-size: 15px !important;
  }

}

`;

document.head.appendChild(styleSheet);


export default Login;