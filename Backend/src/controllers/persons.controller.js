import { getPool, sql } from "../config/db.js";

// ========================================
// GET /api/persons/stats
// Estadísticas agregadas: personas por tipo y por ciudad
// (esquema Person: Person.Person, Person.BusinessEntityAddress,
// Person.Address)
// ========================================

const ETIQUETAS_TIPO = {
  IN: "Individual",
  EM: "Empleado",
  SC: "Contacto de tienda",
  VC: "Contacto de proveedor",
  GC: "Contacto general",
  SP: "Vendedor",
};

export async function estadisticas(req, res) {
  try {
    const pool = await getPool();

    const porTipo = await pool.request().query(`
      SELECT p.PersonType, COUNT(*) AS total
      FROM Person.Person p
      GROUP BY p.PersonType
      ORDER BY total DESC;
    `);

    const porCiudad = await pool.request().query(`
      SELECT TOP 10 a.City, COUNT(DISTINCT p.BusinessEntityID) AS total
      FROM Person.Person p
      INNER JOIN Person.BusinessEntityAddress bea
        ON bea.BusinessEntityID = p.BusinessEntityID
      INNER JOIN Person.Address a
        ON a.AddressID = bea.AddressID
      GROUP BY a.City
      ORDER BY total DESC;
    `);

    res.json({
      porTipo: porTipo.recordset.map((r) => ({
        tipo: r.PersonType,
        etiqueta: ETIQUETAS_TIPO[r.PersonType] || r.PersonType,
        total: r.total,
      })),
      porCiudad: porCiudad.recordset.map((r) => ({
        ciudad: r.City,
        total: r.total,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al calcular estadísticas" });
  }
}

// ========================================
// GET /api/persons
// Lista personas (esquema Person) con búsqueda y paginación
// Query params: ?search=&page=1&pageSize=20
// ========================================
export async function listar(req, res) {
  try {
    const search = (req.query.search || "").trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(req.query.pageSize) || 20)
    );
    const offset = (page - 1) * pageSize;

    const pool = await getPool();
    const request = pool.request();
    request.input("search", sql.NVarChar, `%${search}%`);
    request.input("offset", sql.Int, offset);
    request.input("pageSize", sql.Int, pageSize);

    const result = await request.query(`
      SELECT
        p.BusinessEntityID,
        p.PersonType,
        p.FirstName,
        p.MiddleName,
        p.LastName,
        e.EmailAddress,
        ph.PhoneNumber
      FROM Person.Person p
      LEFT JOIN Person.EmailAddress e
        ON e.BusinessEntityID = p.BusinessEntityID
      LEFT JOIN Person.PersonPhone ph
        ON ph.BusinessEntityID = p.BusinessEntityID
      WHERE (@search = '%%' OR
             p.FirstName LIKE @search OR
             p.LastName LIKE @search OR
             e.EmailAddress LIKE @search)
      ORDER BY p.LastName, p.FirstName
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `);

    const countResult = await pool
      .request()
      .input("search", sql.NVarChar, `%${search}%`)
      .query(`
        SELECT COUNT(DISTINCT p.BusinessEntityID) AS total
        FROM Person.Person p
        LEFT JOIN Person.EmailAddress e
          ON e.BusinessEntityID = p.BusinessEntityID
        WHERE (@search = '%%' OR
               p.FirstName LIKE @search OR
               p.LastName LIKE @search OR
               e.EmailAddress LIKE @search);
      `);

    res.json({
      data: result.recordset,
      page,
      pageSize,
      total: countResult.recordset[0].total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar personas" });
  }
}

// ========================================
// GET /api/persons/:id
// Detalle de una persona por BusinessEntityID
// ========================================
export async function obtenerPorId(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT
          p.BusinessEntityID,
          p.PersonType,
          p.Title,
          p.FirstName,
          p.MiddleName,
          p.LastName,
          p.Suffix,
          e.EmailAddress,
          ph.PhoneNumber
        FROM Person.Person p
        LEFT JOIN Person.EmailAddress e
          ON e.BusinessEntityID = p.BusinessEntityID
        LEFT JOIN Person.PersonPhone ph
          ON ph.BusinessEntityID = p.BusinessEntityID
        WHERE p.BusinessEntityID = @id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar la persona" });
  }
}
