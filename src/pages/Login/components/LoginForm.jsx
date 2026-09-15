import { useState } from "react";
import { loginConPersona } from "../../../services/api";
import { obtenerUsuariosRegistrados } from "../utils/localUsuarios";
import {
  errorStyle,
  inputStyle,
  fieldErrorStyle,
  buttonStyle,
  dividerStyle,
  dividerLineStyle,
  dividerTextStyle,
  correoButtonStyle,
  correoIconStyle,
  footerStyle,
  switchModoStyle,
  switchModoLinkStyle,
  eyeStyle,
} from "../Login.styles";

function LoginForm({ onLogin, onIrARegistro, onIrARecuperar }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [usuarioError, setUsuarioError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    let esValido = true;

    if (usuario.trim().length < 3) {
      setUsuarioError("El usuario debe tener al menos 3 caracteres");
      esValido = false;
    } else {
      setUsuarioError("");
    }

    if (password.length < 4) {
      setPasswordError("La contraseña debe tener al menos 4 caracteres");
      esValido = false;
    } else {
      setPasswordError("");
    }

    return esValido;
  };

  const handleLogin = async () => {
    setError("");

    if (!validar()) return;

    // Usuario temporal para pruebas (sin base de datos)
    if (usuario === "admin" && password === "1234") {
      onLogin({ usuario: "admin" });
      return;
    }

    // Intentar validar contra la BD (Person - AdventureWorks2008R2)
    // usuario: BusinessEntityID o correo | password: apellido (LastName)
    setCargando(true);

    try {
      const persona = await loginConPersona(usuario, password);
      onLogin({ usuario: persona.usuario });
      return;
    } catch {
      // Si falla la BD (apagada, sin conexión, credenciales no
      // encontradas), seguimos con el fallback local abajo.
    } finally {
      setCargando(false);
    }

    // Buscar usuario registrado localmente (fallback offline)
    const usuarios = obtenerUsuariosRegistrados();
    const encontrado = usuarios.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (encontrado) {
      onLogin({ usuario: encontrado.usuario });
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const handleLoginConCorreo = () => {
    alert("Inicio de sesión con correo — próximamente");
  };

  return (
    <>
      {error && <p style={errorStyle}>{error}</p>}

      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        style={inputStyle}
      />
      {usuarioError && <p style={fieldErrorStyle}>{usuarioError}</p>}

      <div style={{ position: "relative" }}>
        <input
          type={showPass ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <span onClick={() => setShowPass(!showPass)} style={eyeStyle}>
          {showPass ? "🙈" : "👁️"}
        </span>
      </div>
      {passwordError && <p style={fieldErrorStyle}>{passwordError}</p>}

      <button
        onClick={handleLogin}
        disabled={cargando}
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.background = "#625a5a")}
        onMouseOut={(e) => (e.target.style.background = "#621b7c")}
      >
        {cargando ? "Ingresando..." : "Ingresar"}
      </button>

      <div style={dividerStyle}>
        <span style={dividerLineStyle} />
        <span style={dividerTextStyle}>o</span>
        <span style={dividerLineStyle} />
      </div>

      <button
        onClick={handleLoginConCorreo}
        style={correoButtonStyle}
        type="button"
      >
        <span style={correoIconStyle}>✉️</span>
        Ingresar con correo electrónico
      </button>

      <p style={footerStyle}>
        <span style={switchModoLinkStyle} onClick={onIrARecuperar}>
          ¿Olvidaste tu contraseña?
        </span>
      </p>

      <p style={switchModoStyle}>
        ¿No tienes cuenta?{" "}
        <span style={switchModoLinkStyle} onClick={onIrARegistro}>
          Regístrate
        </span>
      </p>
    </>
  );
}

export default LoginForm;
