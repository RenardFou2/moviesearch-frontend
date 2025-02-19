import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Menu, Typography } from 'antd';
import axios from 'axios';
import './SearchBar.css';

const { SubMenu } = Menu;
const { Text } = Typography;

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/genre-names/');
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMenuClick = (e) => {
    const genreId = e.key;
    navigate(`/genre/${genreId}`);
  };

  const handleHomeButton = (e) => {
    navigate(`/`);
  };

  return (
    <div className="navbar">
      <Menu mode="horizontal" theme="dark" onClick={handleMenuClick} className="genre-menu">
        <SubMenu key="genres" title={<Text style={{ color: '#ffffff' }}>Select Genre</Text>}>
          {genres.map((genre) => (
            <Menu.Item key={genre.id}>{genre.name}</Menu.Item>
          ))}
        </SubMenu>
      </Menu>

      <Button type="primary" onClick={handleHomeButton} className="home-button">
        Home
      </Button>

      <div className="search-container">
        <Input
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <Button type="primary" onClick={handleSearch} className="search-button">
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
