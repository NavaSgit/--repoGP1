import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { obtenerUbicacionesPersona } from "../../../services/api";

// Caché de sesión: no se vuelve a pedir la geocodificación al reabrir un perfil
const cacheSesion = new Map();

// Pin propio (evita el problema de rutas de imágenes de Leaflet con Vite)
const iconoPin = L.divIcon({
  className: "perfil-pin",
  html: "<span></span>",
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -24],
});

function AjustarVista({ puntos }) {
  const map = useMap();
  useEffect(() => {
    if (puntos.length === 1) {
      map.setView(puntos[0], 16);
    } else if (puntos.length > 1) {
      map.fitBounds(puntos, { padding: [40, 40], maxZoom: 16 });
    }
  }, [map, puntos]);
  return null;
}

function Linea({ d }) {
  return (
    <>
      {d.AddressLine1 && <p>{d.AddressLine1}</p>}
      {d.AddressLine2 && <p>{d.AddressLine2}</p>}
      <p>
        {[d.City, d.StateProvince].filter(Boolean).join(", ")}
        {d.PostalCode ? ` ${d.PostalCode}` : ""}
      </p>
      {d.Country && <p>{d.Country}</p>}
    </>
  );
}

function UbicacionesSeccion({ id, direcciones }) {
  const [ubic, setUbic] = useState(cacheSesion.get(id) || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cacheSesion.has(id)) {
      setUbic(cacheSesion.get(id));
      setError(false);
      return;
    }
    let cancelado = false;
    setUbic(null);
    setError(false);

    obtenerUbicacionesPersona(id)
      .then((d) => {
        if (cancelado) return;
        cacheSesion.set(id, d.ubicaciones);
        setUbic(d.ubicaciones);
      })
      .catch(() => {
        if (!cancelado) setError(true);
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  const porId = useMemo(
    () => new Map((ubic || []).map((u) => [u.AddressID, u])),
    [ubic],
  );
  const conCoords = useMemo(
    () => (ubic || []).filter((u) => u.lat != null && u.lon != null),
    [ubic],
  );
  const puntos = useMemo(
    () => conCoords.map((u) => [u.lat, u.lon]),
    [conCoords],
  );

  const cargandoMapa = ubic === null && !error;

  return (
    <section className="perfil-card">
      <h3>Ubicaciones</h3>

      {direcciones.length === 0 ? (
        <p className="perfil-vacio">No disponible</p>
      ) : (
        <>
          {/* Mapa */}
          {cargandoMapa && (
            <p className="perfil-mapa-aviso">
              Ubicando direcciones en el mapa...
            </p>
          )}
          {error && (
            <p className="perfil-mapa-aviso">
              No fue posible consultar las ubicaciones en el mapa.
            </p>
          )}
          {ubic && conCoords.length === 0 && (
            <p className="perfil-mapa-aviso">
              La ubicación exacta en el mapa no está disponible para esta
              persona.
            </p>
          )}
          {conCoords.length > 0 && (
            <div className="perfil-mapa">
              <MapContainer
                center={puntos[0]}
                zoom={15}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={19}
                />
                <AjustarVista puntos={puntos} />
                {conCoords.map((u) => (
                  <Marker
                    key={u.AddressID}
                    position={[u.lat, u.lon]}
                    icon={iconoPin}
                  >
                    <Popup>
                      <div className="perfil-popup">
                        <strong>{u.AddressType || "Dirección"}</strong>
                        <Linea d={u} />
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          {/* Tarjetas de texto (siempre visibles) */}
          <div className="perfil-direcciones">
            {direcciones.map((d) => {
              const u = porId.get(d.AddressID);
              const enMapa = u && u.lat != null;
              return (
                <div className="perfil-direccion" key={d.AddressID}>
                  <span className="perfil-direccion-tipo">
                    {d.AddressType || "Dirección"}
                  </span>
                  <Linea d={d} />
                  {!cargandoMapa && !error && (
                    <p
                      className={enMapa ? "perfil-en-mapa" : "perfil-sin-mapa"}
                    >
                      {enMapa
                        ? "Ubicada en el mapa"
                        : "Ubicación exacta no disponible en el mapa"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default UbicacionesSeccion;
