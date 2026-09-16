
export const scrollWrapperStyle = {
  height: "100vh",
  width: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  position: "relative",
  background: "radial-gradient(circle at 50% 30%, #2d1b4e 0%, #17102f 45%, #0b0a1f 100%)",
};

export const gradientWavesWrapperStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
};

// Da el "recorrido" de scroll que controla la mezcla (200vh = 100vh de recorrido real)
export const scrollTrackStyle = {
  height: "200vh",
  position: "relative",
  zIndex: 1,
};

export const stickyStageStyle = {
  position: "sticky",
  top: 0,
  height: "100vh",
  width: "100%",
  overflow: "hidden",
};

export const heroSectionStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "40px 24px",
  boxSizing: "border-box",
  willChange: "opacity, transform",
};

export const heroContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "760px",
  margin: "0 auto",
};

export const descriptionStyle = {
  color: "rgba(247, 246, 250, 0.75)",
  fontSize: "clamp(14px, 1.6vw, 18px)",
  lineHeight: "1.6",
  fontWeight: 300,
  letterSpacing: "0.2px",
  maxWidth: "560px",
  margin: "0 auto 36px",
  textAlign: "center",
};

export const featureListStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "32px",
};
export const featureItemStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "10px",
  width: "150px",
  textAlign: "center",
};

export const featureIconWrapStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#c084fc",
  flexShrink: 0,
};

export const featureTextStyle = {
  color: "rgba(247, 246, 250, 0.85)",
  fontSize: "14.5px",
  fontWeight: 400,
};

export const scrollIndicatorStyle = {
  position: "absolute",
  bottom: "40px",
  right: "48px",
  left: "auto",
  transform: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  background: "transparent",
  border: "none",
  color: "rgba(255,255,255,0.55)",
  fontSize: "13px",
  cursor: "pointer",
  fontFamily: "inherit",
};

export const loginSectionStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  willChange: "opacity, transform",
};
export const cardStyle = {
  position: "relative",
  zIndex: 1,
  width: "360px",
  padding: "44px 40px",
  borderRadius: "24px",
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(20px) saturate(140%)",
  WebkitBackdropFilter: "blur(20px) saturate(140%)",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
  animation: "fadeIn 0.8s ease",
  boxSizing: "border-box",
};

export const logoWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  marginBottom: "clamp(14px, 2vw, 20px)",
  filter: "drop-shadow(0 4px 12px rgba(170, 59, 255, 0.25))",
};

export const titleStyle = {
  color: "#f5f3fa",
  textAlign: "center",
  marginBottom: "28px",
  fontSize: "26px",
  fontWeight: 700,
  letterSpacing: "-0.4px",
};

export const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  fontSize: "14.5px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#f5f3fa",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.25s ease, background 0.25s ease",
};

export const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "linear-gradient(135deg, #aa3bff, #7c1fd6)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  letterSpacing: "0.2px",
  boxShadow: "0 8px 20px rgba(170, 59, 255, 0.35)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

export const errorStyle = {
  color: "#ff8a8a",
  background: "rgba(255, 107, 107, 0.08)",
  border: "1px solid rgba(255, 107, 107, 0.2)",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "13px",
  textAlign: "center",
  marginBottom: "14px",
};

export const fieldErrorStyle = {
  color: "#ff8a8a",
  fontSize: "12px",
  textAlign: "left",
  margin: "-10px 0 12px 4px",
};

export const dividerStyle = {
  display: "flex",
  alignItems: "center",
  margin: "18px 0",
};

export const dividerLineStyle = {
  flex: 1,
  height: "1px",
  background: "rgba(255,255,255,0.12)",
};

export const dividerTextStyle = {
  color: "rgba(255,255,255,0.4)",
  fontSize: "12px",
  margin: "0 10px",
};

export const correoButtonStyle = {
  width: "100%",
  padding: "13px",
  background: "rgba(255,255,255,0.04)",
  color: "#f5f3fa",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "background 0.25s ease, border-color 0.25s ease",
};

export const correoIconStyle = {
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
};

export const switchModoStyle = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "13px",
  textAlign: "center",
  marginTop: "20px",
};

export const switchModoLinkStyle = {
  color: "#c084fc",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "none",
  borderBottom: "1px solid rgba(192, 132, 252, 0.4)",
};

export const footerStyle = {
  color: "rgba(255,255,255,0.3)",
  fontSize: "12px",
  textAlign: "center",
  marginTop: "16px",
  cursor: "pointer",
};

export const recInfoStyle = {
  color: "rgba(255,255,255,0.55)",
  fontSize: "13px",
  textAlign: "center",
  marginBottom: "18px",
  lineHeight: "1.5",
};

export const eyeStyle = {
  position: "absolute",
  right: "12px",
  top: "12px",
  cursor: "pointer",
  color: "rgba(255,255,255,0.45)",
  display: "flex",
  alignItems: "center",
};