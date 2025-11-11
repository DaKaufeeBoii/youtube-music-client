import React from 'react';

const Sidebar = ({ onNavigate }) => {
  const handleNavigation = (page) => {
    onNavigate(page);
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <button onClick={() => handleNavigation('home')} className="nav-button">
              🏠 Home
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation('favorites')} className="nav-button">
              ❤️ Favorites
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation('playlist')} className="nav-button">
              🎵 Playlist
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation('recently-played')} className="nav-button">
              🕒 Recently Played
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation('explore')} className="nav-button">
              🔍 Explore
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation('library')} className="nav-button">
              📚 Library
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;