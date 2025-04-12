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

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('dark-mode-toggle').addEventListener('change', toggleDarkMode);
  document.getElementById('unit-toggle').addEventListener('change', function () {
    document.getElementById('unit-label').textContent = this.checked ? '°F' : '°C';
    toggleUnit();
  });
  document.getElementById('city-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      getWeather();
    }
  });
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.getElementById('dark-mode-toggle').checked = true;
  }
});

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
}

function toggleUnit() {
  isCelsius = !isCelsius;
  if (currentWeatherData) {
    displayWeather(currentWeatherData, false);
  }
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      (err) => showError("Unable to retrieve your location. " + err.message)
    );
  } else {
    showError("Geolocation is not supported by your browser.");
  }
}

function getWeatherByCoords(lat, lon) {
  hideError();
  fetch(`/.netlify/functions/weather?lat=${lat}&lon=${lon}`)
    .then(res => {
      if (!res.ok) throw new Error("Weather data not found or API error");
      return res.json();
    })
    .then(data => {
      currentWeatherData = data;
      displayWeather(data, true);
      getForecast(lat, lon);
    })
    .catch(err => showError(err.message));
}

function getWeather() {
  const city = document.getElementById('city-input').value;
  if (!city) return showError("Please enter a city name");
  hideError();
  fetch(`/.netlify/functions/weather?city=${city}`)
    .then(res => {
      if (!res.ok) throw new Error("City not found or API error");
      return res.json();
    })
    .then(data => {
      currentWeatherData = data;
      displayWeather(data, true);
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch(err => showError(err.message));
}

function getForecast(lat, lon) {
  fetch(`/.netlify/functions/forecast?lat=${lat}&lon=${lon}`)
    .then(res => {
      if (!res.ok) throw new Error("Forecast data not found or API error");
      return res.json();
    })
    .then(displayForecast)
    .catch(err => console.error("Error fetching forecast:", err));
}

function displayForecast(data) {
  const forecastDays = document.getElementById('forecast-days');
  forecastDays.innerHTML = '';
  document.getElementById('forecast-container').classList.remove('hidden');

  const dailyForecasts = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const hour = date.getHours();
    if (!dailyForecasts[day] || Math.abs(hour - 12) < Math.abs(dailyForecasts[day].hour - 12)) {
      dailyForecasts[day] = { data: item, hour: hour };
    }
  });

  let count = 0;
  for (const day in dailyForecasts) {
    if (count++ >= 5) break;
    const forecast = dailyForecasts[day].data;
    const temp = isCelsius
      ? `${Math.round(forecast.main.temp)}°C`
      : `${Math.round((forecast.main.temp * 9) / 5 + 32)}°F`;
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <div class="forecast-day">${day}</div>
      <div class="forecast-icon">
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather icon">
      </div>
      <div class="forecast-temp">${temp}</div>
      <div>${forecast.weather[0].description}</div>`;
    forecastDays.appendChild(card);
  }
}

function getSeasonalCategory(desc) {
  const d = desc.toLowerCase();
  if (d.includes("snow") || d.includes("cold")) return "winter";
  if (d.includes("rain") || d.includes("drizzle")) return "rainy";
  if (d.includes("storm") || d.includes("thunderstorm")) return "stormy";
  if (d.includes("clear") || d.includes("sunny")) return "clear";
  if (d.includes("cloud") || d.includes("windy")) return "autumn";
  if (d.includes("hot") || d.includes("heat")) return "summer";
  return "spring";
}

function getRandomSeasonalMessage(desc) {
  const season = getSeasonalCategory(desc);
  const messages = seasonalMessages[season];
  return messages[Math.floor(Math.random() * messages.length)];
}

function setWeatherBackground(main) {
  const el = document.getElementById('weather-background');
  el.className = 'weather-image';
  const m = main.toLowerCase();
  if (m === 'clear') el.classList.add('bg-clear');
  else if (m === 'clouds') el.classList.add('bg-clouds');
  else if (['rain', 'drizzle'].includes(m)) el.classList.add('bg-rain');
  else if (m === 'snow') el.classList.add('bg-snow');
  else if (m === 'thunderstorm') el.classList.add('bg-thunderstorm');
  else if (['mist', 'fog', 'haze'].includes(m)) el.classList.add('bg-mist');
  else el.classList.add('bg-clouds');
}

function displayWeather(data, newMsg = true) {
  document.getElementById('weather-container').classList.remove('hidden');
  document.getElementById('city-name').textContent = data.name;
  const temp = isCelsius ? Math.round(data.main.temp) : Math.round((data.main.temp * 9) / 5 + 32);
  document.getElementById('temperature').textContent = `${temp}${isCelsius ? '°C' : '°F'}`;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById('weather-icon').alt = data.weather[0].description;
  setWeatherBackground(data.weather[0].main);
  if (newMsg) currentSeasonalMessage = getRandomSeasonalMessage(data.weather[0].description);
  document.getElementById('seasonal-message').textContent = currentSeasonalMessage;
}

function showError(msg) {
  const el = document.getElementById('error-message');
  el.textContent = msg;
  el.style.display = 'block';
  document.getElementById('weather-container').classList.add('hidden');
  document.getElementById('forecast-container').classList.add('hidden');
}

function hideError() {
  document.getElementById('error-message').style.display = 'none';
}
