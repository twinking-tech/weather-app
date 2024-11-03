import React, { useState } from 'react';
import axios from 'axios';
import './WeatherDisplay.css';

function WeatherDisplay() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setCity(event.target.value);
    };

    const fetchWeatherData = async () => {
        try {
            const currentWeatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
            );

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
            );

            setWeatherData({
                current: currentWeatherResponse.data,
                forecast: forecastResponse.data
            });
            setError(null);
        } catch (err) {
            setError('City not found. Please try again.');
            setWeatherData(null);
        }
    };

    // Process the 5-day forecast data
    const getDailyForecast = () => {
        if (!weatherData || !weatherData.forecast) return [];

        const dailyData = {};
        weatherData.forecast.list.forEach((entry) => {
            const date = new Date(entry.dt * 1000).toLocaleDateString("en-GB", {
                weekday: 'short', month: 'short', day: 'numeric'
            });

            if (!dailyData[date]) {
                dailyData[date] = {
                    date,
                    temp: entry.main.temp,
                    description: entry.weather[0].description,
                    icon: entry.weather[0].icon
                };
            }
        });

        return Object.values(dailyData).slice(1, 6); // Get the next 5 days
    };

    // Determine background class based on weather condition
    const getBackgroundClass = () => {
        if (!weatherData || !weatherData.current) return '';
        const condition = weatherData.current.weather[0].main.toLowerCase();

        switch (condition) {
            case 'clear':
            case 'clear sky':    
                return 'clear-sky';
            case 'clouds':
                return 'cloudy';
            case 'rain':
            case 'drizzle':
                return 'rainy';
            case 'thunderstorm':
                return 'stormy';
            case 'snow':
                return 'snowy';
            case 'haze':
                return 'haze';
            case 'mist':
                return 'mist';
            default:
                return 'default-weather';
        }
    };

    return (
        <div className={`weather-display ${getBackgroundClass()}`}>
            <div className='search-bar'>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={handleInputChange}
                />
                <button onClick={fetchWeatherData}>Search</button>
            </div>

            {error && <p className="error">{error}</p>}

            {weatherData && weatherData.current && (
                <div className="weather-card">
                    <u><b><h2>Weather in {weatherData.current.name}</h2></b></u><br/><br/>
                    <p className='new'>Temperature:  {weatherData.current.main.temp}°C</p><br/>
                    <p className='new'>Weather:  {weatherData.current.weather[0].description}</p><br/>
                    <p className='new'>Humidity:  {weatherData.current.main.humidity}%</p><br/>
                    <p className='new'>Wind Speed:  {weatherData.current.wind.speed} m/s</p>
                </div>
            )}

            {weatherData && weatherData.forecast && (
                <div className="forecast-section">
                    <h3>5-Day Forecast</h3>
                    <div className="forecast-cards">
                        {getDailyForecast().map((day, index) => (
                            <div className="forecast-card" key={index}>
                                <p>{day.date}</p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                                    alt={day.description}
                                    className={day.icon === "01d" ? "day-icon" : day.icon === "01n" ? "night-icon" : ""}
                                />
                                <p>{day.temp}°C</p>
                                <p>{day.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WeatherDisplay;
