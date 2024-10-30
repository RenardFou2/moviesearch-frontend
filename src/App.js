import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Layout } from 'antd';
import MovieList from './page/MovieList';
import MovieDetail from './page/MovieDetails';
import SearchResults from './page/SearchResults';
import SearchBar from './component/SearchBar'
import { Content, Footer, Header } from 'antd/es/layout/layout';

const App = () => {

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
            <Route path="/" element={<MovieList />} />
            <Route path="/movies/:movieId" element={<MovieDetail />} />
            <Route path="/search" element={<SearchResults />} />
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
