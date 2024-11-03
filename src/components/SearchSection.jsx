// src/components/SearchSection.jsx
import React from 'react';
import './SearchSection.css';

function SearchSection() {
    return (
        <div className="search-section">
            <input type="text" placeholder="Enter city name" />
            <button>Search</button>
        </div>
    );
}

export default SearchSection;
