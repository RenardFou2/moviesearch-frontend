import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space, Menu } from 'antd';
import axios from 'axios';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("Movie title");
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

  return (
    <div style={{display: 'flex', alignItems: 'center',gap: '25px', }}>
      <Menu mode="horizontal" theme="dark" onClick={handleMenuClick} style={{ flex: 1 }}>
        <Menu.SubMenu key="genres" title="Select Genre">
          {genres.map((genre) => (
          <Menu.Item key={genre.id}>{genre.name}</Menu.Item>
          ))}
        </Menu.SubMenu>
      </Menu>
      <Space.Compact>
        <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}/>
        <Button type="primary" onClick={handleSearch}>Search</Button>
      </Space.Compact>
    </div>
  );
};  
export default SearchBar;