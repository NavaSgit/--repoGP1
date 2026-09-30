// Geocodificación con Nominatim (OpenStreetMap).
// - Cola en serie con pausa de 1.1 s (política: máx. 1 solicitud/segundo).
// - Caché en memoria por AddressID (incluye "no encontrada").
// - Los errores de red NO se cachean, para reintentar después.

const cache = new Map(); // AddressID -> { lat, lon } | null
const enCurso = new Map(); // AddressID -> Promise
let cola = Promise.resolve();

const PAUSA_MS = 1100;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function consultar(dir) {
  const params = new URLSearchParams({
    street: dir.AddressLine1 || "",
    city: dir.City || "",
    state: dir.StateProvince || "",
    postalcode: dir.PostalCode || "",
    country: dir.Country || "",
    format: "json",
    limit: "1",
    addressdetails: "1",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        "User-Agent": "NexusKeep/1.0 (proyecto academico AdventureWorks)",
        "Accept-Language": "en",
      },
    }
  );
  if (!res.ok) throw new Error(`Nominatim respondió ${res.status}`);

  const [r] = await res.json();
  if (!r) return null;

  // Solo se acepta un resultado a nivel de casa/edificio.
  // Si solo se encontró la calle, la ciudad o el barrio, NO se usa.
  const exacta =
    Boolean(r.address?.house_number) ||
    ["house", "building"].includes(r.addresstype);
  if (!exacta) return null;

  const lat = parseFloat(r.lat);
  const lon = parseFloat(r.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

export function geocodificar(dir) {
  const k = dir.AddressID;
  if (cache.has(k)) return Promise.resolve(cache.get(k));
  if (enCurso.has(k)) return enCurso.get(k);

  const p = cola
    .then(async () => {
      try {
        const valor = await consultar(dir);
        cache.set(k, valor);
        return valor;
      } catch (err) {
        console.error("Geocodificación fallida:", k, err.message);
        return null; // sin caché: se reintentará en otra visita
      } finally {
        await dormir(PAUSA_MS);
      }
    })
    .finally(() => enCurso.delete(k));

  cola = p.catch(() => {});
  enCurso.set(k, p);
  return p;
}