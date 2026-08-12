import { useState } from "react";
import "./Login.css";

import GradientWaves from "../../components/GradientWaves/GradientWaves";
import DepthText from "../../components/DepthText/DepthText";
import MaskedHeading from "../../components/Maskedheading/Maskedheading";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import RecoverForm from "./components/RecoverForm";

import {
  containerStyle,
  gradientWavesWrapperStyle,
  leftSectionStyle,
  descriptionStyle,
  rightSectionStyle,
  cardStyle,
  logoWrapperStyle,
  titleStyle,
} from "./Login.styles";

const TITULOS = {
  registro: "Crear cuenta",
  recuperar: "Recuperar contraseña",
};

function Login({ onLogin }) {
  const [modo, setModo] = useState("login"); // "login" | "registro" | "recuperar"

  return (
    <div style={containerStyle}>
      {/* FONDO */}
      <div style={gradientWavesWrapperStyle}>
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

      {/* SECCIÓN IZQUIERDA */}
      <div style={leftSectionStyle} data-left-section>
        <MaskedHeading
          text="Bienvenido a NexusKeep"
          tag="h1"
          align="left"
          textScale={0.18}
          weight={900}
          tracking={-0.003}
          style={{
            width: "100%",
            maxWidth: "clamp(350px, 45vw, 900px)",
            marginBottom: "clamp(50px, 15vh, 200px)",
          }}
        />

        <p style={descriptionStyle}>
          Una plataforma segura y eficiente para gestionar tu base de datos.
          Almacena, organiza y accede a tu información desde cualquier lugar.
        </p>
      </div>

      {/* SECCIÓN DERECHA */}
      <div style={rightSectionStyle} data-right-section>
        <div style={cardStyle} className="card-responsive">
          <div style={logoWrapperStyle}>
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

          {modo !== "login" && (
            <h1 style={titleStyle}>{TITULOS[modo]}</h1>
          )}

          {modo === "login" && (
            <LoginForm
              onLogin={onLogin}
              onIrARegistro={() => setModo("registro")}
              onIrARecuperar={() => setModo("recuperar")}
            />
          )}

          {modo === "registro" && (
            <RegisterForm
              onRegistroExitoso={() => setModo("login")}
              onIrALogin={() => setModo("login")}
            />
          )}

          {modo === "recuperar" && (
            <RecoverForm
              onRecuperacionExitosa={() => setModo("login")}
              onIrALogin={() => setModo("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
