const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { city, lat, lon } = event.queryStringParameters;
  const apiKey = process.env.WEATHER_API_KEY;

  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query parameters" })
    };
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch weather data" })
    };
  }
};
