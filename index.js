const key = "4643df84c7b2c96c77f8dc5d032aaad4"

const DAYS = ["Sunday", "Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const SHORTDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

//https://www.youtube.com/watch?v=6trGQWzg2AI
//https://elastic-benz-d00394.netlify.app/
//https://github.com/asishgeorge/weather-website

//future forecast
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=hourly,minutely&appid={API key}

// open weather img
// <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">

setInterval(() => {
    let clock = document.querySelector(".time")
    let date = document.querySelector(".date")

    /* current time */
    const time = new Date()
    const hour = String(time.getHours()).padStart(2, "0")
    const minutes = String(time.getMinutes()).padStart(2, "0")

    clock.innerHTML = hour + ":"+ minutes

    /* current day */
    const day = time.getDay()
    const month = time.getMonth()
    const date_day = time.getDate()

    date.innerHTML = DAYS[day] + ", " + date_day + " " + MONTHS[month]

}, 1000);

function currentCityData(data) {
    // detailed information about current day
    let humidity = document.querySelector(".humidity")
    let pressure = document.querySelector(".pressure")
    let windSpeed = document.querySelector(".windspeed")
    let sunrise = document.querySelector(".sunrise")
    let sunset = document.querySelector(".sunset")

    humidity.innerHTML = data["main"]["humidity"] + "%"
    pressure.innerHTML = data["main"]["pressure"] + " hPa"
    windSpeed.innerHTML = data["wind"]["speed"] + " m/s"
    
    // create new time variable and passing it date in seconds 
    let time = new Date(0) // Epoch
    time.setUTCSeconds(data["sys"]["sunrise"])
    sunrise.innerHTML = String(time.getHours()).padStart(2, "0") + ":" + String(time.getMinutes()).padStart(2, "0")
    
    time = new Date(0)
    time.setUTCSeconds(data["sys"]["sunset"])
    sunset.innerHTML = String(time.getHours()).padStart(2, "0") + ":" + String(time.getMinutes()).padStart(2, "0")


    let city = document.querySelector(".city")
    //reset future-forecast content
    document.querySelector(".future-forecast").innerHTML = ""

    // create current day
    let currentDay = document.createElement('div')
    currentDay.className = "currentDay-container flex itemCenter frame"
    let img = "http://openweathermap.org/img/wn/" + data["weather"]["0"]["icon"] + "@2x.png"
    let tempC = String(Math.round(data["main"]["temp"] - 273.15)) + String(" °C")

    currentDay.innerHTML = '<img class="currentImg", src=' + img + ' , alt="weather icon">'
    + '<div class="weather">' + data["weather"]["0"]["main"]     + '</div>'
    + '<div class="desc">' + data["weather"]["0"]["description"] + '</div>'
    + '<div class="temp">' + tempC                               + '</div>'

    document.querySelector(".future-forecast").appendChild(currentDay)

    city.innerHTML = data["name"]

    return [data["coord"]["lat"], data["coord"]["lon"]]
}

function futureForecast(coord) { // add future days
    let timezone = document.querySelector(".timezone")
    let coords = document.querySelector(".coords")

    url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord[0] + "&lon=" + coord[1] + "&exclude=hourly,minutely&appid=" + key

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            timezone.innerHTML = data["timezone"] 
            coords.innerHTML = String(coord[0]) + "N " + String(coord[1]) + "E"

            for(let i = 1; i < 8; i++) {
                let currentDay = data["daily"][i]
                let date = new Date(0)
                date.setUTCSeconds(currentDay["dt"])

                let dayTempC = String(Math.round(currentDay["temp"]["day"] - 273.15)) + " °C"
                let nightTempC = String(Math.round(currentDay["temp"]["night"] - 273.15)) + " °C"

                var futureDay = document.createElement('div')
                futureDay.className = "futureDays-container flex itemCenter frame"
                futureDay.innerHTML = '<div class="day">' + SHORTDAYS[date.getDay()] + '</div>'
                + '<img class="futureImg", src="http://openweathermap.org/img/wn/' + currentDay["weather"]["0"]["icon"] + '@2x.png", alt="future img">'
                + '<div class="temp">Day - ' + dayTempC + '</div>'
                + '<div class="temp">Night - ' + nightTempC + '</div>'
            
            
                document.querySelector(".future-forecast").appendChild(futureDay)
            }
        })
    .catch(err => console.error('EXCEPTION: ', err))
}

function getData() {
    var inputValue = document.querySelector(".inputValue")

    url = "https://api.openweathermap.org/data/2.5/weather?q=" + inputValue.value + "&appid=" + key
    console.log(url)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data["cod"] !== 404) {
                console.log(data)

                futureForecast(currentCityData(data))
            }
            else {
                alert("Wrong city name!")
            }

        })
    .catch(err => console.error('EXCEPTION: ', err))
}
