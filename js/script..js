//API Key/Weather URL
var weatherApiUrl = 'https://api.openweather.org';
var weatherApiKey = '0979d192ba8851a6b001c074db066730';

var searchHistory = [];
var searchInput = document.querySelector("#searchCity");
var searchInit = document.querySelector("#submitSearch");

$(searchInit).click(searchCity);


//Search on Button Submit
function searchCity(event) {
  if (!searchInput.value) {
    return;
  }
  event.preventDefault();
  var search = searchInput.value.trim();
  console.log(search);
//   fetchCoords(search);
  searchInput.value = '';
}

