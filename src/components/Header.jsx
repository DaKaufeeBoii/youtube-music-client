import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import SearchFilters from './SearchFilters';

const Header = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ type: 'any', videoDuration: 'any', uploadDate: 'any' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  return (
    <header className="header">
      <h1>YouTube Music</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <SearchFilters filters={filters} onChange={setFilters} />
      <div className="header-actions">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;