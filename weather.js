// Constants
const API_KEY = 'f6aa25eb9dmsh2a38ba3bfe79d7fp1019c1jsnf3c50842df1e';
const WEATHER_INFO_ELEMENT = document.getElementById('weather-info');
const CITY_INPUT_ELEMENT = document.getElementById('city-input');
const SEARCH_BTN_ELEMENT = document.getElementById('search-btn');

// Function to fetch weather data based on location (latitude and longitude)
async function fetchWeatherData(lat, lon) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    WEATHER_INFO_ELEMENT.innerHTML = '<p>Unable to retrieve weather data. Please try again later.</p>';
    console.error('Error fetching weather data:', error);
  }
}

// Function to display weather data on the webpage
function displayWeatherData(data) {
  if (data.cod !== 200) {
    WEATHER_INFO_ELEMENT.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  const { name, main, weather, wind } = data;
  WEATHER_INFO_ELEMENT.innerHTML = `
    <h2>Weather in ${name}</h2>
    <p>Temperature: ${main.temp} °C</p>
    <p>Feels Like: ${main.feels_like} °C</p>
    <p>Weather: ${weather[0].description}</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;
}

// Function to get the user's current location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => fetchWeatherData(position.coords.latitude, position.coords.longitude),
      error => {
        WEATHER_INFO_ELEMENT.innerHTML = '<p>Location access denied. Please allow access to your location or search for a city.</p>';
        console.error('Error getting location:', error);
      }
    );
  } else {
    WEATHER_INFO_ELEMENT.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
  }
}

// Function to handle city search
async function searchCityWeather() {
  const city = CITY_INPUT_ELEMENT.value.trim();
  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    WEATHER_INFO_ELEMENT.innerHTML = '<p>Unable to retrieve weather data. Please try again later.</p>';
    console.error('Error fetching weather data:', error);
  }
}

// Event listener for search button
SEARCH_BTN_ELEMENT.addEventListener('click', searchCityWeather);

// Automatically fetch weather based on user's current location when the page loads
window.onload = getUserLocation;