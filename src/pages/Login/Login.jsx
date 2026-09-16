import { useState, useRef, useEffect, useCallback } from "react";
import "./Login.css";

import GradientWaves from "../../components/GradientWaves/GradientWaves";
import DepthText from "../../components/DepthText/DepthText";
import MaskedHeading from "../../components/Maskedheading/Maskedheading";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import RecoverForm from "./components/RecoverForm";

import {
  scrollWrapperStyle,
  gradientWavesWrapperStyle,
  scrollTrackStyle,
  stickyStageStyle,
  heroSectionStyle,
  heroContentStyle,
  descriptionStyle,
  featureListStyle,
  featureItemStyle,
  featureIconWrapStyle,
  featureTextStyle,
  scrollIndicatorStyle,
  loginSectionStyle,
  cardStyle,
  logoWrapperStyle,
  titleStyle,
} from "./Login.styles";

const TITULOS = {
  registro: "Crear cuenta",
  recuperar: "Recuperar contraseña",
};

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconLayers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3l9 5-9 5-9-5 9-5z" strokeLinejoin="round" />
    <path d="M3 13l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconGlobe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function Login({ onLogin }) {
  const [modo, setModo] = useState("login");
  const [progress, setProgress] = useState(0); // 0 = bienvenida, 1 = login
  const containerRef = useRef(null);
  const tickingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;

    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (el) {
        const vh = window.innerHeight;
        const p = clamp(el.scrollTop / vh, 0, 1);
        setProgress(p);
      }
      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const goToLogin = () => {
    containerRef.current?.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  // Curvas de la transición (crossfade)
  const heroOpacity = clamp(1 - progress / 0.55, 0, 1);
  const heroScale = 1 - progress * 0.08;
  const heroTranslateY = -progress * 50;

  const loginOpacity = clamp((progress - 0.35) / 0.55, 0, 1);
  const loginScale = 0.92 + loginOpacity * 0.08;
  const loginTranslateY = (1 - loginOpacity) * 40;

  const indicatorOpacity = clamp(1 - progress * 5, 0, 1);

  return (
    <div style={scrollWrapperStyle} className="login-scroll-wrapper" ref={containerRef}>
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
      <div style={featureListStyle} className="hero-section-features"></div>

      {/* Pista larga que da espacio de scroll para controlar la mezcla */}
      <div style={scrollTrackStyle}>
        <div style={stickyStageStyle}>
          {/* BIENVENIDA */}
          <div
            style={{
              ...heroSectionStyle,
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px) scale(${heroScale})`,
              pointerEvents: progress > 0.5 ? "none" : "auto",
            }}
          >
            <div style={heroContentStyle}>
              <MaskedHeading
                text="Bienvenido a NexusKeep"
                tag="h1"
                align="center"
                textScale={0.16}
                weight={900}
                tracking={-0.003}
                style={{
                  width: "100%",
                  maxWidth: "clamp(320px, 55vw, 850px)",
                  marginBottom: "28px",
                }}
              />

              <p style={descriptionStyle}>
                Una plataforma segura y eficiente para gestionar tu base de datos.
                Almacena, organiza y accede a tu información desde cualquier lugar.
              </p>

              <div style={featureListStyle}>
                <div style={featureItemStyle}>
                  <div style={featureIconWrapStyle}><IconShield /></div>
                  <span style={featureTextStyle}>Seguridad y control de acceso</span>
                </div>
                <div style={featureItemStyle}>
                  <div style={featureIconWrapStyle}><IconLayers /></div>
                  <span style={featureTextStyle}>Organización clara de tus datos</span>
                </div>
                <div style={featureItemStyle}>
                  <div style={featureIconWrapStyle}><IconGlobe /></div>
                  <span style={featureTextStyle}>Acceso desde cualquier dispositivo</span>
                </div>
              </div>
            </div>

            <button
              style={{ ...scrollIndicatorStyle, opacity: indicatorOpacity }}
              onClick={goToLogin}
              className="scroll-indicator"
              aria-label="Desplazarse hacia el login"
            >
              <span>Desliza para continuar</span>
              <IconChevronDown />
            </button>
          </div>

          {/* LOGIN */}
          <div
            style={{
              ...loginSectionStyle,
              opacity: loginOpacity,
              transform: `translateY(${loginTranslateY}px) scale(${loginScale})`,
              pointerEvents: progress < 0.4 ? "none" : "auto",
            }}
          >
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

              {modo !== "login" && <h1 style={titleStyle}>{TITULOS[modo]}</h1>}

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
      </div>
    </div>
  );
}

export default Login;