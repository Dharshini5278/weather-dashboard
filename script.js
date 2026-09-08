// ==========================================
// Weather Dashboard
// Open-Meteo API
// ==========================================

// HTML elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");


// ==========================================
// Weather Code Function
// ==========================================

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            text: "Clear Sky",
            icon: "☀️"
        },

        1: {
            text: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            text: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            text: "Overcast",
            icon: "☁️"
        },

        45: {
            text: "Fog",
            icon: "🌫️"
        },

        48: {
            text: "Fog",
            icon: "🌫️"
        },

        51: {
            text: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            text: "Drizzle",
            icon: "🌦️"
        },

        55: {
            text: "Heavy Drizzle",
            icon: "🌧️"
        },

        61: {
            text: "Light Rain",
            icon: "🌧️"
        },

        63: {
            text: "Rain",
            icon: "🌧️"
        },

        65: {
            text: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            text: "Light Snow",
            icon: "🌨️"
        },

        73: {
            text: "Snow",
            icon: "❄️"
        },

        75: {
            text: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            text: "Rain Showers",
            icon: "🌦️"
        },

        81: {
            text: "Rain Showers",
            icon: "🌧️"
        },

        82: {
            text: "Heavy Rain Showers",
            icon: "⛈️"
        },

        95: {
            text: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            text: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            text: "Severe Thunderstorm",
            icon: "⛈️"
        }
    };

    return weatherCodes[code] || {
        text: "Unknown Weather",
        icon: "🌤️"
    };
}


// ==========================================
// Get City Coordinates
// ==========================================

async function getCityCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to connect to location service.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please enter a valid city name.");
    }

    return data.results[0];
}


// ==========================================
// Get Weather Data
// ==========================================

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to fetch weather information.");
    }

    const data = await response.json();

    return data;
}


// ==========================================
// Display Weather
// ==========================================

function displayWeather(location, weatherData) {

    const current = weatherData.current;

    const weatherInfo = getWeatherInfo(current.weather_code);

    cityName.textContent = location.name;

    countryName.textContent =
        `${location.admin1 || ""}, ${location.country || ""}`;

    temperature.textContent =
        `${Math.round(current.temperature_2m)} °C`;

    condition.textContent =
        weatherInfo.text;

    weatherIcon.textContent =
        weatherInfo.icon;

    windSpeed.textContent =
        `${current.wind_speed_10m} km/h`;

    humidity.textContent =
        `${current.relative_humidity_2m} %`;

    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)} °C`;

    weatherCard.style.display = "block";
}


// ==========================================
// Main Search Function
// ==========================================

async function searchWeather() {

    const city = cityInput.value.trim();

    // Clear old error
    errorMessage.textContent = "";

    // Hide old weather
    weatherCard.style.display = "none";

    // Validate input
    if (city === "") {

        errorMessage.textContent =
            "Please enter a city name.";

        return;
    }

    // Show loading
    loading.style.display = "block";

    searchBtn.disabled = true;

    try {

        // Step 1: Find city
        const location = await getCityCoordinates(city);

        // Step 2: Get weather
        const weatherData =
            await getWeather(
                location.latitude,
                location.longitude
            );

        // Step 3: Display weather
        displayWeather(location, weatherData);

    }

    catch (error) {

        console.error("Weather Error:", error);

        errorMessage.textContent =
            error.message ||
            "Something went wrong. Please try again.";
    }

    finally {

        // Hide loading
        loading.style.display = "none";

        // Enable button
        searchBtn.disabled = false;
    }
}


// ==========================================
// Button Event
// ==========================================

searchBtn.addEventListener(
    "click",
    searchWeather
);


// ==========================================
// Enter Key Event
// ==========================================

cityInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchWeather();

        }

    }
);