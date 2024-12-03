import React from 'react';
import axios from 'axios';

const WeatherDisplay = ({ currentWeather, forecast, isCelsius, toggleUnit, refreshFavorites }) => {
  if (!currentWeather) return <div>Please search for a city</div>;

  const addToFavorites = async () => {
    try {
      const { name } = currentWeather;
      const favResponse = await axios.get(`http://localhost:3001/favorites?city=${name}`);
      
      if (favResponse.data.length === 0) {
        await axios.post('http://localhost:3001/favorites', { city: name });
        alert(`${name} added to favorites!`);
        refreshFavorites(); // Refresh after adding
      } else {
        alert(`${name} is already in your favorites!`);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add city to favorites');
    }
  };

  const convertTemp = (temp) => isCelsius ? temp : (temp * 9) / 5 + 32;

  return (
    <div className="weather-display">
      <div className="current-weather">
        <h2>{currentWeather.name}</h2>
        <div className="temperature-toggle">
          <button onClick={toggleUnit}>
            Switch to {isCelsius ? '°F' : '°C'}
          </button>
          <button onClick={addToFavorites} className="add-favorite-btn">
            Add to Favorites
          </button>
        </div>
        <img
          src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
          alt="Weather icon"
        />
        <h3>{currentWeather.weather[0].description}</h3>
        <p>
          Temperature: {convertTemp(currentWeather.main.temp).toFixed(1)}°
          {isCelsius ? 'C' : 'F'}
        </p>
        <p>Humidity: {currentWeather.main.humidity}%</p>
        <p>Wind Speed: {currentWeather.wind.speed} m/s</p>
      </div>

      <div className="forecast">
        <h3>5-Day Forecast</h3>
        <div className="forecast-grid">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-day">
              <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt="Forecast icon"
              />
              <p>
                {convertTemp(day.main.temp).toFixed(1)}°
                {isCelsius ? 'C' : 'F'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
