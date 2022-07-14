//API Key/Weather URL
var weatherApiUrl = 'http://api.openweathermap.org';
var weatherApiKey = 'ec3ce11c57dd96988278b8f33d0f356b';

var storedHistory = [];
var searchInput = document.querySelector("#searchCity");
var searchInit = document.querySelector("#submitSearch");
var clearSearch = document.querySelector("#clearSearch");
var currentWeather = document.querySelector('#current-weather');
var searchHistoryEl = document.querySelector('#history');
var forecastWeatherEl = document.querySelector('#forecast-weather');

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

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
        var cityData = data[0];
        var cityName = cityData.name;
        var lat = cityData.lat;
        var lon = cityData.lon;
        var cityCountry = cityData.country;
        saveHistory(search);
        fetchWeather(cityName, cityCountry, lat, lon);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

//Get weather for coordinates
function fetchWeather (cityName, cityCountry, lat, lon) {
    var weatherUrl = `${weatherApiUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;
    fetch(weatherUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        renderItems(cityName, cityCountry, data);
    })
    .catch(function (err){
        console.error(err);
    });
}

//Calls Current Weather and Five-Day Forecast Weather functions
function renderItems(cityName, cityCountry, data) {
    renderCurrentWeather(cityName, cityCountry, data.current, data.timezone);
    renderForecast(data.daily, data.timezone);
}

//Creates current weather card
function renderCurrentWeather(cityName, cityCountry, weather, timezone) {
    var date = dayjs().tz(timezone).format('MM/DD/YYYY');
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

    //Creates weather icons and UV index badge
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
    
    //Creates card content
    cityNameEl.textContent = `Current Weather for ${cityName}, ${cityCountry} (${date})`;
    tempEl.textContent = `Temperature: ${temp}°F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity}%`;
    uvIndexEl.textContent = `UV Index: `;
    uvBadge.textContent = uvIndex;
    uvIndexEl.append(uvBadge);

    //Append information to page
    currentWeather.innerHTML = "";
    currentWeather.append(cityNameEl, weatherIcon, tempEl, windEl, humidityEl, uvIndexEl);
}

//Saves searched city to stored history in local storage
function saveHistory (search) {
  if (storedHistory.indexOf(search) !== -1) {
    return;
  }
  storedHistory.push(search);
  localStorage.setItem('search-history', JSON.stringify(storedHistory));
  renderSearchHistory();
}

//Creates buttons for each recently searched city
function renderSearchHistory() {
  searchHistoryEl.innerHTML = '';
  for (var i = storedHistory.length -1; i>= 0; i--) {
    var buttonItem = document.createElement('button');
    buttonItem.setAttribute('type','button');
    buttonItem.setAttribute('class', 'btn btn-outline-info btn-block btn-history');
    buttonItem.setAttribute('data-search', storedHistory[i]);
    buttonItem.textContent = storedHistory[i];
    searchHistoryEl.append(buttonItem);
  }
}

//Retrieves recently searched cities from local storage
function getSearchHistory() {
  var storedHistory = localStorage.getItem('search-history');
  if (storedHistory) {
    storedHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

//Get five day forecast
function renderForecast(forecast, timezone) {
  var startDate = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
  var endDate = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

  var forecastHeaderEl = document.createElement('h3');
  forecastHeaderEl.setAttribute('class', 'col-12');
  forecastWeatherEl.innerHTML='';
  forecastHeaderEl.textContent = '5-Day Forecast';
  forecastWeatherEl.append(forecastHeaderEl);

  for (var i = 0; i < forecast.length; i++) {
    if (forecast[i].dt >= startDate && forecast[i].dt < endDate) {
      renderForecastCard(forecast[i], timezone);
    }
  }
}

//Create forecast cards for each day
function renderForecastCard(forecast, timezone) {
  var date = forecast.dt;
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var tempF = forecast.temp.day;
  var { humidity } = forecast;
  var windMph = forecast.wind_speed;
  
  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');


  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.setAttribute('class', 'col-md no-gutters forecast-card');
  card.setAttribute('class', 'card bg-primary h-100 text-white');
  cardBody.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text')

  cardTitle.textContent = dayjs.unix(date).tz(timezone).format('MM/DD/YYYY');
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  forecastWeatherEl.append(col);

}

//Recalls and displays weather data for recently searched cities
function searchPrevious(event) {
  if (!event.target.matches('.btn-history')) {
    return;
  }
  var btn = event.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}

//Clears recently searched cities
function clearSearchHistory(event) {
  event.preventDefault();
  storedHistory = localStorage.getItem('search-history');
  storedHistory = [];
  localStorage.setItem('search-history', JSON.stringify(storedHistory));
  searchHistoryEl.innerHTML="";
  currentWeather.innerHTML="";
  forecastWeatherEl.innerHTML="";
  return;
}


getSearchHistory();

searchInit.addEventListener('click', searchCity);
searchHistoryEl.addEventListener('click', searchPrevious);
clearSearch.addEventListener('click', clearSearchHistory);