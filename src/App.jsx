// App.jsx
import React, { useState } from 'react';  // Import useState from React
import Navbar from './components/Navbar';
import Header from './components/Header';
import WeatherDisplay from './components/WeatherDisplay';
import SearchSection from './components/SearchSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  const fetchWeatherData = async () => {
    if (!city) return;

    console.log(`Fetching weather data for city: ${city}`); // Check if this logs

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        console.log("Weather data fetched:", data); // Check if data was fetched successfully
        setWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
};

  return (
    <div className="app-container">
      {/* Navbar handles city input and fetchWeatherData */}
      <Navbar setCity={setCity} fetchWeatherData={fetchWeatherData}
      city={city} 
      weatherData={weatherData}  />
      

      
      {/* Main content displaying the weather information */}
      <main className="main-content">
        
        <Header />
        
        <WeatherDisplay city={city} 
          weatherData={weatherData}   />
        <Footer />
      </main>
    </div>
  );
}

export default App;
