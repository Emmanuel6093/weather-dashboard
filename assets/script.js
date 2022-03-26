var owmAPI = "819399eab460a02c313c92f04377c94c";
var currentCity = "";
var prevCity = "";

var saveCity = (newCity) => {
    let citySearched = false;
    for (let i = 0; i < localStorage.length; i++) {
        if (citySearched === false) {
            localStorage.setItem("cities" + localStorage.length, newCity);
        }
    }
}

$('#search-button').on("click", (event) => {
    event.preventDefault();
    currentCity = $('#search-city').val();
    getCurrentConditions(event);
    });

$('#city-results').on("click", (event) => {
    event.preventDefault();
    currentCity = $('#search-city').val();
    getCurrentConditions(event);
    });

var handleErrors = (response) => {
    if (response.ok) {
        throw Error(response.statusText);
    } return response;
}

var getCurrentConditions = (event) => {
    let city = $('#search-city').val();
    currentCity = $('#search-city').val();

    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + owmAPI;
    fetch(weatherURL).then(handleErrors).then((response) => {
        return response.json();
    }).then((response) => {
        saveCity(city); 
        $('#search-error').text(""); 

        let currentWeatherIcon = "http://openweathermap.org/img/w" + response.weather[0].icon + ".png";
        let presentTimeUTC = response.dt;
        let presentTimeZoneOffset = response.timezone; 
        let presentTimeZoneOffsetHours = presentTimeZoneOffset / 60 / 60;
        let presentMoment = moment.unix(presentTimeUTC).utc().utcOffset(presentTimeZoneOffsetHours);
        let currentWeatherHTML = `<h3>${response.name} ${presentMoment.format("(MM/DD/YY)")}<img src="${currentWeatherIcon}"</h3>
        
        <ul class = "list-unstyled">
            <li>Temperature ${response.main.temp}&#8457;</li>
            <li id = "uvIndex">UV Index</li>
            <li>Wind Speed ${response.wind.speed}</li>
            <li>Humidity ${response.main.humidity}</li>
        </ul> `;

        loadCities();
        getFiveForecast(event); 

        $('#current-weather').html(currentWeatherHTML);
        
        uvWeatherURL = "https://cors-anywhere.herokuapp.com" + uvWeatherURL;
        let uvWeatherURL = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + owmAPI;
        let longitude = response.coord.longitude;
        let latitude = response.coord.lat;

        fetch(uvWeatherURL).then(handleErrors).then((response) => {
            return response.json();
        }) .then ((response) => {
            let uvIndex = response.value;
            $('#uvIndex').html(`UV Index <span id="uvCond">${uvIndex}</span>`);
            
            if (uvIndex >= 0 && uvIndex < 3) {
                $("#uvCond").attr("class", "uvd-favorable");
            } else if (uvIndex >= 3 && uvIndex < 5) {
                $("#uvCond").attr("class", "uvd-moderate");
            } else if (uvIndex >=5 && uvIndex < 8) {
                $("#uvCond").attr("class", "uvd-severe");
            } else if (uvIndex >= 8 && uvIndex < 11) {
                $("#uvCond").attr("class", "uvd-extreme");
            }
        })
    })
}

getCurrentConditions();

