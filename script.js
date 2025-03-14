var map = L.map('map').setView([39.9864, -0.0513], 12); // Default to Castellón

// Add Esri WorldStreetMap basemap
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

// OpenWeatherMap API Key (Replace with your actual key)
const API_KEY = "0c4bfbe9bd1ef147d75f81dda5baf453";
const API_URL = "https://api.openweathermap.org/data/2.5/find";

// Create a marker group
var markers = L.markerClusterGroup();

// Function to fetch and display weather stations
function fetchWeatherStations(lat, lon) {
    fetch(`${API_URL}?lat=${lat}&lon=${lon}&cnt=20&units=metric&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        data.list.forEach(station => {
            const { coord, name, main, weather, wind } = station;
            const marker = L.marker([coord.lat, coord.lon])
                .bindPopup(
                    `<b>${name}</b><br>
                     Description: ${weather[0].description}<br>
                     Temperature: ${Math.round(main.temp)}°C<br>
                     Humidity: ${main.humidity}%<br>
                     Wind Speed: ${wind.speed} m/s`
                );
            markers.addLayer(marker);
        });
        map.addLayer(markers);
    })
    .catch(error => console.error('Error fetching weather stations:', error));
}

// Get user's geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13);
            fetchWeatherStations(latitude, longitude);
        }
    );
} 
