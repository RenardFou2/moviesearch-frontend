import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Layout } from 'antd';
import MovieList from './page/MovieList';
import MovieDetail from './page/MovieDetails';
import SearchResults from './page/SearchResults';
import SearchBar from './component/SearchBar';
import GenreSearch from './page/GenreList';
import { Content, Footer, Header } from 'antd/es/layout/layout';

const App = () => {

  const [selectedMovies, setSelectedMovies] = useState([]);

  // Load initial state from localStorage
  useEffect(() => {
    const storedMovies = localStorage.getItem('selectedMovies');
    if (storedMovies) {
      setSelectedMovies(JSON.parse(storedMovies));
    }
  }, []);

  // Save to localStorage whenever selectedMovies changes
  useEffect(() => {
    localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
  }, [selectedMovies]);

  const addMovieToSelection = (movie) => {
    if (!selectedMovies.some((m) => m.id === movie.id)) {
      setSelectedMovies((prev) => [...prev, movie]);
    }
  };

  const removeMovieFromSelection = (movieId) => {
    setSelectedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  return (
    <Router>
      <Layout>
        <Header style={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <SearchBar/>
        </Header>
        <Content>
          <Routes>
            <Route path="/" element={<MovieList selectedMovies={selectedMovies} addMovieToSelection={addMovieToSelection} removeMovieFromSelection={removeMovieFromSelection} />} />
            <Route path="/movies/:movieId" element={<MovieDetail />} />
            <Route path="/search" element={<SearchResults selectedMovies={selectedMovies} addMovieToSelection={addMovieToSelection} removeMovieFromSelection={removeMovieFromSelection}  />} />
            <Route path="/genre/:genreId" element={<GenreSearch selectedMovies={selectedMovies} addMovieToSelection={addMovieToSelection} removeMovieFromSelection={removeMovieFromSelection}  />} />
          </Routes>
        </Content>
        <Footer>
          Maciej Nieciecki {new Date().getFullYear()} Work in progress
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
