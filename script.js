// Get DOM elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const feelsLike = document.getElementById("feels-like");
const weatherIcon = document.getElementById("weather-icon");
const dateElement = document.getElementById("date");

// FREE API KEY - Get yours at: https://openweathermap.org/api
// For now, we'll use mock data so it works without API key
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Mock data for testing without API
const mockData = {
    name: "New York",
    main: {
        temp: 72,
        feels_like: 75,
        humidity: 65
    },
    weather: [{
        main: "Clear",
        description: "clear sky"
    }],
    wind: {
        speed: 5
    }
};

// Format current date
function formatDate() {
    const now = new Date();
    const options = { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
    };
    return now.toLocaleDateString("en-US", options);
}

// Update date on page load
dateElement.textContent = formatDate();

// Update weather icon based on condition
function updateWeatherIcon(weatherCondition) {
    const icon = weatherIcon.querySelector("i");
    const condition = weatherCondition.toLowerCase();
    
    // Map weather conditions to Font Awesome icons
    const iconMap = {
        "clear": "fas fa-sun",
        "clouds": "fas fa-cloud",
        "rain": "fas fa-cloud-rain",
        "snow": "fas fa-snowflake",
        "thunderstorm": "fas fa-bolt",
        "drizzle": "fas fa-cloud-rain",
        "mist": "fas fa-smog",
        "smoke": "fas fa-smog",
        "haze": "fas fa-smog",
        "dust": "fas fa-smog",
        "fog": "fas fa-smog",
        "sand": "fas fa-smog",
        "ash": "fas fa-smog",
        "squall": "fas fa-wind",
        "tornado": "fas fa-tornado"
    };
    
    // Set icon class (default to sun if not found)
    icon.className = iconMap[condition] || "fas fa-sun";
    
    // Update icon color based on condition
    const colorMap = {
        "clear": "#FF9800",      // Orange for sun
        "clouds": "#607D8B",     // Blue-gray for clouds
        "rain": "#2196F3",       // Blue for rain
        "snow": "#00BCD4",       // Cyan for snow
        "thunderstorm": "#9C27B0" // Purple for storm
    };
    
    icon.style.color = colorMap[condition] || "#FF9800";
}

// Update UI with weather data
function updateUI(data) {
    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed)} mph`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°F`;
    
    // Update weather icon
    updateWeatherIcon(data.weather[0].main);
    
    // Add fade animation
    cityName.style.animation = "fadeIn 0.5s ease-in";
    setTimeout(() => {
        cityName.style.animation = "";
    }, 500);
}

// Get weather data from API or use mock data
async function getWeather(city) {
    // Show loading state
    cityName.textContent = "Loading...";
    description.textContent = "Fetching weather...";
    
    try {
        // If no real API key, use mock data
        if (API_KEY === "YOUR_API_KEY_HERE") {
            console.log("Using mock data. Get a free API key from: https://openweathermap.org/api");
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Use mock data with the searched city name
            const mockResponse = {
                ...mockData,
                name: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
                main: {
                    temp: Math.floor(Math.random() * 30) + 50, // Random temp 50-80
                    feels_like: Math.floor(Math.random() * 30) + 55, // Random feels like
                    humidity: Math.floor(Math.random() * 50) + 30 // Random humidity 30-80
                },
                weather: [{
                    main: ["Clear", "Clouds", "Rain", "Snow"][Math.floor(Math.random() * 4)],
                    description: ["Sunny day", "Partly cloudy", "Light rain", "Snow showers"][Math.floor(Math.random() * 4)]
                }],
                wind: {
                    speed: Math.floor(Math.random() * 15) + 1 // Random wind 1-15 mph
                }
            };
            
            updateUI(mockResponse);
            return;
        }
        
        // Use real API if key is provided
        const response = await fetch(
            `${BASE_URL}?q=${city}&units=imperial&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error("City not found");
        }
        
        const data = await response.json();
        updateUI(data);
        
    } catch (error) {
        alert(`Error: ${error.message}\n\nTip: Get a free API key from:\nhttps://openweathermap.org/api`);
        
        // Reset to default city
        mockData.name = "New York";
        updateUI(mockData);
    }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = ""; // Clear input
    } else {
        alert("Please enter a city name");
    }
});

// Search on Enter key press
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// Example cities for quick testing
const exampleCities = ["New York", "London", "Tokyo", "Paris", "Sydney"];

// Load weather for default city on page load
getWeather("New York");

// Bonus: Add clickable example cities in console
console.log("Weather App Ready! Try searching for:");
exampleCities.forEach(city => {
    console.log(`  - ${city}`);
});
console.log("\nTo use real weather data, get a free API key from: https://openweathermap.org/api");