
// WEATHER APP
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "ff0f420e51db90572b4d8344650e212a";
// City list array
const cities = [
    // Bangladesh
    "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barishal", 
    "Rangpur", "Mymensingh", "Comilla", "Narayanganj", "Gazipur", 
    "Cox's Bazar", "Feni", "Chandpur", "Noakhali", "Panchagarh", 
    "Kurigram", "Tetulia",
    
    // India
    "New Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", 
    "Ahmedabad", "Pune", "Jaipur", "Lucknow", "Siliguri",
    
    // Pakistan
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
    
    // USA
    "New York", "Los Angeles", "Chicago", "Houston", "Miami", 
    "San Francisco", "Seattle", "Boston", "Las Vegas",
    
    // Europe
    "London", "Paris", "Berlin", "Rome", "Madrid", "Amsterdam", 
    "Vienna", "Athens", "Barcelona",
    
    // Middle East
    "Dubai", "Abu Dhabi", "Doha", "Riyadh", "Istanbul",
    
    // Asia Pacific
    "Tokyo", "Beijing", "Shanghai", "Hong Kong", "Singapore", 
    "Bangkok", "Kuala Lumpur", "Jakarta", "Manila", "Seoul",
    
    // Australia
    "Sydney", "Melbourne", "Brisbane", "Perth",
    
    // Africa
    "Cairo", "Johannesburg", "Lagos", "Nairobi"
];
// Populate datalist
const datalist = document.getElementById("city");
cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    datalist.appendChild(option);
});
let currentWeatherData = null;
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if(city){
        try{
            const weatherData = await getWeatherData(city);
            currentWeatherData = weatherData;
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city");
    }
});
async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if(!response.ok){
        throw new Error(`Could not fetch weather data of ${city}`);
    }
    return await response.json();
}
function displayWeatherInfo(data){
    const {name: city, 
           main: {temp, feels_like}, 
           weather: [{description, id}],
           wind: {speed},
           coord: {lat, lon},
           dt} = data;
    // Get current real time
    const currentTime = new Date(dt * 1000);
    const timeString = currentTime.toLocaleString();
    card.textContent = "";
    card.style.display = "flex";
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const feelsLikeDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const windDisplay = document.createElement("p");
    const timeDisplay = document.createElement("p");
    const buttonContainer = document.createElement("div");
    const googleMapBtn = document.createElement("button");
    const detailsBtn = document.createElement("button");
    cityDisplay.textContent = city;
    tempDisplay.textContent = `Temperature: ${(temp - 273.15).toFixed(1)}°C`;
    feelsLikeDisplay.textContent = `Feels Like: ${(feels_like - 273.15).toFixed(1)}°C`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);
    windDisplay.textContent = `Wind Speed: ${speed} m/s`;
    timeDisplay.textContent = `Last Updated: ${timeString}`;
    googleMapBtn.textContent = "Open in Google Maps";
    googleMapBtn.type = "button";
    googleMapBtn.classList.add("mapButton");
    googleMapBtn.onclick = () => {
        window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
    };
    detailsBtn.textContent = "View Full Details";
    detailsBtn.type = "button";
    detailsBtn.classList.add("detailsButton");
    detailsBtn.onclick = () => {
        showFullDetails(data);
    };
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "15px";
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    feelsLikeDisplay.classList.add("feelsLikeDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");
    windDisplay.classList.add("windDisplay");
    timeDisplay.classList.add("timeDisplay");
    card.appendChild(cityDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(tempDisplay);
    card.appendChild(feelsLikeDisplay);
    card.appendChild(descDisplay);
    card.appendChild(windDisplay);
    card.appendChild(timeDisplay);
    buttonContainer.appendChild(googleMapBtn);
    buttonContainer.appendChild(detailsBtn);
    card.appendChild(buttonContainer);
}
function showFullDetails(data) {
    const {
        name: city,
        main: {temp, feels_like, humidity, pressure, temp_min, temp_max},
        weather: [{description, main: weatherMain}],
        wind: {speed, deg},
        clouds: {all: cloudiness},
        coord: {lat, lon},
        sys: {country, sunrise, sunset},
        visibility,
        timezone,
        dt
    } = data;
    card.textContent = "";
    card.style.display = "flex";
    const title = document.createElement("h2");
    title.textContent = `Full Weather Details - ${city}, ${country}`;
    title.classList.add("detailsTitle");
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "← Back";
    closeBtn.type = "button";
    closeBtn.onclick = () => displayWeatherInfo(currentWeatherData);
    closeBtn.style.marginBottom = "15px";
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("detailsContainer");
    const details = [
        { label: "Location", value: `${city}, ${country}` },
        { label: "Coordinates", value: `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E` },
        { label: "Current Time", value: new Date(dt * 1000).toLocaleString() },
        { label: "Timezone", value: `UTC${timezone >= 0 ? '+' : ''}${(timezone / 3600).toFixed(0)}` },
        { label: "Weather", value: `${weatherMain} - ${description}` },
        { label: "Temperature", value: `${(temp - 273.15).toFixed(1)}°C` },
        { label: "Feels Like", value: `${(feels_like - 273.15).toFixed(1)}°C` },
        { label: "Min Temperature", value: `${(temp_min - 273.15).toFixed(1)}°C` },
        { label: "Max Temperature", value: `${(temp_max - 273.15).toFixed(1)}°C` },
        { label: "Humidity", value: `${humidity}%` },
        { label: "Pressure", value: `${pressure} hPa` },
        { label: "Wind Speed", value: `${speed} m/s` },
        { label: "Wind Direction", value: `${deg}°` },
        { label: "Cloudiness", value: `${cloudiness}%` },
        { label: "Visibility", value: `${(visibility / 1000).toFixed(1)} km` },
        { label: "Sunrise", value: new Date(sunrise * 1000).toLocaleTimeString() },
        { label: "Sunset", value: new Date(sunset * 1000).toLocaleTimeString() }
    ];
    details.forEach(detail => {
        const detailRow = document.createElement("div");
        detailRow.style.display = "flex";
        detailRow.style.justifyContent = "space-between";
        detailRow.style.padding = "8px 0";
        detailRow.style.borderBottom = "1px solid #eee";
        const labelSpan = document.createElement("span");
        labelSpan.textContent = detail.label + ":";
        labelSpan.style.fontWeight = "bold";
        const valueSpan = document.createElement("span");
        valueSpan.textContent = detail.value;
        detailRow.appendChild(labelSpan);
        detailRow.appendChild(valueSpan);
        detailsContainer.appendChild(detailRow);
    });
    const mapBtn = document.createElement("button");
    mapBtn.textContent = "Open in Google Maps";
    mapBtn.type = "button";
    mapBtn.style.marginTop = "15px";
    mapBtn.onclick = () => {
        window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
    };
    card.appendChild(closeBtn);
    card.appendChild(title);
    card.appendChild(detailsContainer);
    card.appendChild(mapBtn);
}
function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧";
        case (weatherId >= 600 && weatherId < 700):
            return "❄";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫";
        case (weatherId === 800):
            return "☀";
        case (weatherId >= 801 && weatherId < 810):
            return "☁";
        default:
            return "❓";
    }
}
function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}