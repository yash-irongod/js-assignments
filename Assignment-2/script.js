const API_KEY = '7cd6ab4caf5042d3d939c9b23b1d1d5c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('weatherForm');
  const cityInput = document.getElementById('cityInput');
  const weatherResult = document.getElementById('weatherResult');
  const historyList = document.getElementById('historyList');
  const eventLog = document.getElementById('eventLog');

  // ===== Console Log Helper (UI + DevTools)
  function log(message, type = 'sync') {
    console.log(message);

    const line = document.createElement('div');
    line.classList.add('log-line');

    if (type === 'async') line.classList.add('log-async');
    else if (type === 'error') line.classList.add('log-error');
    else line.classList.add('log-sync');

    line.textContent = message;
    eventLog.appendChild(line);
    eventLog.scrollTop = eventLog.scrollHeight;
  }

  // ===== Render Weather UI
  function renderWeather(data) {
    weatherResult.innerHTML = `
      <div>
        <p class="weather-title">${data.name}, ${data.sys.country}</p>
        <div class="weather-row">🌡 Temp: ${data.main.temp.toFixed(1)} °C</div>
        <div class="weather-row">☁ Weather: <span class="pill">${data.weather[0].main}</span></div>
        <div class="weather-row">💧 Humidity: ${data.main.humidity}%</div>
        <div class="weather-row">🌬 Wind: ${data.wind.speed} m/s</div>
      </div>
    `;
  }

  // ===== Save Search History
  function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    if (!history.includes(city)) {
      history.push(city);
      localStorage.setItem('weatherHistory', JSON.stringify(history));
    }

    renderHistory();
  }

  function renderHistory() {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    historyList.innerHTML = '';

    history.forEach(city => {
      const item = document.createElement('div');
      item.classList.add('history-item');
      item.textContent = city;
      item.addEventListener('click', () => fetchWeather(city));
      historyList.appendChild(item);
    });
  }

  // ===== Fetch Weather
  async function fetchWeather(city) {

    if (!city.trim()) {
      alert("Please type a city name and press Search");
      return;
    }

    // clear console area for fresh run
    eventLog.innerHTML = '';

    // ---- simplified log sequence requested ----
    log("Sync Start", "sync");

    // schedule microtask and macrotask (they will run after the current synchronous code finishes)
    Promise.resolve().then(() =>
      log("Promise.then (Microtask)", "async")
    );

    setTimeout(() =>
      log("setTimeout (Macrotask)", "async")
    , 0);

    // mark end of synchronous portion
    log("Sync End", "sync");
    // -------------------------------------------

    try {
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      renderWeather(data);
      saveHistory(city);

    } catch (error) {
      log("Error: " + (error.message || error), "error");
      weatherResult.innerHTML =
        `<p style="color:red;">City not found or network error</p>`;
    }
  }

  // Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    fetchWeather(city);
  });

  // Load History on Page Load
  renderHistory();

});