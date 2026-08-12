import { Router } from "express";
import { getPool, sql } from "../db.js";

const router = Router();

// ========================================
// GET /api/persons
// Lista personas (esquema Person) con búsqueda y paginación
// Query params: ?search=&page=1&pageSize=20
// ========================================
router.get("/", async (req, res) => {
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
});

// ========================================
// GET /api/persons/:id
// Detalle de una persona por BusinessEntityID
// ========================================
router.get("/:id", async (req, res) => {
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
});

export default router;
