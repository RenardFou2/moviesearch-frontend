import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../component/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { HeartOutlined, HeartFilled, LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled } from '@ant-design/icons';
import { Button, Carousel } from 'antd';
import './MovieDetails.css';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [backdrops, setBackdrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMovies, setSelectedMovies] = useState(() => {
      const savedSelections = localStorage.getItem('selectedMovies');
      return savedSelections ? JSON.parse(savedSelections) : [];
  });

  const [likedStatus, setLikedStatus] = useState(() => {
    return JSON.parse(localStorage.getItem(`liked_${movieId}`)) || null; // null = no vote, true = liked, false = disliked
  });

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
  
  useEffect(() => {
    if (movie && movie.backdrops && movie.backdrops.length > 0) {
      setBackdrops(movie.backdrops);
    }
  }, [movie]);
  
  const toggleSelectMovie = (movie) => {
    setSelectedMovies((prevSelectedMovies) => {
      const exists = prevSelectedMovies.some((m) => m.id === movie.id);
      return exists
        ? prevSelectedMovies.filter((m) => m.id !== movie.id)
        : [...prevSelectedMovies, movie];
    });
  };

  const handleLike = () => {
    
    const newStatus = likedStatus === true ? null : true;
    setLikedStatus(newStatus);
    localStorage.setItem(`liked_${movieId}`, JSON.stringify(newStatus));
    
  };

  const handleDislike = () => {
    console.log("Movie Data:", movie);
    const newStatus = likedStatus === false ? null : false;
    setLikedStatus(newStatus);
    localStorage.setItem(`liked_${movieId}`, JSON.stringify(newStatus));
    
  };

  if (isLoading) return <LoadingSpinner />;
  if (!movie) return <div className="movie-detail-loading">Loading...</div>;

  return (
    <div className="movie-detail">
      {backdrops.length > 0 && (
      <Carousel autoplay className="movie-carousel" key={backdrops.join('')}>
        {backdrops.map((imgUrl, index) => (
          <div key={index} className="carousel-slide">
            <img src={imgUrl} alt={`Backdrop ${index}`} className="carousel-image" />
          </div>
        ))}
      </Carousel>
      )}
      <div className="movie-info">
        <h1 className="movie-title">
          {movie.title} <span className="movie-year">({movie.year})</span>
        </h1>
        <p className="movie-rating">
          <strong>Rating:</strong> {movie.rating}/10
        </p>
        <p className="movie-overview">{movie.overview}</p>

        <Button type="text" onClick={() => toggleSelectMovie(movie)} className="favorite-btn">
          {selectedMovies.some((m) => m.id === movie.id) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />} Favorite
        </Button>

        <div className="like-dislike-buttons">
          <Button type="text" onClick={handleLike} className="like-btn">
            {likedStatus === true ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />} Like
          </Button>
          <Button type="text" onClick={handleDislike} className="dislike-btn">
            {likedStatus === false ? <DislikeFilled style={{ color: '#ff4d4f' }} /> : <DislikeOutlined />} Dislike
          </Button>

          {movie.categories && movie.categories.length > 0 && (
          <p className="movie-categories">
            <strong>Categories:</strong>{' '}
            {movie.categories.map((genre, index) => (
              <span key={genre}>
                <a href={`/search?genre=${encodeURIComponent(genre)}`} className="genre-link">
                  {genre}
                </a>
                {index < movie.categories.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
