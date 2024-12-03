import axios from 'axios';
import { OPENWEATHER_API_KEY, BASE_WEATHER_URL, BASE_GEOCODING_URL } from '../config';

// Function to get coordinates for a city
const getCoordinates = async (city) => {
  try {
    const { data } = await axios.get(BASE_GEOCODING_URL, {
      params: { q: city, limit: 1, appid: OPENWEATHER_API_KEY },
    });

    if (!data.length) throw new Error('City not found');

    return { lat: data[0].lat, lon: data[0].lon };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};

// Function to get current weather for a city
export const getCurrentWeather = async (city) => {
  try {
    const { lat, lon } = await getCoordinates(city);
    const { data } = await axios.get(`${BASE_WEATHER_URL}/weather`, {
      params: { lat, lon, units: 'metric', appid: OPENWEATHER_API_KEY },
    });
    return data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// Function to get 5-day weather forecast for a city
export const getForecast = async (city) => {
  try {
    const { lat, lon } = await getCoordinates(city);
    const { data } = await axios.get(`${BASE_WEATHER_URL}/forecast`, {
      params: { lat, lon, units: 'metric', appid: OPENWEATHER_API_KEY },
    });

    // Group forecast by day (take the first entry for each day)
    const dailyForecast = Object.values(
      data.list.reduce((acc, item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!acc[date]) acc[date] = item;
        return acc;
      }, {})
    ).slice(0, 5); // Limit to the first 5 days

    return dailyForecast;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};
