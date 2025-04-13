// Global variables
let isCelsius = true;
let currentWeatherData = null;
let currentSeasonalMessage = "";

// Seasonal messages - organized by weather type
const seasonalMessages = {
  winter: [
    "Bundle up! It's freezing outside today ❄️ (>ᴗ<)",
    "Time for hot cocoa and warm blankets! ☕ (^-^)",
    "Winter wonderland outside! Don't forget gloves 🧤 ヽ(•‿•)ノ",
    "Brrr! Layer up before heading out today 🧣 (•⩊•)",
    "Snow day vibes! Perfect for building snowmen ☃️ (◕ᴗ◕)"
  ],
  spring: [
    "April showers bring May flowers! 🌧️ (◡‿◡✿)",
    "Don't forget your umbrella today! ☂️ ┬┴┬┴┤•ᴗ•)ﾉ",
    "Raincoat weather! Splash in some puddles 💦 (=^◡^=)",
    "Spring breeze feels nice! Enjoy the fresh air 🌿 (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
    "Perfect weather for watching flowers bloom 🌸 (*^‿^*)"
  ],
  summer: [
    "Don't forget sunscreen! UV index is high today ☀️ (⌐■_■)",
    "Perfect beach day! Grab your flip-flops 🏖️ ~(˘▾˘~)",
    "Stay hydrated in this heat! Drink water 💧 (•̀ᴗ•́)و",
    "Ice cream weather! Treat yourself today 🍦 (◠‿◠)",
    "Summer vibes! Time for outdoor adventures 🌞 \\(^ᴗ^)/"
  ],
  autumn: [
    "Sweater weather is here! Cozy up 🍂 (⌒‿⌒)",
    "Perfect day for pumpkin spice everything 🎃 (❍ᴥ❍)",
    "Leaves are falling! Enjoy the crunch under your feet 🍁 (^▽^)",
    "Grab a light jacket before heading out today 🧥 ╰(´꒳`)╯",
    "Autumn breeze feels nice! Apple cider time 🍎 (づ｡◕‿‿◕｡)づ"
  ],
  rainy: [
    "Don't forget your umbrella or you might get wet! ☔ (・ω・)ノ",
    "Splish splash! Rain boots recommended today 👢 ヾ(•ω•`)o",
    "Perfect day to stay in with a good book and tea 📚 (´｡• ᵕ •｡`)",
    "Rain rain go away... or don't, it's actually quite soothing 🌧️ (๑ᴗ๑)",
    "Enjoy the pitter-patter of raindrops on your window 💧 (✿◠‿◠)"
  ],
  stormy: [
    "Lightning alert! Best to stay indoors today ⚡ (°ロ°)!",
    "Thunder buddies activate! Stormy day ahead 🌩️ (っ °Д °;)っ",
    "Whoa! Hold onto your hats, it's windy out there 💨 ┗(•ˇ_ˇ•)―→",
    "Storm watching day! Enjoy from somewhere safe 🌪️ (⊙_⊙)",
    "Perfect weather for making storm playlists 🎵 (•̀ᴗ•́)൬"
  ],
  clear: [
    "Beautiful day outside! Enjoy the sunshine ✨ (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
    "Perfect weather for a walk or picnic 🧺 ♪(^∇^*)",
    "Clear skies and good vibes today 😊 (´･ᴗ･`)",
    "Weather is chef's kiss today! 👌 (˘◡˘)",
    "No excuses to stay inside with weather this nice 🌤️ ヽ(•‿•)ノ"
  ]
};

// Initialize the app when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.addEventListener('change', toggleDarkMode);
  
  // Set up temperature unit toggle
  const unitToggle = document.getElementById('unit-toggle');
  unitToggle.addEventListener('change', function() {
    const unitLabel = document.getElementById('unit-label');
    unitLabel.textContent = this.checked ? '°F' : '°C';
    toggleUnit();
  });
  
  // Set up Enter key event listener
  const cityInput = document.getElementById('city-input');
  cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      getWeather();
    }
  });
  
  // Check if dark mode was previously enabled
  if (localStorage.getItem('darkMode') === 'enabled') {
    darkModeToggle.checked = true;
    document.body.classList.add('dark-mode');
  }
});

// Toggle dark mode
function toggleDarkMode() {
  if (document.body.classList.contains('dark-mode')) {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  } else {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
  }
}

// Toggle between Celsius and Fahrenheit
function toggleUnit() {
  isCelsius = !isCelsius;
  
  // Update display if we have data
  if (currentWeatherData) {
    displayWeather(currentWeatherData, false); // Keep the same message
  }
}

// Get weather at user's location
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      (error) => {
        showError("Unable to retrieve your location. " + error.message);
      }
    );
  } else {
    showError("Geolocation is not supported by your browser.");
  }
}

// Get weather data using coordinates
function getWeatherByCoords(lat, lon) {
  hideError();
  
  // OpenWeatherMap API Key
  const apiKey = '0c2467c08df3a77e1ba2b15c32ac2563';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Weather data not found or API error");
      }
      return response.json();
    })
    .then(data => {
      currentWeatherData = data;
      displayWeather(data, true); // Generate new message
      getForecast(lat, lon);
    })
    .catch(error => {
      showError(error.message);
    });
}

// Get weather by city name
function getWeather() {
  const city = document.getElementById('city-input').value;

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  hideError();

  // OpenWeatherMap API Key
  const apiKey = '0c2467c08df3a77e1ba2b15c32ac2563';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found or API error");
      }
      return response.json();
    })
    .then(data => {
      currentWeatherData = data;
      displayWeather(data, true); // Generate new message
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch(error => {
      showError(error.message);
    });
}

// Get 5-day forecast data
function getForecast(lat, lon) {
  const apiKey = '0c2467c08df3a77e1ba2b15c32ac2563';
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Forecast data not found or API error");
      }
      return response.json();
    })
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.error("Error fetching forecast:", error);
    });
}

// Display the 5-day forecast
function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  const forecastDays = document.getElementById('forecast-days');
  forecastDays.innerHTML = '';
  forecastContainer.classList.remove('hidden');
  
  // Get one forecast per day (noon time)
  const dailyForecasts = {};
  
  // Process the forecast data
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const hour = date.getHours();
    
    // Use the forecast closest to noon for each day
    if (!dailyForecasts[day] || Math.abs(hour - 12) < Math.abs(dailyForecasts[day].hour - 12)) {
      dailyForecasts[day] = {
        data: item,
        hour: hour
      };
    }
  });
  
  // Display each day's forecast (limit to 5 days)
  let count = 0;
  for (const day in dailyForecasts) {
    if (count >= 5) break;
    
    const forecast = dailyForecasts[day].data;
    const temp = isCelsius ? 
      Math.round(forecast.main.temp) + '°C' : 
      Math.round((forecast.main.temp * 9/5) + 32) + '°F';
    
    // Create forecast card
    const forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-card';
    forecastCard.innerHTML = `
      <div class="forecast-day">${day}</div>
      <div class="forecast-icon">
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather icon">
      </div>
      <div class="forecast-temp">${temp}</div>
      <div>${forecast.weather[0].description}</div>
    `;
    
    forecastDays.appendChild(forecastCard);
    count++;
  }
}

// Determine weather category for seasonal message
function getSeasonalCategory(weatherDescription) {
  const lowerCaseDesc = weatherDescription.toLowerCase();

  if (lowerCaseDesc.includes("snow") || lowerCaseDesc.includes("cold")) {
    return "winter";
  } else if (lowerCaseDesc.includes("rain") || lowerCaseDesc.includes("drizzle")) {
    return "rainy";
  } else if (lowerCaseDesc.includes("storm") || lowerCaseDesc.includes("thunderstorm")) {
    return "stormy";
  } else if (lowerCaseDesc.includes("clear") || lowerCaseDesc.includes("sunny")) {
    return "clear";
  } else if (lowerCaseDesc.includes("cloud") || lowerCaseDesc.includes("windy")) {
    return "autumn";
  } else if (lowerCaseDesc.includes("hot") || lowerCaseDesc.includes("heat")) {
    return "summer";
  } else {
    return "spring"; // Default
  }
}

// Get a random seasonal message based on weather
function getRandomSeasonalMessage(weatherDescription) {
  const season = getSeasonalCategory(weatherDescription);
  const messages = seasonalMessages[season];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Set the weather background image
function setWeatherBackground(weatherMain) {
  const weatherBackground = document.getElementById('weather-background');
  
  // Remove existing classes
  weatherBackground.className = 'weather-image';
  
  // Add appropriate background class based on weather
  const lowerCaseMain = weatherMain.toLowerCase();
  if (lowerCaseMain === 'clear') {
    weatherBackground.classList.add('bg-clear');
  } else if (lowerCaseMain === 'clouds') {
    weatherBackground.classList.add('bg-clouds');
  } else if (lowerCaseMain === 'rain' || lowerCaseMain === 'drizzle') {
    weatherBackground.classList.add('bg-rain');
  } else if (lowerCaseMain === 'snow') {
    weatherBackground.classList.add('bg-snow');
  } else if (lowerCaseMain === 'thunderstorm') {
    weatherBackground.classList.add('bg-thunderstorm');
  } else if (lowerCaseMain === 'mist' || lowerCaseMain === 'fog' || lowerCaseMain === 'haze') {
    weatherBackground.classList.add('bg-mist');
  } else {
    // Default background
    weatherBackground.classList.add('bg-clouds');
  }
}

// Display weather data and seasonal message
function displayWeather(data, generateNewMessage = true) {
  const weatherContainer = document.getElementById('weather-container');
  const cityName = document.getElementById('city-name');
  const temperature = document.getElementById('temperature');
  const description = document.getElementById('description');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');
  const seasonalMessage = document.getElementById('seasonal-message');
  const weatherIcon = document.getElementById('weather-icon');

  // Set city name
  cityName.textContent = data.name;
  
  // Display temperature in Celsius or Fahrenheit
  const tempValue = isCelsius ? 
    Math.round(data.main.temp) : 
    Math.round((data.main.temp * 9/5) + 32);
  const tempUnit = isCelsius ? '°C' : '°F';
  temperature.textContent = `${tempValue}${tempUnit}`;
  
  // Set other weather details
  description.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;

  // Set the weather icon
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  // Set weather background image
  setWeatherBackground(data.weather[0].main);

  // Get or reuse seasonal message
  if (generateNewMessage) {
    // Generate a new message only when fetching new weather data
    currentSeasonalMessage = getRandomSeasonalMessage(data.weather[0].description);
  }
  
  seasonalMessage.textContent = currentSeasonalMessage;
  weatherContainer.classList.remove('hidden');
}

// Show error message
function showError(message) {
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  document.getElementById('weather-container').classList.add('hidden');
  document.getElementById('forecast-container').classList.add('hidden');
}

// Hide error message
function hideError() {
  document.getElementById('error-message').style.display = 'none';
}
