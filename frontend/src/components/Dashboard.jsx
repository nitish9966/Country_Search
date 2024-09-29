import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet styles

const Dashboard = ({ handleLogout }) => {
  const [countryName, setCountryName] = useState("");
  const [map, setMap] = useState(null); // State for map instance
  const [currentMarker, setCurrentMarker] = useState(null);

  useEffect(() => {
    // Initialize the map if not already done
    if (!map && !document.getElementById("map")._leaflet_id) {
      const mapInstance = L.map("map").setView([51.505, -0.09], 3);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      setMap(mapInstance); // Store the map instance in state
    }
  }, [map]);

  const addMarkerAndPopup = (lat, lng, country) => {
    const currencies = Object.values(country.currencies)
      .map((currency) => currency.name)
      .join(", ");
    const languages = Object.values(country.languages).join(", ");
    const popupContent = `
      <div style="text-align: center">
        <h3 style="font-weight: bold;font-size:20px">${country.name.common}</h3>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Population:</strong> ${country.population}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Currencies:</strong> ${currencies}</p>
        <p><strong>Languages:</strong> ${languages}</p>
      </div>
    `;

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    const newMarker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(popupContent)
      .openPopup();
    setCurrentMarker(newMarker);
  };

  const handleSearch = async () => {
    if (countryName === "") return alert("Please enter a country name");

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      if (!response.ok) throw new Error("Country not found");
      const data = await response.json();
      const country = data[0];

      addMarkerAndPopup(country.latlng[0], country.latlng[1], country);
      map.setView([country.latlng[0], country.latlng[1]], 5); // Adjust zoom level as needed
    } catch (error) {
      console.error(error);
      alert("Error fetching country data. Please try again.");
    }
  };

  return (
    <div className="font-sans text-center h-full m-0">
      {/* Map Container */}
      <div id="map" className="fixed inset-0 w-full h-full -z-10"></div>

      {/* Header and Logout Button */}
      <header className="container relative z-10 p-6">
        <button
          onClick={handleLogout}
          id="logout-button"
          className="bg-blue-500 text-white py-2 px-4 absolute top-5 right-5 rounded hover:bg-blue-600"
        >
          Logout
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Country Search</h1>
      </header>

      {/* Search Bar */}
      <div className="search-container mt-10 z-10">
        <input
          type="text"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          id="country-input"
          placeholder="Enter a country name"
          className="p-2 w-80 border border-gray-300 rounded"
        />
        <button
          id="search-button"
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 ml-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
