import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import "./MapaMundial.css";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COORDENADAS_PAIS = {
  "United States": [-98.5, 39.8],
  "Canada": [-106.3, 56.1],
  "United Kingdom": [-1.5, 52.4],
  "Australia": [133.8, -25.3],
  "Germany": [10.4, 51.2],
  "France": [2.2, 46.6],
  "Mexico": [-102.5, 23.6],
  "Spain": [-3.7, 40.4],
  "Italy": [12.5, 42.5],
  "China": [104.2, 35.9],
  "Japan": [138.3, 36.2],
  "Brazil": [-51.9, -14.2],
  "India": [78.9, 20.6],
  "Netherlands": [5.3, 52.1],
  "Portugal": [-8.2, 39.4],
  "Argentina": [-63.6, -38.4],
  "South Africa": [24.7, -30.6],
  "Sweden": [18.6, 60.1],
  "Switzerland": [8.2, 46.8],
  "Belgium": [4.5, 50.5],
};

function escalaRadio(total, maxTotal) {
  const min = 5;
  const max = 14;
  if (maxTotal <= 0) return min;
  return min + (total / maxTotal) * (max - min);
}

function MapaMundial({ paises }) {
  const maxTotal = Math.max(0, ...paises.map((p) => p.total));

  return (
    <div className="mapa-mundial">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130 }}>
        <ZoomableGroup center={[10, 20]} zoom={2} minZoom={1} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} className="mapa-pais" />
              ))
            }
          </Geographies>

          {paises.map(({ pais, total }) => {
            const coords = COORDENADAS_PAIS[pais];
            if (!coords) return null;
            const radio = escalaRadio(total, maxTotal);

            return (
              <Marker key={pais} coordinates={coords}>
                <circle r={radio} className="mapa-pulso" />
                <circle r={radio} className="mapa-punto" />
                <title>{`${pais}: ${total.toLocaleString()} personas`}</title>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default MapaMundial;