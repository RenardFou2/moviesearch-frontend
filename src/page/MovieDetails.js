import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../component/LoadingSpinner'
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/movies/${movieId}/`)
      .then((response) => {
        setMovie(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
        setIsLoading(false);
      });
  }, [movieId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return <div className="movie-detail-loading">Loading...</div>;
  }

  return (
    <div className="movie-detail">
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h1 className="movie-title">
          {movie.title} <span className="movie-year">({movie.year})</span>
        </h1>
        <p className="movie-rating">
          <strong>Rating:</strong> {movie.rating}/10
        </p>
        <p className="movie-overview">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
