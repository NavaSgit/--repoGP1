const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function manejarRespuesta(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Error en la solicitud");
  }
  return data;
}

// ========================================
// AUTENTICACIÓN
// ========================================

export async function loginConPersona(usuario, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });
  return manejarRespuesta(res);
}

// ========================================
// PERSONAS (esquema Person de AdventureWorks)
// ========================================

export async function obtenerPersonas({ search = "", page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams({ search, page, pageSize });
  const res = await fetch(`${API_URL}/api/persons?${params.toString()}`);
  return manejarRespuesta(res);
}

export async function obtenerPersonaPorId(id) {
  const res = await fetch(`${API_URL}/api/persons/${id}`);
  return manejarRespuesta(res);
}
