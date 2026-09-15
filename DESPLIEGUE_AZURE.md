# Despliegue en Azure — Estado y pasos restantes

## Estado actual

| Componente | Estado |
|---|---|
| Azure SQL Database | ✅ Migrada y funcionando |
| App Service backend (NexxusKeep) | ✅ Funcionando (/api/health OK) |
| Frontend (App Service) | ❌ Sin empezar — ver sección 2 |

---

## 1. Backend — ✅ YA FUNCIONANDO

El backend ya responde en `/api/health`. No hay que tocarlo.

Solo como referencia, esto fue lo que se arregló y viene aplicado en
esta versión del código:

- `Backend/src/config/db.js` usa **SQL Auth por defecto en Linux**
  (antes caía a Windows Auth y reventaba con `libodbc.so.2`).
- `Backend/package.json` tiene `msnodesqlv8` como `optionalDependency`.
- `Backend/.vscode/settings.json` excluye `node_modules` del zip de VS Code.
- `Backend/.deployment` fuerza `SCM_DO_BUILD_DURING_DEPLOYMENT=true`.

> Si alguna vez tienes que volver a desplegar el backend: abre **solo la
> carpeta `Backend/`** en VS Code, **sin correr `npm install`**, y usa
> `Deploy to Web App...`.

### Variables de entorno (ya configuradas en el portal)

`DB_AUTH=sql`, `DB_SERVER`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD`,
`DB_ENCRYPT=true`, `DB_TRUST_SERVER_CERTIFICATE=false`,
`SCM_DO_BUILD_DURING_DEPLOYMENT=true`, `WEBSITE_NODE_DEFAULT_VERSION=~22`

---

## 2. Frontend — desplegar en App Service (pendiente)

> Se usa **App Service** en vez de Static Web Apps porque la suscripción
> Azure for Students rechaza la creación de Static Web Apps en todas las
> regiones disponibles.

### Por qué hace falta la carpeta `FrontendDeploy/`

App Service con stack Node **no sirve archivos estáticos por sí solo**.
Antes se resolvía con `pm2 serve`, pero pm2 ya no viene incluido en
Node 20/22 en App Service. Por eso `FrontendDeploy/` trae un servidor
Express mínimo (`server.js`) que sirve el build y hace el fallback SPA
(cualquier ruta devuelve `index.html`, necesario para que React no dé 404
al recargar una ruta interna).

### Pasos

1. **Compila el frontend con la URL del backend.** En la raíz del
   proyecto, crea/edita `.env`:

   ```
   VITE_API_URL=https://<tu-dominio-backend>.azurewebsites.net
   ```

   > Esto se "hornea" dentro del build, así que si cambia la URL del
   > backend hay que recompilar.

   ```bash
   npm install
   npm run build
   ```

2. **Copia el build dentro de `FrontendDeploy/`:**

   La carpeta debe quedar así:

   ```
   FrontendDeploy/
   ├── server.js
   ├── package.json
   ├── .deployment
   └── dist/          ← copia aquí el contenido de la carpeta dist/ generada
       ├── index.html
       └── assets/
   ```

3. **Crea un segundo App Service** en el portal:
   - Mismo grupo de recursos (`rg-logingp1`)
   - Nombre: por ejemplo `nexxuskeep-frontend`
   - Publish: **Code** · Runtime: **Node 22** · OS: **Linux**
   - Región: una de las permitidas por tu suscripción (la misma del backend)
   - Plan: F1/gratis o el más económico

4. **Despliega desde VS Code:**
   - `File → Open Folder` → selecciona **solo `FrontendDeploy/`**
   - **No corras `npm install`** antes de desplegar
   - Panel de Azure → clic derecho en `nexxuskeep-frontend` →
     `Deploy to Web App...`

5. **Prueba** la URL pública que te da Azure. Debe cargar el login y,
   al entrar, mostrar los datos reales desde el backend.

---

## 3. Si el frontend no logra hablar con el backend (CORS)

El backend ya usa `cors()` abierto, así que debería funcionar. Si aun así
falla, en `Backend/src/server.js` puedes restringirlo a tu dominio:

```js
app.use(cors({ origin: "https://nexxuskeep-frontend.azurewebsites.net" }));
```

## 4. Errores comunes

| Síntoma | Causa probable |
|---|---|
| Página en blanco | `dist/` no se copió dentro de `FrontendDeploy/` |
| Error de red / "Failed to fetch" | `VITE_API_URL` mal puesto al compilar → recompila |
| 503 al abrir el sitio | Node no arrancó; revisa Log stream |
| `Cannot find package 'express'` | Se subió `node_modules`; bórralo y redespliega |
