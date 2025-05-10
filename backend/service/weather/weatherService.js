const axios = require('axios');
const config = require('../../config/config.js');

class WeatherService {
    constructor() {
        this.apiKey = config.openWeatherMap.apiKey;
        this.apiUrl = config.openWeatherMap.baseUrl;
    }

    async getCurrentWeather(city) {
        try {
            const response = await axios.get(`${this.apiUrl}/weather`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric',
                },  
            });
            
            return this.parseWeatherData(response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    async getForecast(location, days = 5) {
        try {
          const response = await axios.get(`${this.apiUrl}/forecast`, {
            params: {
              q: location,
              appid: this.apiKey,
              units: 'metric',
              cnt: days * 8 // 8 data points per day (3-hour intervals)
            }
          });
          return this.parseWeatherData(response.data);
        } catch (error) {
          console.error('Error fetching forecast:', error.message);
          throw new Error(`Failed to fetch forecast: ${error.message}`);
        }
      }

      parseWeatherData(weatherData) {
        if (!weatherData) return null;
        
        // For current weather
        if (weatherData.main && weatherData.weather) {
          return {
            location: weatherData.city?.name,
            country: weatherData.sys?.country,
            temperature: weatherData.main.temp,
            feelsLike: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            description: weatherData.weather[0].description,
            windSpeed: weatherData.wind?.speed,
            location: weatherData.name,
            country: weatherData.sys?.country,
            dateTime : new Date(weatherData.dt *1000).toISOString(),
            timestamp: weatherData.dt,
            sunrise: new Date(weatherData.sys?.sunrise *1000).toLocaleTimeString(),
            sunset: new Date(weatherData.sys?.sunset *1000).toLocaleTimeString()
          };
        }
        
        // For forecast data
        if (weatherData.list) {
          return {
            location: weatherData.city?.name,
            country: weatherData.city?.country,
            forecast: weatherData.list.map(item => ({
              timestamp: item.dt,
              temperature: item.main.temp,
              feelsLike: item.main.feels_like,
              humidity: item.main.humidity,
              description: item.weather[0].description,
              windSpeed: item.wind?.speed,
              dateTime: new Date(item.dt *1000).toUTCString(),
              sunrise: new Date(item.sys?.sunrise *1000).toLocaleTimeString(),
              sunset: new Date(item.sys?.sunset *1000).toLocaleTimeString()
            }))
          };
        }
        
        return weatherData;
      }
}



module.exports = new WeatherService();
