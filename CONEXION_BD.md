# Conexión a AdventureWorks2008R2 (esquema Person)

Este proyecto ahora tiene dos partes:

```
LoginGP1/
├── src/            → tu app React (frontend)
└── Backend/        → backend Node/Express que habla con SQL Server
```

El navegador **no puede conectarse directo a SQL Server** (no es seguro ni
posible), así que se agregó un backend intermedio: React → API (Express) →
SQL Server.

## 1. Configurar y correr el backend

Como te conectas en SSMS con **Windows Authentication** a
`localhost\SQLEXPRESS`, el backend usa el driver `msnodesqlv8`, que es el
único que soporta ese tipo de login desde Node.js (el driver por defecto
de `mssql` solo soporta usuario/contraseña).

```bash
cd Backend
npm install
cp .env.example .env
```

El `.env` ya viene configurado para tu caso (no deberías necesitar
cambiar nada, pero revisa que coincida con SSMS):

```
DB_AUTH=windows
DB_SERVER=localhost\SQLEXPRESS
DB_DATABASE=AdventureWorks2008R2
```

> ⚠️ En Windows, `npm install` de `msnodesqlv8` compila un módulo nativo.
> Si el `npm install` falla, instala primero las "Build Tools for
> Visual Studio" (workload "Desktop development with C++") y vuelve a
> correr `npm install`. Si aun así da problemas, como alternativa puedes
> cambiar a `DB_AUTH=sql`, crear un login de SQL Server Authentication
> en SSMS (clic derecho en Security → Logins → New Login) y usar
> usuario/contraseña en vez de Windows Auth.

Levanta el servidor:

```bash
npm run dev
```

Deberías ver: `🚀 Servidor backend escuchando en http://localhost:4000`
y luego `✅ Conectado a SQL Server: AdventureWorks2008R2` en cuanto llegue
la primera petición.

Prueba rápida: abre `http://localhost:4000/api/persons` en el navegador,
deberías ver JSON con datos reales de `Person.Person`.

## 2. Configurar el frontend

En la raíz del proyecto (no en `Backend/`):

```bash
cp .env.example .env
npm install
npm run dev
```

> Se agregó `recharts` (librería de gráficas) a `package.json`, por eso
> hace falta correr `npm install` de nuevo si ya lo habías instalado
> antes.

Por defecto el frontend apunta a `http://localhost:4000` (ver `.env`).

## 3. Qué se conectó a la BD

- **Login** (`src/pages/Login/Login.jsx`): al iniciar sesión, primero
  intenta validar contra `Person.Person` en la base de datos real.
  - `usuario`: el **BusinessEntityID** (número) o el **correo**
  - `password`: el **apellido (LastName)** de esa persona
  - Ejemplo: BusinessEntityID `285`, LastName `Abbas` → usuario `285`,
    contraseña `abbas`
  - Esto es una regla académica: `Person.Person` no tiene contraseñas
    reales (esas están hasheadas en `Person.Password` y no se conocen en
    texto plano). Si tu profesor pide otra regla, cámbiala en
    `Backend/src/controllers/auth.controller.js`.
  - Si la BD no responde, cae automáticamente al login local
    (`admin`/`1234` o usuarios registrados en el navegador), para que la
    demo no se rompa si el backend está apagado.

- **Sección "Personas (BD)"** en el Dashboard (`src/pages/Dashboard/components/Personas.jsx`):
  lista datos reales de `Person.Person` + `Person.EmailAddress` +
  `Person.PersonPhone`, con búsqueda y paginación.

- **Sección "Estadísticas (BD)"** en el Dashboard
  (`src/pages/Dashboard/components/EstadisticasPersonas.jsx`): dos
  gráficas con datos reales — personas por tipo (pastel) y top 10
  ciudades con más personas (barras), usando
  `Person.BusinessEntityAddress` + `Person.Address`.

## 4. Endpoints disponibles

| Método | Ruta                          | Descripción                          |
|--------|-------------------------------|---------------------------------------|
| GET    | `/api/persons?search=&page=`  | Lista personas (búsqueda + paginado)  |
| GET    | `/api/persons/:id`            | Detalle de una persona                |
| GET    | `/api/persons/stats`          | Estadísticas: por tipo y por ciudad   |
| POST   | `/api/auth/login`             | Login contra datos reales de Person   |

Solo se tocan tablas del esquema **Person**, tal como pediste.
