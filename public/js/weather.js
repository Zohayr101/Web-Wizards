// Your OpenWeather API key (remember to secure this in production)
/**
 * Your OpenWeather API key.
 * Note: In production environments, ensure that API keys are stored securely and not exposed in client-side code.
 * @constant {string}
 */
const apiKey = '6765d5c874c5fa77f2345c854dc9cf0e';

// Helper function to convert 24-hour time to 12-hour format with AM/PM
/**
 * Converts time from 24-hour format to 12-hour format with AM/PM.
 *
 * @param {number} hour24 - The hour in 24-hour format.
 * @param {number} minutes - The minutes.
 * @returns {string} The formatted time string (e.g., "1:05 PM").
 */
function formatTime(hour24, minutes) {
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Display current weather details in the widget
/**
 * Displays current weather details in the weather widget.
 *
 * @param {Object} data - The weather data object returned by the OpenWeather API.
 * @param {string} data.name - The name of the location.
 * @param {Object[]} data.weather - An array of weather condition objects.
 * @param {string} data.weather[].icon - The icon code for the weather condition.
 * @param {string} data.weather[].description - The weather description.
 * @param {Object} data.main - Contains main weather properties.
 * @param {number} data.main.temp - The current temperature in Fahrenheit.
 * @param {number} data.main.humidity - The humidity percentage.
 * @param {Object} data.wind - Contains wind data.
 * @param {number} data.wind.speed - The wind speed in mph.
 */
function displayCurrentWeather(data) {
  const widget = document.getElementById('weatherWidget');
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  widget.innerHTML = `
    <div class="weather-details">
      <h2>${data.name}</h2>
      <img src="${iconUrl}" alt="Weather icon" class="weather-icon">
      <p><strong>Temperature:</strong> ${data.main.temp}°F</p>
      <p><strong>Condition:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} mph</p>
    </div>
  `;
}

// Fetch current weather by city name
/**
 * Fetches current weather data for the specified city and updates the weather widget.
 *
 * @param {string} city - The city name for which to fetch weather data.
 */
function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found or API error');
      }
      return response.json();
    })
    .then(data => {
      displayCurrentWeather(data);
      fetchForecastByCity(city);
    })
    .catch(error => {
      document.getElementById('weatherWidget').innerHTML = `<p style="color: var(--error-color);">${error.message}</p>`;
      document.getElementById('forecastWidget').innerHTML = "";
    });
}

// Fetch current weather by geographic coordinates
/**
 * Fetches current weather data using geographic coordinates and updates the weather widget.
 *
 * @param {number} lat - The latitude coordinate.
 * @param {number} lon - The longitude coordinate.
 */
function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Location not found or API error');
      }
      return response.json();
    })
    .then(data => {
      displayCurrentWeather(data);
      fetchForecastByCoords(lat, lon);
    })
    .catch(error => {
      document.getElementById('weatherWidget').innerHTML = `<p style="color: var(--error-color);">${error.message}</p>`;
      document.getElementById('forecastWidget').innerHTML = "";
    });
}

// Fetch forecast by city name
/**
 * Fetches the forecast for the specified city.
 *
 * @param {string} city - The city name for which to fetch the forecast.
 */
function fetchForecastByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
  fetchForecast(url);
}

// Fetch forecast by geographic coordinates
/**
 * Fetches the forecast using geographic coordinates.
 *
 * @param {number} lat - The latitude coordinate.
 * @param {number} lon - The longitude coordinate.
 */
function fetchForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetchForecast(url);
}

// Common function to fetch and display forecast until midnight
/**
 * Fetches forecast data from the given URL and displays the forecast until midnight.
 *
 * This function retrieves forecast data, calculates the local time for the city based on the timezone offset,
 * filters forecast items for the remainder of the day, and updates the forecast widget with the information.
 *
 * @param {string} url - The URL for fetching the forecast data.
 */
function fetchForecast(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Forecast not available');
      }
      return response.json();
    })
    .then(forecastData => {
      const forecastWidget = document.getElementById('forecastWidget');
      const tzOffset = forecastData.city.timezone; // seconds offset
      const nowUTC = Math.floor(Date.now() / 1000);
      const cityLocalNow = new Date((nowUTC + tzOffset) * 1000);
      const localYear = cityLocalNow.getUTCFullYear();
      const localMonth = cityLocalNow.getUTCMonth();
      const localDate = cityLocalNow.getUTCDate();
      
      let forecastHTML = `<h3>Forecast For The Day</h3>`;
      // Filter forecast items for later today only
      const todayForecasts = forecastData.list.filter(item => {
        const localTime = new Date((item.dt + tzOffset) * 1000);
        return (
          localTime.getUTCFullYear() === localYear &&
          localTime.getUTCMonth() === localMonth &&
          localTime.getUTCDate() === localDate &&
          localTime.getTime() > cityLocalNow.getTime()
        );
      });
      
      if (todayForecasts.length === 0) {
        forecastHTML += `<p>No forecast data available for later today.</p>`;
      } else {
        todayForecasts.forEach(item => {
          const localTime = new Date((item.dt + tzOffset) * 1000);
          const hours = localTime.getUTCHours();
          const minutes = localTime.getUTCMinutes();
          const timeStr = formatTime(hours, minutes);
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
          forecastHTML += `
            <div class="forecast-item">
              <div class="forecast-time">${timeStr}</div>
              <div class="forecast-details">
                <img src="${iconUrl}" alt="icon">
                <span>${item.main.temp}°F, ${item.weather[0].description}</span>
              </div>
            </div>
          `;
        });
      }
      forecastWidget.innerHTML = forecastHTML;
    })
    .catch(error => {
      document.getElementById('forecastWidget').innerHTML = `<p style="color: var(--error-color);">${error.message}</p>`;
    });
}

// Event listeners for user interactions
/**
 * Event listener for the "Get Weather" button.
 * Fetches weather data for the city selected in the city dropdown.
 */
document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('citySelect').value;
  fetchWeather(city);
  incrementWeatherChecks();
});

/**
 * Event listener for the "Get Location Weather" button.
 * Retrieves the user's current geographic location and fetches weather data for that location.
 */
document.getElementById('getLocationWeatherBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        fetchWeatherByCoords(lat, lon);
        incrementWeatherChecks();
      },
      () => {
        alert("Unable to retrieve your location. Please enable location services.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// On page load, fetch weather for the default city
/**
 * On page load, fetch weather data for the default city selected in the city dropdown.
 */
window.addEventListener('load', () => {
  fetchWeather(document.getElementById('citySelect').value);
  incrementWeatherChecks();
});

async function incrementWeatherChecks() {
  let response = await fetch("/api.stats");
  stats = await response.json();
  if (stats.length === 0) {
    // No stats found, initialize them
    console.log("No stats found. Initializing...");
    const initResponse = await fetch("/api/stats/initialize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (initResponse.ok) {
        stats = await initResponse.json();
        console.log("Stats initialized:", stats);
    } else {
        console.error("Failed to initialize stats:", initResponse.statusText);
        return;
    }
} else {
    stats = stats[0]; // Assuming stats is an array, take the first entry
}
let id = await stats.id;

stats.weatherChecks++;

const updateResponse = await fetch(`/api/stats/${id}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(stats)
});
if (!updateResponse.ok) {
    console.error(updateResponse.statusText);
}
}
