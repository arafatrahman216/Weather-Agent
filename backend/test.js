const weatherService = require('./service/weather/weatherService');

async function main() {
    const city = 'dhaka';
    try {
        const weatherData = await weatherService.getForecast(city,7);
        const weatherData2 = await weatherService.parseWeatherData(weatherData);
        console.log(weatherData2);


    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


main();