import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GenreSearch = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/genre-search/`, {
          params: { genre_id: genreId },
        });
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies by genre", error);
      }
    };
    fetchMovies();
  }, [genreId]);

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

export default GenreSearch;
