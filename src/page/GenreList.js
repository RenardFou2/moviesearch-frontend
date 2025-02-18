import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeartOutlined, HeartFilled} from '@ant-design/icons';
import axios from 'axios';

const GenreSearch = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState(() => {
      const savedSelections = localStorage.getItem('selectedMovies');
      return savedSelections ? JSON.parse(savedSelections) : [];
  });

  useEffect(() => {
    localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
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
  }, [genreId, selectedMovies]);

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
                {selectedMovies.some((m) => m.id === movie.id) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined style={{ color: 'white' }} />}
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

export default GenreSearch;
