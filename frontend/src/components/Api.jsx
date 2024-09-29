import L from "leaflet";

export const initializeMap = (
  mapContainer,
  initialCoordinates = [51.505, -0.09],
  zoomLevel = 3
) => {
  const map = L.map(mapContainer).setView(initialCoordinates, zoomLevel);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  return map;
};

export const addMarkerAndPopup = (map, currentMarker, lat, lng, country) => {
  const currencies = Object.values(country.currencies)
    .map((currency) => currency.name)
    .join(", ");
  const languages = Object.values(country.languages).join(", ");
  const popupContent = `
    <h3>${country.name.common}</h3>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Region: ${country.region}</p>
    <p>Currencies: ${currencies}</p>
    <p>Languages: ${languages}</p>
  `;

  // Remove previous marker if exists
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // Add new marker and bind popup
  const newMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(popupContent)
    .openPopup();

  return newMarker;
};
