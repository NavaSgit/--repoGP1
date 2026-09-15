import { getPool, sql } from "../config/db.js";

// ==============================================================
// POST /api/auth/login
// Body: { usuario, password }
//
// IMPORTANTE - por qué se valida así:
// La tabla Person.Person NO tiene usuario/contraseña. Las
// contraseñas reales están hasheadas en Person.Password y no
// se conocen en texto plano, así que no se pueden usar para
// probar un login real.
//
// Para poder autenticar con datos REALES de Person, esta regla
// académica usa:
//   usuario  -> BusinessEntityID (número) o correo (EmailAddress)
//   password -> Apellido (LastName), sin distinguir mayúsculas
//
// Ejemplo: si BusinessEntityID = 285, FirstName = "Syed",
// LastName = "Abbas" -> usuario: 285  password: abbas
//
// Si tu profesor pide otra regla de validación, cámbiala aquí.
// ==============================================================
export async function login(req, res) {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res
        .status(400)
        .json({ error: "Usuario y contraseña son obligatorios" });
    }

    const pool = await getPool();
    const esNumerico = /^\d+$/.test(usuario.trim());

    const request = pool.request();
    request.input("usuario", sql.NVarChar, usuario.trim());
    if (esNumerico) {
      request.input("id", sql.Int, parseInt(usuario.trim()));
    }

    const query = esNumerico
      ? `
        SELECT p.BusinessEntityID, p.FirstName, p.LastName, e.EmailAddress
        FROM Person.Person p
        LEFT JOIN Person.EmailAddress e
          ON e.BusinessEntityID = p.BusinessEntityID
        WHERE p.BusinessEntityID = @id;
      `
      : `
        SELECT p.BusinessEntityID, p.FirstName, p.LastName, e.EmailAddress
        FROM Person.Person p
        INNER JOIN Person.EmailAddress e
          ON e.BusinessEntityID = p.BusinessEntityID
        WHERE e.EmailAddress = @usuario;
      `;

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos" });
    }

    const persona = result.recordset[0];

    const passwordCorrecta =
      persona.LastName &&
      persona.LastName.trim().toLowerCase() === password.trim().toLowerCase();

    if (!passwordCorrecta) {
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos" });
    }

    res.json({
      usuario: `${persona.FirstName} ${persona.LastName}`,
      businessEntityId: persona.BusinessEntityID,
      correo: persona.EmailAddress || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al validar el login" });
  }
}
