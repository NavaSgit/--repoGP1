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
// Por defecto: "windows" solo si estamos en Windows (desarrollo local
// con SSMS). En Linux (ej. Azure App Service) el driver de Windows Auth
// no existe, así que el valor por defecto es "sql" para no romper el
// arranque con el error "libodbc.so.2: cannot open shared object file".

const authModePorDefecto = process.platform === "win32" ? "windows" : "sql";
const authMode = (process.env.DB_AUTH || authModePorDefecto).toLowerCase();

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
      // Azure SQL Database EXIGE encrypt: true. Para SQL Server local
      // normalmente va en false salvo que tengas certificado configurado.
      encrypt: process.env.DB_ENCRYPT === "true",
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
