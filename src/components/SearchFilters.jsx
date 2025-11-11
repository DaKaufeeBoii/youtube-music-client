import React from 'react';

const SearchFilters = ({ filters, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="search-filters" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <select name="type" value={filters.type} onChange={handleChange} className="filter-select">
        <option value="any">Type: Any</option>
        <option value="video">Type: Video</option>
        <option value="channel">Type: Channel</option>
        <option value="playlist">Type: Playlist</option>
      </select>
      <select name="videoDuration" value={filters.videoDuration} onChange={handleChange} className="filter-select">
        <option value="any">Duration: Any</option>
        <option value="short">Short (&lt;4 min)</option>
        <option value="medium">Medium (4–20 min)</option>
        <option value="long">Long (&gt;20 min)</option>
      </select>
      <select name="uploadDate" value={filters.uploadDate} onChange={handleChange} className="filter-select">
        <option value="any">Upload: Any</option>
        <option value="hour">Last hour</option>
        <option value="today">Today</option>
        <option value="week">This week</option>
        <option value="month">This month</option>
        <option value="year">This year</option>
      </select>
    </div>
  );
};

export default SearchFilters;