import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MovieList.css';

const MovieList = () => {
  const [categories, setCategories] = useState({});
  const [selectedMovies, setSelectedMovies] = useState(() => {
    const savedSelections = localStorage.getItem('selectedMovies');
    return savedSelections ? JSON.parse(savedSelections) : [];
  });
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
  }, [selectedMovies]);

  const toggleSelectMovie = (movie) => {
    setSelectedMovies((prevSelectedMovies) => {
      const exists = prevSelectedMovies.find((m) => m.id === movie.id);
      if (exists) {
        return prevSelectedMovies.filter((m) => m.id !== movie.id);
      } else {
        return [...prevSelectedMovies, movie];
      }
    });
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
  };

  const mergedCategories = {
    ...(selectedMovies.length > 0 && { "Selected ": selectedMovies }),
    ...categories,
  };

  return (
    <div className="movie-list">
      <button onClick={toggleSelectionMode} className="selection-mode-button">
        {isSelectionMode ? "Exit Selection Mode" : "Enter Selection Mode"}
      </button>

      {Object.entries(mergedCategories).map(([categoryName, movies]) => (
        <div key={categoryName}>
          <h2 className="movie-category-title">{categoryName.replace('_', ' ').toUpperCase()}</h2>
          <div className="movie-row">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                {isSelectionMode && (
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedMovies.some((m) => m.id === movie.id)}
                      onChange={() => toggleSelectMovie(movie)}
                    />
                    Select
                  </label>
                )}
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
