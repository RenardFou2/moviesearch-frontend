import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/movies/${movieId}/`)
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
      });
  }, [movieId]);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{movie.title} ({movie.year})</h1>
      <img src={movie.poster} alt={movie.title} />
      <p>Rating: {movie.rating}</p>
      <p>{movie.overview}</p>
    </div>
  );
};

export default MovieDetail;
