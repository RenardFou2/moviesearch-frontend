import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MovieList.css'

const MovieList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/movies/')
    .then(response => {
      console.log(response.data);
      setCategories(response.data || {});
    })
    .catch(error => {
      console.error("Error fetching categories:", error);
    });
  }, []);
  
  return (
    <div className="movie-list">
      {Object.entries(categories).map(([categoryName, movies]) => (
        <div key={categoryName}>
          <h2 className="movie-category-title">{categoryName.replace('_', ' ').toUpperCase()}</h2>
          <div className="movie-row">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <Link to={`/movies/${movie.id}`}>
                  <img src={movie.poster} alt={movie.title} className="movie-poster" />
                </Link>
                <h4 className="movie-title">{movie.title}</h4>
                <p className="movie-info">Rating: {movie.rating}</p>
                <p className="movie-info">{movie.year}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;