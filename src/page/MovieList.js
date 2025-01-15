import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MovieList.css';

const MovieList = () => {
  const [categories, setCategories] = useState({});
  const [selectedMovies, setSelectedMovies] = useState(() => {
    const savedSelections = localStorage.getItem('selectedMovies');
    return savedSelections ? JSON.parse(savedSelections) : [];
  });
  const [recommendations, setRecommendations] = useState([]);
  const debounceTimer = useRef(null); // For debouncing backend calls

  // Fetch movie categories on load
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/movies/')
      .then((response) => {
        setCategories(response.data || {});
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    const selectedTitles = selectedMovies.map((movie) => movie.title);
    const cacheKey = selectedTitles.sort().join(",").toLowerCase();
    const cachedRecommendations = localStorage.getItem(`recommendations_${cacheKey}`);

    if (cachedRecommendations) {
      console.log("Loading cached recommendations.");
      setRecommendations(JSON.parse(cachedRecommendations));
    } else if (selectedMovies.length > 0) {
      console.log("No cached recommendations found, fetching from backend.");
      fetchRecommendations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchRecommendations();
    }, 10000); // 10 seconds debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMovies]);

  const fetchRecommendations = () => {
    if (selectedMovies.length === 0) {
      console.warn("No movies selected for recommendations.");
      setRecommendations([]);
      return;
    }

    const selectedTitles = selectedMovies.map((movie) => movie.title);
    const cacheKey = selectedTitles.sort().join(",").toLowerCase();

    const cachedRecommendations = localStorage.getItem(`recommendations_${cacheKey}`);
    if (cachedRecommendations) {
      console.log("Using cached recommendations.");
      setRecommendations(JSON.parse(cachedRecommendations));
      return;
    }

    axios
      .post('http://localhost:8000/api/recommendation/', {
        titles: selectedTitles,
        top_n: 10,
      })
      .then((response) => {
        const recommendedMovies = response.data;
        localStorage.setItem(`recommendations_${cacheKey}`, JSON.stringify(recommendedMovies));
        setRecommendations(recommendedMovies);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
      });
  };

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

  const mergedCategories = {
    ...(selectedMovies.length > 0 && { "Selected Movies": selectedMovies }),
    ...(recommendations.length > 0 && { "Recommended For You": recommendations }),
    ...categories,
  };

  return (
    <div className="movie-list">
      {Object.entries(mergedCategories).map(([categoryName, movies]) => (
        <div key={categoryName}>
          <h2 className="movie-category-title">{categoryName.replace('_', ' ').toUpperCase()}</h2>
          <div className="movie-row">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                {/* Heart Button */}
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
        </div>
      ))}
    </div>
  );
};

export default MovieList;
