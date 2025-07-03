const btn = document.getElementById('btn');
const forecastCards = document.getElementById('forecastCards');
const cityInput = document.getElementById('cityInput');
const cityLabel = btn.nextElementSibling;
const dayStatus = document.getElementById('dayStatus')
detectLocation();

btn.addEventListener('click', function () {
  const city = cityInput.value;
    getWeather(city);
});

function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
    );
  }
}

async function getWeather(city) {
  const apiKey = 'b8fc5ec9d0354f8ba3602328250207';
  const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`);
  const data = await res.json();
  renderForecast(data);
}

async function getWeatherByCoords(lat, lon) {
  const apiKey = 'b8fc5ec9d0354f8ba3602328250207';
  const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`);
  const data = await res.json();
  renderForecast(data);
}

function renderForecast(data) {
  const forecast = data.forecast.forecastday;
  const location = data.location.name;
  const localTime = data.location.localtime;
  const hour = parseInt(localTime.split(' ')[1].split(':')[0]);
  const isDaytime = hour >= 6 && hour < 18;
  const iconEmoji = isDaytime ? '☀️' : '🌙';
  const dayStatusText = isDaytime ? 'Its high noon — time to shine bright and get things done!' : 'The stars are out and the skies are calm — perfect night to unwind!!';
    dayStatus.innerHTML = `<p style="font-size: 45px;" class=" font-semibold  font-stretch-expanded rounded-full bg-gray-900/80 text-center w-auto mb-4">${dayStatusText}<p>`
    cityLabel.innerHTML = `
     <div class="py-3 px-6 rounded-full bg-gray-900/80 text-5xl mb-4">
     ${location}
     ${iconEmoji}
     </div>
    `
    ;
  

  function formatDate(dateStr) {
    var date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }

  let cards = '';
  let bg = 500

  for (let i = 0; i < forecast.length; i++) {
    const day = forecast[i];
    bg+=100
    cards += `
    
      <div class="bg-gray-${bg}/80 p-6 shadow hover:shadow-lg transition duration-300 text-center  ">
        <h2 class="text-3xl font-semibold mb-2">${formatDate(day.date)}</h2>
        
        <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="mx-auto py-11 mb-4">
        <p class="text-4xl font-bold mb-1">${day.day.avgtemp_c}°C</p>
        <p class="text-gray-300 mb-3">${day.day.condition.text}</p>
        <div class="flex justify-between text-sm text-gray-400">
          <span>Max: ${day.day.maxtemp_c}°C</span>
          <span>Min: ${day.day.mintemp_c}°C</span>
        </div>
      </div>
    `;
  }

  forecastCards.innerHTML = cards;
}
