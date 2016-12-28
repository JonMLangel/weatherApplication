$(document).ready(function() {
  var api = 'https://api.openweathermap.org/data/2.5/weather';
  var APIKEY = '16247bbb6def9eb1bbaf3f7fa3bcbab6';
  var unit = '&units=imperial';


	var latitude = undefined;
	var longitude = undefined;
	var address = undefined;
	var init = true;
	//var unit = 'c';

	var getWeather = function() {
		address = undefined;
		return $.ajax({
			url: 'https://api.openweathermap.org/data/2.5/weather',
			data: {
				'appid': '16247bbb6def9eb1bbaf3f7fa3bcbab6',
				'lat': latitude,
				'lon': longitude,
				'units': 'imperial'
			},
			dataType: 'json',
		})
	};

	var getWeatherByAddress = function() {
		address = $('.address').val();
		return $.ajax({
			url: 'https://api.openweathermap.org/data/2.5/weather',
			data: {
				'appid': '16247bbb6def9eb1bbaf3f7fa3bcbab6',
				'q': address,
				'units': 'metric'
			},
			dataType: 'json',
		})
	};

	var setWeather = function(data) {
		if (data.cod == 200) {
			var temperature = Math.round(data.main.temp);
			if (unit == 'f') {
				temperature = Math.round(temperature * 9 / 5 + 32);
				$('.unit').text('F');
				$('.temperature').text(temperature);
			} else {
				$('.unit').text('C');
				$('.temperature').text(temperature);
			}
			currentIcon = "owf-" + data.weather[0].id;
			console.log(currentIcon);
			$('#current-icon').addClass(currentIcon);
			$('.city').text(data.name + ", ");
			$('.country').text(data.sys.country);
			$('.weatherDetail').text(data.weather[0].description);
			$('.humidity').text(data.main.humidity);
			$('.cloud').text(data.clouds.all);
			$('.wind').text(data.wind.speed);
			$('.unitChange').prop('disabled', false);
		} else if (data.cod == 404) {
			alert("Location not found! Refine search or try again.");
			$('.unitChange').prop('disabled', true);
		}
	};

	var storeLocation = function(position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		if(init) {
			init = false;
			$('.locate').trigger('click');
		}
	};

	var errorHandler = function(err) {
		if (err.code == 1) {
			alert("Error: Location Access Denied!");
		} else if (err.code == 2) {
			alert("Error: Location is Unavailable!");
		}
	};

	var getLocation = function() {
		if (navigator.geolocation) {
			var options = {
				timeout: 60000
			};
			navigator.geolocation.getCurrentPosition(storeLocation, errorHandler, options);
		} else {
			alert("Sorry, your browser does not support geolocation!");
		}
	};

	$('.unitChange').on('change', function() {
		var status = $(this).prop('checked');
		if (status) {
			unit = 'f';
			if (address != undefined) {
				getWeatherByAddress().done(setWeather);
			} else {
				getWeather().done(setWeather);
			}
		} else {
			unit = 'c';
			if (address != undefined) {
				getWeatherByAddress().done(setWeather);
			} else {
				getWeather().done(setWeather);
			}
		}
	});

	$('.addForm').on('submit', function(e) {
		e.preventDefault();
		var searchBtn = $('.search');
		var searchInput = $('.address');
		searchBtn.prop('disabled', true);
		searchInput.prop('disabled', true);
		if (searchInput.val() != "") {
			getWeatherByAddress().done(function(data) {
				setWeather(data);
				searchBtn.prop('disabled', false);
				searchInput.prop('disabled', false);
			});
		} else {
			searchBtn.prop('disabled', false);
			searchInput.prop('disabled', false);
			alert('Address cannot be blank!');
		}
	});

	$('.locate').trigger('click');

});




function setup() {

  var button = select('#submit');
  button.mousePressed(userLocation);

  var input = select('#city');
}
  function userLocation() {
  var url = api + input.value() + APIKEY + units;
  loadJSON(url, gotdata);
}
function gotData(data) {
  weather = data;
}
function showData() {
  var temp = weather.main.temp;
  var humidity = weather.main.humidity;
  $('#temp').html(temp);
  $(this).removeClass();
}
