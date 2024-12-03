import React, { useState, useEffect } from 'react';
import { SearchComponent, WeatherDisplay, FavoriteComponent } from './components/FavoriteComponent';
import { getCurrentWeather, getForecast } from './services/weatherService';
import './App.css';
import axios from 'axios';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Local storage for last searched city
  useEffect(() => {
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) searchCity(lastCity);
    fetchFavorites();
  }, []);

  // Search city and fetch weather & forecast data
  const searchCity = async (city) => {
    try {
      const weather = await getCurrentWeather(city);
      const forecastData = await getForecast(city);
      setCurrentWeather(weather);
      setForecast(forecastData);
      localStorage.setItem('lastSearchedCity', city);
    } catch (error) {
      alert('Error fetching weather data');
      console.error(error);
    }
  };

  // Toggle temperature unit
  const toggleUnit = () => setIsCelsius((prev) => !prev);

  // Fetch favorite cities
  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:3001/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error refreshing favorites:', error);
    }
  };

  return (
    <div className="App">
      <div className="dashboard-container">
        <h1>Weather Dashboard</h1>
        <div className="dashboard-layout">
          <div className="search-favorites-section">
            <SearchComponent onSearch={searchCity} />
            <FavoriteComponent onSelectFavorite={searchCity} favorites={favorites} />
          </div>
          <div className="weather-section">
            <WeatherDisplay
              currentWeather={currentWeather}
              forecast={forecast}
              isCelsius={isCelsius}
              toggleUnit={toggleUnit}
              refreshFavorites={fetchFavorites}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
