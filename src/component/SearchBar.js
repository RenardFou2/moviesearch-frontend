import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space, Menu, Typography } from 'antd';
import axios from 'axios';

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

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 20px', backgroundColor: '#001529' }}>
      <Menu mode="horizontal" theme="dark" onClick={handleMenuClick} style={{ flex: 1, border: 'none' }}>
        <SubMenu key="genres" title={<Text style={{ color: '#ffffff' }}>Select Genre</Text>}>
          {genres.map((genre) => (
            <Menu.Item key={genre.id}>{genre.name}</Menu.Item>
          ))}
        </SubMenu>
      </Menu>
      <Space.Compact size="large">
        <Input
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
          }}
        />
        <Button type="primary" onClick={handleSearch} style={{ fontWeight: 'bold' }}>
          Search
        </Button>
      </Space.Compact>
    </div>
  );
};

export default SearchBar;
