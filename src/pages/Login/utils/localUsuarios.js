const CLAVE_STORAGE = "gp_usuarios_registrados";

export const obtenerUsuariosRegistrados = () => {
  try {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
};

export const guardarUsuarioRegistrado = (nuevoUsuario) => {
  const usuarios = obtenerUsuariosRegistrados();
  usuarios.push(nuevoUsuario);
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuarios));
};

export const actualizarPasswordPorCorreo = (correo, nuevaPassword) => {
  const usuarios = obtenerUsuariosRegistrados();
  const indice = usuarios.findIndex((u) => u.correo === correo);

  if (indice === -1) return false;

  usuarios[indice].password = nuevaPassword;
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuarios));
  return true;
};
