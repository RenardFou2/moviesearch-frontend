import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const location = useLocation();
  const [selectedMovies, setSelectedMovies] = useState(() => {
    const savedSelections = localStorage.getItem('selectedMovies');
    return savedSelections ? JSON.parse(savedSelections) : [];
  });
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/search/`, {
          params: { query }
        });
        setMovies(response.data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      }
    };

    if (query) {
      fetchMovies();
    }
  }, [query, selectedMovies]);  


  const toggleSelectMovie = (movie) => {
    setSelectedMovies((prevSelectedMovies) => {
      const exists = prevSelectedMovies.some((m) => m.id === movie.id);
      return exists
        ? prevSelectedMovies.filter((m) => m.id !== movie.id)
        : [...prevSelectedMovies, movie];
    });
  };

  return (
    <div className="search-results">
      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <button
              className={`heart-button ${selectedMovies.some((m) => m.id === movie.id) ? "selected" : ""}`}
              onClick={() => toggleSelectMovie(movie)}
              >
                {selectedMovies.some((m) => m.id === movie.id) ? "❤️" : "🤍"}
              </button>
              <Link to={`/movies/${movie.id}`}>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                />
              </Link>
              <h4 className="movie-title">{movie.title}</h4>
              <p className="movie-info">Rating: {movie.rating}</p>
              <p className="movie-info">{movie.year}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};
export default SearchResults;