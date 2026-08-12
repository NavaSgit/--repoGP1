import "dotenv/config";

// ========================================
// CONFIGURACIÓN DE CONEXIÓN A SQL SERVER
// ========================================
// Soporta dos modos, elegidos por la variable DB_AUTH en .env:
//
//   DB_AUTH=windows  -> usa Windows Authentication (igual que SSMS)
//                        Requiere el paquete "msnodesqlv8".
//   DB_AUTH=sql      -> usa usuario/contraseña de SQL Server
//
// Por defecto: windows (porque en SSMS te conectas con Windows Auth).

const authMode = (process.env.DB_AUTH || "windows").toLowerCase();

let sql;
let poolPromise;
let connectFn;

if (authMode === "windows") {
  // Driver con soporte para Windows Authentication
  sql = (await import("mssql/msnodesqlv8.js")).default;

  const server = process.env.DB_SERVER || "localhost\\SQLEXPRESS";
  const database = process.env.DB_DATABASE || "AdventureWorks2008R2";

  // IMPORTANTE: hay que indicar el nombre EXACTO del driver ODBC
  // instalado en Windows (ver ODBC Data Sources -> pestaña Drivers).
  // Si no coincide, da el error "Data source name not found and no
  // default driver specified".
  const odbcDriver =
    process.env.DB_ODBC_DRIVER || "ODBC Driver 17 for SQL Server";

  const connectionString = `Driver={${odbcDriver}};Server=${server};Database=${database};Trusted_Connection=Yes;`;

  connectFn = () => sql.connect({ connectionString });
} else {
  // Autenticación de SQL Server (usuario y contraseña)
  sql = (await import("mssql")).default;

  const config = {
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_DATABASE || "AdventureWorks2008R2",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 1433,
    options: {
      encrypt: false,
      trustServerCertificate:
        process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };

  connectFn = () => sql.connect(config);
}

export const getPool = () => {
  if (!poolPromise) {
    poolPromise = connectFn()
      .then((pool) => {
        console.log(
          `✅ Conectado a SQL Server (${authMode === "windows" ? "Windows Auth" : "SQL Auth"})`
        );
        return pool;
      })
      .catch((err) => {
        console.error("❌ Error al conectar a SQL Server:", err.message);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
};

export { sql };
