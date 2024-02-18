const apiKey = "831c242093b63e707ef8720479575360"; 

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.main.temp;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon");
  

  temperatureElement.innerHTML = Math.round(temperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}m/s`;
  timeElement.innerHTML = formatDate(date);
  iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png" class="weather-app-icon" />`;

  getForecast(response.data.coord.lat, response.data.coord.lon);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(lat, lon) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.list.forEach(function (forecast, index) {
    if (index % 8 === 0) { // Get data for every 24 hours (8 data points per day)
      forecastHtml +=
        `
          <div class="weather-forecast-day">
            <div class="weather-forecast-date">${formatDay(forecast.dt)}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" class="weather-forecast-icon"/>
            <div class="weather-forecast-temperatures">
              <div class="weather-forecast-temperature">
                <strong>${Math.round(forecast.main.temp_max)}º</strong>
              </div>
              <div class="weather-forecast-temperature">${Math.round(forecast.main.temp_min)}º</div>
            </div>
          </div>
        `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}



let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Addis Ababa"); // Set default city
