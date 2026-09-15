import { useState } from "react";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  // null = no hay usuario autenticado
  // objeto = usuario autenticado
  const [usuario, setUsuario] = useState(null);

  // Esta función será llamada por Login
  // cuando las credenciales sean correctas
  const handleLogin = (usuarioAutenticado) => {
    setUsuario(usuarioAutenticado);
  };

  // Cerrar sesión
  const handleLogout = () => {
    setUsuario(null);
  };

  return (
    <>
      {usuario ? (
        <Dashboard
          usuario={usuario}
          onLogout={handleLogout}
        />
      ) : (
        <Login
          onLogin={handleLogin}
        />
      )}
    </>
  );
}

export default App;