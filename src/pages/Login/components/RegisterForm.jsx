import { useState } from "react";
import {
  obtenerUsuariosRegistrados,
  guardarUsuarioRegistrado,
} from "../utils/localUsuarios";
import {
  errorStyle,
  inputStyle,
  fieldErrorStyle,
  buttonStyle,
  switchModoStyle,
  switchModoLinkStyle,
  eyeStyle,
} from "../Login.styles";

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterForm({ onRegistroExitoso, onIrALogin }) {
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

  const validarRegistro = () => {
    let esValido = true;
    const usuarios = obtenerUsuariosRegistrados();

    // Usuario
    if (regUsuario.trim().length < 3) {
      setRegUsuarioError("El usuario debe tener al menos 3 caracteres");
      esValido = false;
    } else if (
      regUsuario.trim() === "admin" ||
      usuarios.some((u) => u.usuario === regUsuario.trim())
    ) {
      setRegUsuarioError("Ese usuario ya está registrado");
      esValido = false;
    } else {
      setRegUsuarioError("");
    }

    // Correo
    if (!CORREO_REGEX.test(regCorreo)) {
      setRegCorreoError("Ingresa un correo electrónico válido");
      esValido = false;
    } else if (usuarios.some((u) => u.correo === regCorreo.trim())) {
      setRegCorreoError("Ese correo ya está registrado");
      esValido = false;
    } else {
      setRegCorreoError("");
    }

    // Contraseña
    if (regPassword.length < 4) {
      setRegPasswordError("La contraseña debe tener al menos 4 caracteres");
      esValido = false;
    } else {
      setRegPasswordError("");
    }

    // Confirmación
    if (regConfirmar !== regPassword) {
      setRegConfirmarError("Las contraseñas no coinciden");
      esValido = false;
    } else {
      setRegConfirmarError("");
    }

    return esValido;
  };

  const handleRegistro = () => {
    setRegError("");

    if (!validarRegistro()) return;

    guardarUsuarioRegistrado({
      usuario: regUsuario.trim(),
      correo: regCorreo.trim(),
      password: regPassword,
    });

    alert("Cuenta creada 🎉 Ahora inicia sesión");

    setRegUsuario("");
    setRegCorreo("");
    setRegPassword("");
    setRegConfirmar("");

    onRegistroExitoso();
  };

  return (
    <>
      {regError && <p style={errorStyle}>{regError}</p>}

      <input
        type="text"
        placeholder="Usuario"
        value={regUsuario}
        onChange={(e) => setRegUsuario(e.target.value)}
        style={inputStyle}
      />
      {regUsuarioError && <p style={fieldErrorStyle}>{regUsuarioError}</p>}

      <input
        type="email"
        placeholder="Correo electrónico"
        value={regCorreo}
        onChange={(e) => setRegCorreo(e.target.value)}
        style={inputStyle}
      />
      {regCorreoError && <p style={fieldErrorStyle}>{regCorreoError}</p>}

      <div style={{ position: "relative" }}>
        <input
          type={showRegPass ? "text" : "password"}
          placeholder="Contraseña"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
          style={inputStyle}
        />
        <span onClick={() => setShowRegPass(!showRegPass)} style={eyeStyle}>
          {showRegPass ? "🙈" : "👁️"}
        </span>
      </div>
      {regPasswordError && <p style={fieldErrorStyle}>{regPasswordError}</p>}

      <input
        type={showRegPass ? "text" : "password"}
        placeholder="Confirmar contraseña"
        value={regConfirmar}
        onChange={(e) => setRegConfirmar(e.target.value)}
        style={inputStyle}
      />
      {regConfirmarError && (
        <p style={fieldErrorStyle}>{regConfirmarError}</p>
      )}

      <button onClick={handleRegistro} style={buttonStyle}>
        Crear cuenta
      </button>

      <p style={switchModoStyle}>
        ¿Ya tienes cuenta?{" "}
        <span style={switchModoLinkStyle} onClick={onIrALogin}>
          Inicia sesión
        </span>
      </p>
    </>
  );
}

export default RegisterForm;
