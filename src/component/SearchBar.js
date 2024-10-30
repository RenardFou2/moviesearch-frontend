import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space } from 'antd';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
  
    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      }
    };

    return (
        <Space.Compact style={{ width: '100%' }}>
            <Input defaultValue="Combine input and button" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}/>
            <Button type="primary" onClick={handleSearch}>Submit</Button>
        </Space.Compact>
    );
  };
  
  export default SearchBar;