const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const searchCitySection = document.querySelector('.search-city');
const notFoundSection = document.querySelector('.city-not-found');
const weatherInfoSection = document.querySelector('.weather-info');

const apiKey = '0af85a2d86a0fa1ad7824e0d82b7122a';

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') updateWeatherInfo(city);
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value.trim());
    }
});
async function getFetchData(endpoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('City not found');
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}
async function updateWeatherInfo(city) {
    hideAllSections();
    searchCitySection.style.display = 'block';

    const weatherData = await getFetchData('weather', city);

    searchCitySection.style.display = 'none';

    if (weatherData && weatherData.weather) {
        fadeIn(weatherInfoSection);

        const temp = Math.round(weatherData.main.temp);

        document.querySelector('.location-name').textContent = city;
        document.querySelector('.temp-txt').textContent = `${temp} °C`;
        document.querySelector('.condition-txt').textContent = capitalizeFirstLetter(weatherData.weather[0].description);
        document.querySelector('.weather-summary-img').src = `./image/${validateWeather(temp)}.png`;
        document.querySelector('.humidity-value-txt').textContent = `${weatherData.main.humidity}%`;
        document.querySelector('.wind-speed-value-txt').textContent = `${weatherData.wind.speed} km/h`;
        document.querySelector('.feels-like-value-txt').textContent = `${Math.round(weatherData.main.feels_like)} °C`;
    } else {
        notFoundSection.style.display = 'block';
    }
}
function validateWeather(temp) {
    if (temp >= 35) return 'sunny';
    if (temp >= 25) return 'clear';
    if (temp >= 15) return 'cloudy';
    if (temp >= 5) return 'rainy';
    return 'thunder';
}

function hideAllSections() {
    searchCitySection.style.display = 'none';
    notFoundSection.style.display = 'none';
    weatherInfoSection.style.display = 'none';
}

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'flex';
    let opacity = 0;
    const timer = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(timer);
        } else {
            opacity += 0.1;
            element.style.opacity = opacity;
        }
    }, 30);
}
