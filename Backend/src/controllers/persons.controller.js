import { getPool, sql } from "../config/db.js";
import { geocodificar } from "../services/geocode.js";

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
const COLUMNAS_ORDEN = {
  lastName: "p.LastName, p.FirstName",
  firstName: "p.FirstName, p.LastName",
  type: "p.PersonType, p.LastName",
  id: "p.BusinessEntityID",
};

export async function listar(req, res) {
  try {
    const search = (req.query.search || "").trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(req.query.pageSize) || 20),
    );
    const offset = (page - 1) * pageSize;

    const type = (req.query.type || "").trim().toUpperCase();

    const sortByKey = COLUMNAS_ORDEN[req.query.sortBy]
      ? req.query.sortBy
      : "lastName";
    const sortColumn = COLUMNAS_ORDEN[sortByKey];
    const sortDir =
      (req.query.sortDir || "").toLowerCase() === "desc" ? "DESC" : "ASC";

    const pool = await getPool();
    const request = pool.request();
    request.input("search", sql.NVarChar, `%${search}%`);
    request.input("type", sql.NVarChar, type);
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
        AND (@type = '' OR p.PersonType = @type)
      ORDER BY ${sortColumn} ${sortDir}
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `);

    const countResult = await pool
      .request()
      .input("search", sql.NVarChar, `%${search}%`)
      .input("type", sql.NVarChar, type).query(`
        SELECT COUNT(DISTINCT p.BusinessEntityID) AS total
        FROM Person.Person p
        LEFT JOIN Person.EmailAddress e
          ON e.BusinessEntityID = p.BusinessEntityID
        WHERE (@search = '%%' OR
               p.FirstName LIKE @search OR
               p.LastName LIKE @search OR
               e.EmailAddress LIKE @search)
          AND (@type = '' OR p.PersonType = @type);
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
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const pool = await getPool();
    const result = await pool.request().input("id", sql.Int, id).query(`
        SELECT
          p.BusinessEntityID,
          p.PersonType,
          p.Title,
          p.FirstName,
          p.MiddleName,
                    p.LastName,
          p.Suffix,
          p.ModifiedDate
        FROM Person.Person p
        WHERE p.BusinessEntityID = @id;

        SELECT e.EmailAddress
        FROM Person.EmailAddress e
        WHERE e.BusinessEntityID = @id
        ORDER BY e.EmailAddressID;

        SELECT ph.PhoneNumber, pt.Name AS PhoneNumberType
        FROM Person.PersonPhone ph
        LEFT JOIN Person.PhoneNumberType pt
          ON pt.PhoneNumberTypeID = ph.PhoneNumberTypeID
        WHERE ph.BusinessEntityID = @id
        ORDER BY pt.Name, ph.PhoneNumber;

        SELECT
          bea.AddressID,
          aty.Name AS AddressType,
          a.AddressLine1,
          a.AddressLine2,
          a.City,
          a.PostalCode,
          sp.Name AS StateProvince,
          cr.Name AS Country
        FROM Person.BusinessEntityAddress bea
        INNER JOIN Person.Address a
          ON a.AddressID = bea.AddressID
        LEFT JOIN Person.AddressType aty
          ON aty.AddressTypeID = bea.AddressTypeID
        LEFT JOIN Person.StateProvince sp
          ON sp.StateProvinceID = a.StateProvinceID
        LEFT JOIN Person.CountryRegion cr
          ON cr.CountryRegionCode = sp.CountryRegionCode
        WHERE bea.BusinessEntityID = @id
        ORDER BY aty.Name, bea.AddressID;
      `);

    const [personaRs, correosRs, telefonosRs, direccionesRs] =
      result.recordsets;

    if (personaRs.length === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    res.json({
      ...personaRs[0],
      // Compatibilidad con el contrato anterior (primer correo / teléfono)
      EmailAddress: correosRs[0]?.EmailAddress ?? null,
      PhoneNumber: telefonosRs[0]?.PhoneNumber ?? null,
      correos: correosRs.map((r) => r.EmailAddress),
      telefonos: telefonosRs,
      direcciones: direccionesRs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar la persona" });
  }
}

// ========================================
// GET /api/persons/:id/ubicaciones
// Direcciones de la persona con lat/lon cuando existen:
//   1) SpatialLocation de Person.Address (si la base la trae), o
//   2) geocodificación (Nominatim, con caché).
// Nunca se inventan coordenadas.
// ========================================
function coordenadaValida(lat, lon) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180 &&
    !(lat === 0 && lon === 0)
  );
}

async function leerDirecciones(pool, id) {
  const consulta = (columnasCoord) => `
    SELECT
      bea.AddressID,
      aty.Name AS AddressType,
      a.AddressLine1,
      a.AddressLine2,
      a.City,
      a.PostalCode,
      sp.Name AS StateProvince,
      cr.Name AS Country,
      ${columnasCoord}
    FROM Person.BusinessEntityAddress bea
    INNER JOIN Person.Address a ON a.AddressID = bea.AddressID
    LEFT JOIN Person.AddressType aty ON aty.AddressTypeID = bea.AddressTypeID
    LEFT JOIN Person.StateProvince sp ON sp.StateProvinceID = a.StateProvinceID
    LEFT JOIN Person.CountryRegion cr ON cr.CountryRegionCode = sp.CountryRegionCode
    WHERE bea.BusinessEntityID = @id
    ORDER BY aty.Name, bea.AddressID;
  `;

  try {
    const r = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        consulta("a.SpatialLocation.Lat AS Lat, a.SpatialLocation.Long AS Lon")
      );
    return r.recordset;
  } catch {
    // La columna SpatialLocation no existe en esta copia de la base
    const r = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        consulta("CAST(NULL AS float) AS Lat, CAST(NULL AS float) AS Lon")
      );
    return r.recordset;
  }
}

export async function ubicaciones(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const pool = await getPool();
    const filas = await leerDirecciones(pool, id);

    const resultado = await Promise.all(
      filas.map(async (f) => {
        const { Lat, Lon, ...direccion } = f;

        if (coordenadaValida(Lat, Lon)) {
          return { ...direccion, lat: Lat, lon: Lon, origen: "base de datos" };
        }

        const geo = await geocodificar(direccion);
        if (geo) {
          return { ...direccion, lat: geo.lat, lon: geo.lon, origen: "geocodificada" };
        }
        return { ...direccion, lat: null, lon: null, origen: null };
      })
    );

    res.json({ ubicaciones: resultado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar las ubicaciones" });
  }
}

// ========================================
// GET /api/dashboard/summary
// Resumen general para la vista "Inicio": totales, distribución
// por tipo, geografía y contactabilidad. Todo calculado en SQL
// en un solo roundtrip (batch de SELECTs agregados).
// ========================================

const ETIQUETAS_TIPO_HOME = {
  IN: "Individual",
  EM: "Empleado",
  SC: "Contacto de tienda",
  VC: "Contacto de proveedor",
  GC: "Contacto general",
  SP: "Vendedor",
};

export async function resumenDashboard(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT COUNT(*) AS total FROM Person.Person;

      SELECT COUNT(DISTINCT BusinessEntityID) AS total FROM Person.EmailAddress;

      SELECT COUNT(DISTINCT BusinessEntityID) AS total FROM Person.PersonPhone;

      SELECT COUNT(DISTINCT BusinessEntityID) AS total FROM Person.BusinessEntityAddress;

      SELECT p.PersonType, COUNT(*) AS total
      FROM Person.Person p
      GROUP BY p.PersonType
      ORDER BY total DESC;

      SELECT COUNT(DISTINCT sp.CountryRegionCode) AS total FROM Person.StateProvince sp;

      SELECT COUNT(DISTINCT StateProvinceID) AS total FROM Person.StateProvince;

      SELECT COUNT(DISTINCT City) AS total FROM Person.Address;

      SELECT TOP 5 cr.Name AS pais, COUNT(DISTINCT p.BusinessEntityID) AS total
      FROM Person.Person p
      JOIN Person.BusinessEntityAddress bea ON bea.BusinessEntityID = p.BusinessEntityID
      JOIN Person.Address a ON a.AddressID = bea.AddressID
      JOIN Person.StateProvince sp ON sp.StateProvinceID = a.StateProvinceID
      JOIN Person.CountryRegion cr ON cr.CountryRegionCode = sp.CountryRegionCode
      GROUP BY cr.Name
      ORDER BY total DESC;

       SELECT pt.Name AS tipo, COUNT(*) AS total
      FROM Person.PersonPhone pp
      JOIN Person.PhoneNumberType pt ON pt.PhoneNumberTypeID = pp.PhoneNumberTypeID
      GROUP BY pt.Name
      ORDER BY total DESC;

      SELECT cr.Name AS pais, COUNT(DISTINCT p.BusinessEntityID) AS total
      FROM Person.Person p
      JOIN Person.BusinessEntityAddress bea ON bea.BusinessEntityID = p.BusinessEntityID
      JOIN Person.Address a ON a.AddressID = bea.AddressID
      JOIN Person.StateProvince sp ON sp.StateProvinceID = a.StateProvinceID
      JOIN Person.CountryRegion cr ON cr.CountryRegionCode = sp.CountryRegionCode
      GROUP BY cr.Name
      ORDER BY total DESC;
    
    `);

    const [
      totalPersonasRs,
      conCorreoRs,
      conTelefonoRs,
      conDireccionRs,
      porTipoRs,
      paisesRs,
      estadosRs,
      ciudadesRs,
      topPaisesRs,
      telefonosPorTipoRs,
      todosPaisesRs,
    ] = result.recordsets;

    res.json({
      totales: {
        personas: totalPersonasRs[0].total,
        conCorreo: conCorreoRs[0].total,
        conTelefono: conTelefonoRs[0].total,
        conDireccion: conDireccionRs[0].total,
      },
      porTipo: porTipoRs.map((r) => ({
        tipo: r.PersonType,
        etiqueta: ETIQUETAS_TIPO_HOME[r.PersonType] || r.PersonType,
        total: r.total,
      })),
      geografia: {
        paises: paisesRs[0].total,
        estados: estadosRs[0].total,
        ciudades: ciudadesRs[0].total,
        topPaises: topPaisesRs.map((r) => ({ pais: r.pais, total: r.total })),
        todosPaises: todosPaisesRs.map((r) => ({
          pais: r.pais,
          total: r.total,
        })),
      },
      telefonosPorTipo: telefonosPorTipoRs.map((r) => ({
        tipo: r.tipo,
        total: r.total,
      })),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al calcular el resumen del dashboard" });
  }
}
