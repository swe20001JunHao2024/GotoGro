import React from 'react';
import './SearchBar.css'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <input
            type="text"
            className='input'
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    );
};

export default SearchBar;
