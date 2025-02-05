import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
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
  }, [query]);  

  return (
    <div className="search-results">
      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movies/${movie.id}`}>
                <img src={movie.poster} alt={movie.title} className="movie-poster" />
              </Link>
              <h4 className="movie-title">{movie.title}</h4>
              <p className="movie-rating">Rating: {movie.rating}</p>
              <p className="movie-year">{movie.year}</p>
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