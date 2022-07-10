//API Key/Weather URL
var weatherApiUrl = 'http://api.openweathermap.org';
var weatherApiKey = 'ec3ce11c57dd96988278b8f33d0f356b';

var searchHistory = [];
var searchInput = document.querySelector("#searchCity");
var searchInit = document.querySelector("#submitSearch");

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
        // appendToHistory(search);
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
    // renderForecast(data.daily, data.timezone);
}

function renderCurrentWeather(cityName, weather, timezone) {
    var date = dayjs().tz(timezone).format('MM/DD/YYYY');
    console.log(date);
    console.log(cityName);
    console.log(weather);
    
    // Store response data from our fetch request in variables
   
}