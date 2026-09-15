export const containerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "linear-gradient(135deg, #11102c, #621b7c)",
  overflow: "hidden",
  boxSizing: "border-box",
  padding: "40px 60px",
};

export const gradientWavesWrapperStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
};

export const leftSectionStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  zIndex: 1,
  maxWidth: "900px",
  paddingRight: "40px",
};

export const descriptionStyle = {
  position: "fixed",
  bottom: "5vh",
  left: "20vw",
  width: "clamp(200px, 105vw, 700px)",
  color: "#f7f6fa",
  fontSize: "clamp(14px, 1.9vw, 20px)",
  lineHeight: "1.6",
  textAlign: "center",
};

export const rightSectionStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  zIndex: 1,
};

export const cardStyle = {
  position: "relative",
  zIndex: 1,
  width: "320px",
  padding: "40px",
  borderRadius: "20px",
  background: "rgba(20,20,20,0.85)",
  backdropFilter: "blur(15px)",
  boxShadow: "0 0 40px rgba(0,0,0,0.6)",
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
  marginBottom: "clamp(8px, 1.5vw, 14px)",
};

export const titleStyle = {
  color: "white",
  textAlign: "center",
  marginBottom: "25px",
  fontSize: "28px",
  fontWeight: "bold",
};

export const inputStyle = {
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

export const buttonStyle = {
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

export const errorStyle = {
  color: "#ff6b6b",
  textAlign: "center",
  marginBottom: "10px",
};

export const fieldErrorStyle = {
  color: "#ff6b6b",
  fontSize: "12px",
  textAlign: "left",
  margin: "-10px 0 12px 4px",
};

export const dividerStyle = {
  display: "flex",
  alignItems: "center",
  margin: "16px 0",
};

export const dividerLineStyle = {
  flex: 1,
  height: "1px",
  background: "rgba(255,255,255,0.2)",
};

export const dividerTextStyle = {
  color: "#9a8fb0",
  fontSize: "12px",
  margin: "0 10px",
};

export const correoButtonStyle = {
  width: "100%",
  padding: "12px",
  background: "rgba(52, 51, 51, 0.3)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

export const correoIconStyle = {
  fontSize: "16px",
};

export const switchModoStyle = {
  color: "#b8a8d8",
  fontSize: "13px",
  textAlign: "center",
  marginTop: "18px",
};

export const switchModoLinkStyle = {
  color: "#ca9fff",
  fontWeight: "bold",
  cursor: "pointer",
  textDecoration: "underline",
};

export const footerStyle = {
  color: "#7b52b8",
  fontSize: "12px",
  textAlign: "center",
  marginTop: "15px",
  cursor: "pointer",
};

export const recInfoStyle = {
  color: "#b8a8d8",
  fontSize: "13px",
  textAlign: "center",
  marginBottom: "18px",
  lineHeight: "1.5",
};

export const eyeStyle = {
  position: "absolute",
  right: "10px",
  top: "10px",
  cursor: "pointer",
  color: "#6744c7",
};
