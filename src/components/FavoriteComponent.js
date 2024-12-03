import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchComponent from './SearchComponent';
import WeatherDisplay from './WeatherDisplay';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

const FavoriteComponent = ({ onSelectFavorite }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:3001/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/favorites/${id}`);
      fetchFavorites(); // Simply fetch the updated list
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="favorites-component">
      <h3>Favorite Cities</h3>
      <div className="favorites-list">
        {favorites.map((fav) => (
          <div key={fav.id} className="favorite-item">
            <span onClick={() => onSelectFavorite(fav.city)}>{fav.city}</span>
            <button onClick={() => removeFavorite(fav.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// export default FavoriteComponent;


export { SearchComponent, WeatherDisplay, FavoriteComponent };