var searchBar = $("#searchBar");
var city = "";
var forecastURL = "";
var currentURL = "";
var submitButton = $("#submitButton")
var country = "us";
var forecastFive = $("#forecastFive");
var cityList;
var functionCalled = false;

function getCities() {
    if (localStorage.getItem("cityList")) {
        cityList = JSON.parse(localStorage.getItem("cityList"))
        var lastCity = cityList[cityList.length-1].name;
        forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + lastCity +","+ country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
        currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + lastCity +","+ country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
        callWeather();
        callForecast();
    }
    else {
        cityList = [];
        city = "westland";
        forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city +","+ country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
        currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city +","+ country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
        callWeather();
        callForecast();
    }

    for (var i = 0; i < cityList.length; i++) {
        var citiesDiv = $("#citiesDev");
        var cityButton = $("<button>").attr("data-value",cityList[i].name).text(cityList[i].name.charAt(0).toUpperCase() + cityList[i].name.slice(1));
        cityButton.attr("class","btn-primary cityButton").css("width", "100%").css("padding", "5px");
        citiesDiv.prepend(cityButton);
    }
    $(".cityButton").on("click", function () {
        city = $(this).text();
        forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
        currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
        callWeather();
        callForecast();
    });
}

getCities();

function storeCity() {
    var citiesDiv = $("#citiesDiv");
    var cityButton = $("<button>").text(city.charAt(0).toUpperCase() + city.slice(1));
    cityButton.attr("class", "btn-primary cityButton").attr("data-value", city).css("width", "100%").css("padding", "5px");
    citiesDiv.prepend(cityButton);
    var cityButtons = { name: city };
    cityList.push(cityButtons);
    localStorage.setItem("cityList", JSON.stringify(cityList));
    cityButton.on("click", function () {
        city = $(this).data("value");
        forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
        currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
        callWeather();
        callForecast();
    })
}

function callWeather() {
    $.ajax({
        url: currentURL,
        method: "GET"
    })
        .then(function (response) {
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
            var tempContainer = $("#tempContainer");
            tempContainer.empty();
            var humidContainer = $("#humidContainer");
            humidContainer.empty();
            var windContainer = $("#windContainer");
            windContainer.empty();
            var weatherTodayTitle = $("#weatherTodayTitle");
            weatherTodayTitle.empty();
            var iconVar = response.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + iconVar + "@2x.png";
            var date = moment().format("(l)");
            var temp = response.main.temp.toFixed(0);
            var humid = response.main.humidity;
            var wind = response.wind.speed.toFixed(0);
            var iconEl = $("<img>");
            iconEl.attr("src", iconURL);
            iconEl.attr("class", "todayIcon");
            if (city.length < 1) {
                var todayEl = $("<h2>").text(cityList[cityList.length - 1].name.charAt(0).toUpperCase() + cityList[cityList.length -1].name.slice(1) + " " + date);
            }
            else {
                var todayEl = $("<h2>").text(city.charAt(0).toUpperCase() + city.slice(1) + " " + date);
            }
            todayEl.attr("class", "todayDate");
            todayEl.css("margin-left", "10px")
            var tempEl = $("<h3>").text("Temp: " + temp + "° F");
            var humidEl = $("<h3>").text("Humidity: " + humid + "%");
            var windEl = $("<h3>").text("Wind: " + wind + " MPH");
            weatherTodayTitle.prepend(todayEl);
            weatherTodayTitle.prepend(iconEl);
            tempContainer.append(tempEl);
            humidContainer.append(humidEl);
            windContainer.append(windEl);
            $.ajax({
                url: uvURL,
                method: "GET"
            })
                .then(function (response) {
                    var uvContainer = $("#uvContainer");
                    uvContainer.empty();
                    var uvVal = response[0].value;
                    var uvEl = $("<h3>").text("UV Index:");
                    uvEl.attr("id", "uvText");
                    var uvEle = $("<h3>").text(" " + uvVal);
                    uvEle.attr("id", "uvVal");
                    uvContainer.append(uvEl);
                    uvContainer.append(uvEle);
                    uvEle.css("padding", "5px")
                    uvEle.css("border", "1px solid #ccc")
                    uvEle.css("border-radius", "10px");
                    if (uvVal <= 2.5) {
                        uvEle.css("background", "green");
                    }
                    else if (uvVal > 2.5 && uvVal <= 5) {
                        uvEle.css("background", "yellow");
                    }
                    else if (uvVal > 5 && uvVal <= 7.5) {
                        uvEle.css("background", "orange");
                    }
                    else if (uvVal > 7.5) {
                        uvEle.css("background", "red");
                    }
                })
        });
}

function callForecast() {
    $.ajax({
        url: forecastURL,
        method: "GET"
    })
        .then(function (response) {
            forecastFive.empty();
            for (var i = 0; i < 5; i++) {
                var ff = $("<div>");
                ff.attr("class", "ffDiv" + [i])
                var date = response.list[((8 * [i]) + 6)].dt_txt;
                var dateObj = new Date(date)
                // addin one to month as months are zero based 
                var datestring = (dateObj.getMonth()+1) + "/" + dateObj.getUTCDate() + "/" + dateObj.getFullYear();
                var iconVar = response.list[((8 * [i]) + 6)].weather[0].icon;
                var iconURL = "https://openweathermap.org/img/wn/" + iconVar + "@2x.png";
                var temp = response.list[((8 * [i]) + 6)].main.temp.toFixed(0);
                var humid = response.list[((8 * [i]) + 6)].main.humidity;
                var wind = response.list[((8 * [i]) + 6)].wind.speed.toFixed(0);
                var dateEl = $("<h3>").text(datestring);
                dateEl.attr("class", "ffDate");
                var iconEl = $("<img>");
                iconEl.attr("src", iconURL);
                iconEl.attr("class", "ffIcon");
                var tempEl = $("<h4>").text("Temp: " + temp + "° F");
                var hrEl = $("<hr>");
                var humidEl = $("<h5>").text("Humidity: " + humid + "%");
                var windEl = $("<h5>").text("Wind: " + wind + " MPH");
                ff.append(dateEl);
                ff.append(iconEl);
                ff.append(tempEl);
                ff.append(hrEl);
                ff.append(humidEl);
                ff.append(windEl);
                forecastFive.append(ff);
                functionCalled = true;
            }
        });
}

submitButton.on("click", function (event) {
    event.preventDefault();
    city = searchBar.val();
    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";
    currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&units=imperial&apikey=f89ea9ded1a88cd5cd181e541e1e99c8";

    callWeather();
    callForecast();
    storeCity();
});