$(document).ready(function() {

    var API_KEY    = "709eaff6487fadf0c26e0bc441b8c854";
    var nameOfCity = "";
    var latitude   = "";
    var longitude  = "";

    function getFirstWeather(lat, lon) {

        var urlQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=" 
                       + lat 
                       + "&lon=" 
                       + lon 
                       + "&exclude=minutely,hourly&appid=" 
                       + API_KEY 
                       + "&units=imperial";

        $.ajax({ url: urlQuery, method: "GET"}).then(function(weatherObj) {

            //remove the five day forcast before the next...
            $(".day-cards").empty();

            //get a weather icon...
            var weatherIcon = weatherObj.current.weather[0].icon;
            var imageIcon   = $("<img>");

            imageIcon.addClass("img-fluid");
            imageIcon.attr("src", "https://openweathermap.org/img/wn/" 
                                  + weatherIcon 
                                  + "@2x.png")

            $("#cities").append(imageIcon);

            //branching to get color for the uv index...
            var ultraVioletIndex = parseInt(weatherObj.current.uvi);

            if (ultraVioletIndex < 2) {

                $(".colors").css({"background-color": "green", "color": "white"});

            } else if (ultraVioletIndex >= 3 && ultraVioletIndex <= 5) {

                $(".colors").css({"background-color": "yellow", "color": "white"});

            } else if (ultraVioletIndex >= 6 && ultraVioletIndex <= 7) {

                $(".colors").css({"background-color": "orange", "color": "white"});

            } else if (ultraVioletIndex >= 8 && ultraVioletIndex <= 10) {

                $(".colors").css({"background-color": "red", "color": "white"});
 
            } else if (ultraVioletIndex >= 11) {

                $(".colors").css({"background-color": "violet", "color": "white"});

            }

            //fill out the id's in index.html with current weather...
            $("#temperature").text("Temp: " + weatherObj.current.temp + " F");
            $("#current-humidity").text("Humidity: " + weatherObj.current.humidity + "%");
            $("#wind-speed").text("Wind Speed: " + weatherObj.current.wind_speed + " mph");
            $(".colors").text(weatherObj.current.uvi);

            console.log("#current-city");
            //show the created html...
            $("#current-city").css({"display":"block"});

            //create an array for the daily forcasts...
            var dailyForcast = weatherObj.daily;

            //loop through dailyForcast array..
            for(i = 1; i < dailyForcast.length - 2; i++) {

                var dates        = moment.unix(dailyForcast[i].dt).format("ddd MM/DD/YYY");
                var temperatures = dailyForcast[i].temp.day;
                var humidities   = dailyForcast[i].humidity;
                var icons        = dailyForcast[i].weather[0].icon;

                var dailyForcastDivs  = $("<div class='card text-white bg-primary p-2'>");
                var paragraphTemp     = $("<p>");
                var paragraphHumidity = $("<p>");
                var iconImage         = $("<img>");
                var headingDate       = $("<h6>");

                headingDate.text(dates);
                iconImage.attr("src", "https://openweathermap.org/img/wn/" 
                                      + icons 
                                      + "@2x.png");
                iconImage.addClass("img-fluid");
                iconImage.css({"width": "100%"});
                paragraphTemp.text("Temperature " + temperatures + " F");
                paragraphHumidity.text("Humidity: " + humidities + "%");

                dailyForcastDivs.append(headingDate);
                dailyForcastDivs.append(iconImage);
                dailyForcastDivs.append(paragraphTemp);
                dailyForcastDivs.append(paragraphHumidity);

                $(".day-cards").append(dailyForcastDivs);
                $("#five-day-cards").css({"display":"block"});

            }    

        })

    }

    //makes api call with users input...
    function getTheWeather() {

        var weatherQuery = "https://api.openweathermap.org/data/2.5/weather?q=" 
                           + nameOfCity 
                           + "&lang=en&appid=" 
                           + API_KEY;

        $.ajax({url: weatherQuery, method: "GET"}).then(function (weatherObj) {

            latitude = weatherObj.coord.lat;
            longitude = weatherObj.coord.lon;

            $("#cites").text(weatherObj.name);
            $("#current-date").text(moment.unix(weatherObj.dt).format("dddd, MM/DD/YYYY"));
                        
            localStorage.setItem("nameOfCity", weatherObj.name);
            
            getFirstWeather(latitude,longitude);

        })

    }

    //gets last stored city...
    function initialize() {

        nameOfCity = localStorage.getItem("nameOfCity");
        
        if (nameOfCity !== null) {

            var listOfCites = $("<button>");
        
            listOfCites.addClass("list-group-item list-group-item-action");
            listOfCites.text(nameOfCity);
        
            $("ul").prepend(listOfCites);
            getTheWeather()
        
        }

    }

    function searchBtn() {
        
        nameOfCity = $("input").val().trim();

        var listOfCites = $("<button>");
        
        listOfCites.addClass("list-group-item list-group-item-action");
        listOfCites.text(nameOfCity);

        $("ul").prepend(listOfCites);
        $("input").val("");

        getTheWeather();
    
    }

    initialize();

    //create event from user input...
    $("#enter-city-form").submit(function (event) {
    
        event.preventDefault();
        searchBtn();
    
    })

    $("#submit-form").click(function (event) {
        
        event.preventDefault();
        searchBtn();
    
    })

    //allows user to click on previous searches...
    $("ul").on("click", "button", function() {
    
        nameOfCity = $(this).text();
        console.log(nameOfCity);

        getTheWeather();

    })
    
})