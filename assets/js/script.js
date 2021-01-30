var userInput;
function searchWeather() {
    //view current weather of the city that is being search
    var apiKey = 'e50b9aed1555e96f05002b5a49fc36ee'
    userInput = $("#cityInput").val().trim();
    queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        console.log(currentWeather);

        //temperature, humidity, wind speed, city name and current time
        var tempF = response.main.temp;
        var tempF = Math.floor((tempF - 273.15) * 1.8 + 32);
        var cityHumidity = response.main.humidity;
        var cityWindspeed = response.wind.speed;
        var cityName = response.name;
        var icon = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
        // var currentDate =  moment().format("MMM Do YY");
        //adding items to the page

        var cityandTime = $("<h3>").html(cityName);
        var cityTempature = $("<h3>").html("Temperature: " + tempF.toFixed(2) + " &#8457");
        var Humidity = $("<h3>").html("Humidity: " + cityHumidity);
        var Windspeed = $("<h3>").html("Windspeed: " + cityWindspeed);
        var weather = $("#currentWeather").append("<div>");
        $("#currentWeather").append(cityandTime);
        $("#currentWeather").append($("<img>").attr("src", iconURL));
        $("#currentWeather").append(cityTempature);
        $("#currentWeather").append(Humidity);
        $("#currentWeather").append(Windspeed);
        //testing for temperature, humidity and wind speed
        console.log("Temperature (F): " + tempF.toFixed(2));
        console.log("Humidity: " + response.main.humidity);
        console.log("Wind Speed: " + response.wind.speed);

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvIndex = "https://api.openweathermap.org/data/2.5/uvi?appid=642f9e3429c58101eb516d1634bdaa4b&lat=" + lat + "&lon=" + lon ;
        $.ajax({
            url: uvIndex,
            method: "GET"
        }).then(function (response) {
            //testing for UV, latitude and longitude values
            console.log(lat);
            console.log(lon);
            console.log(response);
            console.log(response.value);
            var UVindex = response.value;
            var UTag = $("<h3>").html("UV Index: " + UVindex);
            $("#currentWeather").append(UTag);
            UTag.addClass("index");
            //if the uv is 2 or less it is highlight as green
            //if the uv is between 2 and 5 it is highlight as yellow
            //if the uv is great than 5 it is highlight as red
            if (response.value <= 2) {
                $(".index").css("color", "#82E0AA");
                $("#currentWeather").append($("<h3>").html("Favorable"));
            };
            if (response.value > 2 && response.value <= 5) {
                $(".index").css("color", "#ffff00");
                $("#currentWeather").append($("<h3>").html("Moderate"));
            };
            if (response.value > 5) {
                $(".index").css("color", "#B22222");
                $("#currentWeather").append($("<h3>").html("Severe"));
            };
        })
    })
}

$("#searchButton").on("click", function (event) {
    event.preventDefault();
    searchWeather();
});


