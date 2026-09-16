import { useState } from "react";
import {
  obtenerUsuariosRegistrados,
  actualizarPasswordPorCorreo,
} from "../utils/localUsuarios";
import { IconEye, IconEyeOff, IconCheckCircle } from "../icons";
import {
  errorStyle,
  inputStyle,
  fieldErrorStyle,
  buttonStyle,
  switchModoStyle,
  switchModoLinkStyle,
  recInfoStyle,
  eyeStyle,
} from "../Login.styles";

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RecoverForm({ onRecuperacionExitosa, onIrALogin }) {
  const [recCorreo, setRecCorreo] = useState("");
  const [recCorreoError, setRecCorreoError] = useState("");

  const [recPassword, setRecPassword] = useState("");
  const [recConfirmar, setRecConfirmar] = useState("");

  const [recPasswordError, setRecPasswordError] = useState("");
  const [recConfirmarError, setRecConfirmarError] = useState("");

  const [recError, setRecError] = useState("");
  const [recStep, setRecStep] = useState(1);
  const [showRecPass, setShowRecPass] = useState(false);

  const validarRecuperarCorreo = () => {
    const usuarios = obtenerUsuariosRegistrados();

    if (!CORREO_REGEX.test(recCorreo)) {
      setRecCorreoError("Ingresa un correo electrónico válido");
      return false;
    }

    const encontrado = usuarios.find((u) => u.correo === recCorreo.trim());

    if (!encontrado) {
      setRecCorreoError("No encontramos una cuenta con ese correo");
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

  const validarCambiarPassword = () => {
    let esValido = true;

    if (recPassword.length < 4) {
      setRecPasswordError("La contraseña debe tener al menos 4 caracteres");
      esValido = false;
    } else {
      setRecPasswordError("");
    }

    if (recConfirmar !== recPassword) {
      setRecConfirmarError("Las contraseñas no coinciden");
      esValido = false;
    } else {
      setRecConfirmarError("");
    }

    return esValido;
  };

  const handleCambiarPassword = () => {
    setRecError("");

    if (!validarCambiarPassword()) return;

    const actualizado = actualizarPasswordPorCorreo(
      recCorreo.trim(),
      recPassword
    );

    if (actualizado) {
      alert("Contraseña cambiada exitosamente");

      setRecCorreo("");
      setRecPassword("");
      setRecConfirmar("");
      setRecStep(1);

      onRecuperacionExitosa();
    }
  };

  const handleVolver = () => {
    setRecStep(1);
    onIrALogin();
  };

  return (
    <>
      {recStep === 1 ? (
        <>
          <p style={recInfoStyle}>
            Ingresa el correo electrónico asociado a tu cuenta y te
            ayudaremos a recuperarla.
          </p>

          {recCorreoError && <p style={errorStyle}>{recCorreoError}</p>}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={recCorreo}
            onChange={(e) => setRecCorreo(e.target.value)}
            style={inputStyle}
          />

          <button onClick={handleVerificarCorreo} style={buttonStyle}>
            Verificar correo
          </button>
        </>
      ) : (
        <>
          <p style={recInfoStyle}>
            <IconCheckCircle />
            Correo verificado
            <br />
            Ingresa tu nueva contraseña.
          </p>

          {recError && <p style={errorStyle}>{recError}</p>}

          <div style={{ position: "relative" }}>
            <input
              type={showRecPass ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={recPassword}
              onChange={(e) => setRecPassword(e.target.value)}
              style={inputStyle}
            />
            <span onClick={() => setShowRecPass(!showRecPass)} style={eyeStyle}>
              {showRecPass ? <IconEyeOff /> : <IconEye />}
            </span>
          </div>
          {recPasswordError && <p style={fieldErrorStyle}>{recPasswordError}</p>}

          <input
            type={showRecPass ? "text" : "password"}
            placeholder="Confirmar nueva contraseña"
            value={recConfirmar}
            onChange={(e) => setRecConfirmar(e.target.value)}
            style={inputStyle}
          />
          {recConfirmarError && <p style={fieldErrorStyle}>{recConfirmarError}</p>}

          <button onClick={handleCambiarPassword} style={buttonStyle}>
            Cambiar contraseña
          </button>
        </>
      )}

      <p style={switchModoStyle}>
        <span style={switchModoLinkStyle} onClick={handleVolver}>
          Volver a iniciar sesión
        </span>
      </p>
    </>
  );
}

export default RecoverForm;