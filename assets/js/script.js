var userInput;
function searchWeather() {
    //view current weather of the city that is being search
    var apiKey = 'f4984700ddd88edc79d0eb1beb636dff'
    userInput = $("#cityInput").val().trim();
    queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        //temperature, humidity, wind speed, city name and current time
        var tempF = response.main.temp;
        var tempF = Math.floor((tempF - 273.15) * 1.8 + 32);
        var cityHumidity = response.main.humidity;
        var cityWindspeed = response.wind.speed;
        var cityName = response.name;
        var icon = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
        var currentDate =  moment().format("MMM Do YYYY");
        //adding items to the page
        var currentWeather =  
        `<div class="card" style="width: 25rem;">
        <ul class="list-group list-group-flush">
        <li class="list-group-item">${currentDate}</li>
        <li class="list-group-item">${cityName}<img src=https://openweathermap.org/img/wn/${icon}@2x.png alt="icon" width="60" height="60" /></li>
        <li class="list-group-item">Temperature: ${tempF.toFixed(2)}&#8457</li>
        <li class="list-group-item">Humidity: ${cityHumidity}%</li>
        <li class="list-group-item">Wind Speed: ${cityWindspeed} mph</li>
        </div>`
        $("#currentWeather").append(currentWeather);
        console.log("Temperature (F): " + tempF.toFixed(2));
        console.log("Humidity: " + response.main.humidity);
        console.log("Wind Speed: " + response.wind.speed);

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        //UV api
        var uvIndex = "https://api.openweathermap.org/data/2.5/uvi?appid=642f9e3429c58101eb516d1634bdaa4b&lat=" + lat + "&lon=" + lon;
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
        fiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${apiKey}`;
        $.ajax({
            url: fiveDay,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (var i = 0; i < 5; i++) {
                console.log(response.list[i].main.humidity);
                var weatherCard = $("<div>").attr("class", "p-3 mb-2 bg-primary text-white");
                $("#forecast").append(weatherCard);
                // uses moment for the date
                var myDate = new Date(response.list[i * 8].dt * 1000);
                weatherCard.append($("<h4>").html(myDate.toLocaleDateString()));
                //variable to hold the weather icon
                var iconCode = response.list[i].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                // displays the icon
                weatherCard.append($("<img>").attr("src", iconURL));
                // converts K and removes decimals using Math.round
                var tempF = Math.floor((response.list[i].main.temp - 273.15) * 1.80 + 32);
                // displays the temperature in F
                weatherCard.append($("<h3>").html("Temp: " + tempF + " &#8457"));
                // displays the humidity
                var humidity = response.list[i].main.humidity;
                weatherCard.append($("<h3>").html("Humidity: " + humidity));
            }
        })
    })
}

function saveHistory(){
    //The city that is being search is going to be save in the local history
    var saveCity = JSON.parse(localStorage.getItem("City")) || [];
    var value = $("#cityInput").val();
    saveCity.push(value);
    localStorage.setItem("City", JSON.stringify(saveCity));
    //displaying the history on the search 
    var displayCity = document.querySelector("#searches")
    var getCity = JSON.parse(window.localStorage.getItem("City")) || [];
    getCity.sort(function(a, b) {
      return b.movie - a.movie;
    });
    getCity.forEach(function (movie) {
    var listItem = document.createElement("li");
    listItem.textContent = movie;
    displayCity.appendChild(listItem);
    });
}
//clear history 
function clearHistory(){
    window.localStorage.removeItem("City");
    window.location.reload();
}
$("#searchButton").on("click", function (event) {
    event.preventDefault();
    searchWeather();
    saveHistory();
});
//When the clear button is click the history will be clear
$("#clear").on("click", function (event) {
    console.log(event.target);
    clearHistory();
});