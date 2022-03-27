var owmAPI = "819399eab460a02c313c92f04377c94c";
var presentCity = "";
var prevCity = "";

var saveCity = (citySearched) => {
    let cityOld = false; 
    for(let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" +i] === citySearched) {
            cityOld = true;
        }
    }
        if (citySearched === false) {
            localStorage.setItem("cities" + localStorage.length, citySearched);
        }
    }


$('#search-button').on("click", (event) => {
    event.preventDefault();
    presentCity = $('#search-city').val();
    getPresentConditions(event);
    });

$('#city-results').on("click", (event) => {
    event.preventDefault();
    presentCity = $('#search-city').val();
    getPresentConditions(event);
    });

var fixErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    } return response;
}

var loadCities = () => {
    $("#city-results").empty();
    if (localStorage.length === 0) {
        if (prevCity) {
            $("#search-city").attr("value", prevCity);
        } else {
            $("#search-city").attr("value", "");
        }
    }
    else {
        let preCityResults = "cities" + (localStorage.length - 1); 
        prevCity = localStorage.getItem(preCityResults); 
        $("#search-city").attr("value", prevCity); 


        for (let i = 0; i <localStorage.length; i++) {
            let city = localStorage.getItem("cities" + i);
            let cityEl; 
            if (presentCity === "") {
                presentCity = prevCity; 
            } 
            if (city === presentCity) {
                cityEl = `<button type="button" class="active list-group-item-action">${city}</button>`;
            } else {
                cityEl = `<button type="button" class="list-group-item-action">${city}</button>`;
            }
            $("#city-results").prepend(cityEl); 
        }
    }
}

loadCities(); 

var getPresentConditions = (event) => {
    let city = $('#search-city').val();
    presentCity = $('#search-city').val();

    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + owmAPI;
    fetch(weatherURL).then(fixErrors).then((response) => {
        return response.json();
    }).then((response) => {
        saveCity(city); 
        $('#search-error').text(""); 

        let presentWeatherIcon = "http://openweathermap.org/img/w" + response.weather[0].icon + ".png";
        let presentTimeUTC = response.dt;
        let presentTimeZoneOffset = response.timezone; 
        let presentTimeZoneOffsetHours = presentTimeZoneOffset / 60 / 60;
        let presentMoment = moment.unix(presentTimeUTC).utc().utcOffset(presentTimeZoneOffsetHours);
        let presentWeatherHTML = `<h3>${response.name} ${presentMoment.format("(MM/DD/YY)")}<img src="${presentWeatherIcon}"</h3>
        
        <ul class = "list-unstyled">
            <li>Temperature ${response.main.temp}&#8457;</li>
            <li id = "uvIndex">UV Index</li>
            <li>Wind Speed ${response.wind.speed}</li>
            <li>Humidity ${response.main.humidity}</li>
        </ul> `;

        loadCities();
        getFiveForecast(event); 

        $('#present-weather').html(presentWeatherHTML);
        
        uvWeatherURL = "https://cors-anywhere.herokuapp.com" + uvWeatherURL;
        let uvWeatherURL = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + owmAPI;
        let longitude = response.coord.longitude;
        let latitude = response.coord.lat;

        fetch(uvWeatherURL).then(fixErrors).then((response) => {
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

getPresentConditions();

var getFiveForecast = (event) => {
    let city = $("#search-city").val();

    let fiveURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + owmAPI;

    fetch(fiveURL).then(fixErrors).then((response) => {
        return response.json(); 
    })
    .then((response) => {
        let fiveForecast = `<h2>Five Day Forecast</h2>
        <div id="fiveUl" class="flex-wrap d-inline-flex">`;

        for (let i = 0; i < response.list.length; i++) {
            let dailyDay = response.list[i];
            let timeZoneOffset = response.city.timezone; 
            let nowDayTimeUTC = dailyDay.dt 
            let nowMoment = moment.unix(dayTimeUTC).utcOffset(timeZoneOffsetHours); 
            let fiveIconURL = "https://openweathermap.org/img/w/" + dailyDay.weather[0].icon + ".png"; 


            if (nowMoment.format("HH:mm:ss") === "11:00:00" || 
                nowMoment.format("HH:mm:ss") === "12:00:00" || 
                nowMoment.format("HH:ss:mm") === "13:00:00") {
                    fiveForecast += `<div class="card forecast-card m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${nowMoment.format("MM/DD/YY")}</li>
                        <li class="forecast-icon"><img src="${fiveIconURL}"</li>
                        <li>Temp: ${dailyDay.main.temp}&#8457;</li>
                        <li>Humidity: ${dailyDay.main.humidity}%</li>
                    </ul>

                    </div>`;
                }


            
        }
       fiveForecast += `</div>`
       $("#five-forecast").html(fiveDayForecast)
    })

}
