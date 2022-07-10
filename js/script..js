//API Key/Weather URL
var weatherApiUrl = 'http://api.openweathermap.org';
var weatherApiKey = 'ec3ce11c57dd96988278b8f33d0f356b';

var searchHistory = [];
var searchInput = document.querySelector("#searchCity");
var searchInit = document.querySelector("#submitSearch");
var currentWeather = document.querySelector('#current-weather');
var searchHistoryEl = document.querySelector('#history');

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

$(searchInit).click(searchCity);

//Search on Button Submit
function searchCity(event) {
  if (!searchInput.value) {
    alert("Please Enter a City")
    return;
  }
  event.preventDefault();
  var search = searchInput.value.trim();
  fetchCoords(search);
  searchInput.value = '';
}

//Get Latitude and Longitude Coordinates
function fetchCoords (search) {
    var apiUrl = `${weatherApiUrl}/geo/1.0/direct?q=${search}&appid=${weatherApiKey}`;
    fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        console.log(data[0]);
        var cityData = data[0];
        var cityName = cityData.name;
        var lat = cityData.lat;
        var lon = cityData.lon;
        console.log(cityData);
        console.log("Lat: " + lat + ", Lon: " + lon);
        saveHistory(search);
        fetchWeather(cityName, lat, lon);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

//Get weather for coordinates
function fetchWeather (cityName, lat, lon) {
    var weatherUrl = `${weatherApiUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;
    console.log(weatherUrl);
    fetch(weatherUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        renderItems(cityName, data);
    })
    .catch(function (err){
        console.error(err);
    });
}

function renderItems(cityName, data) {
    console.log(cityName);
    console.log(data.current);
    console.log(data.timezone);
    renderCurrentWeather(cityName, data.current, data.timezone);
    renderForecast(data.daily, data.timezone);
}

function renderCurrentWeather(cityName, weather, timezone) {
    var date = dayjs().tz(timezone).format('MM/DD/YYYY');
    console.log(date);
    console.log(cityName);
    console.log(weather);
    
    // Store response data from our fetch request in variables
    var temp = weather.temp;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;
    var uvIndex = weather.uvi;

    var cityNameEl = document.createElement('h3');
    var tempEl = document.createElement('p');
    var weatherIcon = document.createElement('img');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvIndexEl = document.createElement('p');
    var uvBadge = document.createElement('button');

    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    uvBadge.classList.add('btn', 'btn-sm');

    if (uvIndex < 3) {
      uvBadge.classList.add('btn-success');
    } else if (uvIndex < 7) {
      uvBadge.classList.add('btn-warning');
    } else {
      uvBadge.classList.add('btn-danger');
    }
    
    cityNameEl.textContent = `Current Weather for ${cityName} (${date})`;
    tempEl.textContent = `Temperature: ${temp}°F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity}%`;
    uvIndexEl.textContent = `UV Index: `;
    uvBadge.textContent = uvIndex;
    uvIndexEl.append(uvBadge);

    currentWeather.innerHTML = "";
    currentWeather.append(cityNameEl, weatherIcon, tempEl, windEl, humidityEl, uvIndexEl);
}

function saveHistory (search) {
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);
  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  renderSearchHistory();
}

function renderSearchHistory() {
  searchHistoryEl.innerHTML = '';
  for (var i = searchHistory.length -1; i>= 0; i--) {
    var buttonItem = document.createElement('button');
    buttonItem.setAttribute('type','button');
    buttonItem.setAttribute('class', 'btn btn-outline-info btn-block');
    buttonItem.textContent = searchHistory[i];
    searchHistoryEl.append(buttonItem);
  }
}

function getSearchHistory() {
  var storedHistory = localStorage.getItem('search-history');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

function renderForecast(forecast, timezone) {

}