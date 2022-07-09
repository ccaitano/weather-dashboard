//API Key/Weather URL
var weatherApiUrl = 'http://api.openweathermap.org';
var weatherApiKey = 'ec3ce11c57dd96988278b8f33d0f356b';

var searchHistory = [];
var searchInput = document.querySelector("#searchCity");
var searchInit = document.querySelector("#submitSearch");

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

function fetchCoords (search) {
    var apiUrl = `${weatherApiUrl}/geo/1.0/direct?q=${search}&appid=${weatherApiKey}`;
    console.log(apiUrl);
    fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data[0]);
      var cityData = data[0];
      var lat = cityData.lat;
      var lon = cityData.lon;
      console.log(cityData);
      console.log("Lat: " + lat + ", Lon: " + lon);

      if (!data[0]) {
        alert('Location not found');
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}