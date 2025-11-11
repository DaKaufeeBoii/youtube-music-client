import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import HeartButton from './HeartButton';

const Favorites = ({ onPlayVideo }) => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h2>Your Favorite Songs</h2>
        <div className="empty-favorites">
          <p>❤️ No favorite songs yet!</p>
          <p>Click the heart icon on any song to add it to your favorites.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h2>Your Favorite Songs ({favorites.length})</h2>
      <div className="favorites-grid">
        {favorites.map((song) => (
          <div key={song.id.videoId} className="favorite-item">
            <div 
              className="favorite-thumbnail"
              onClick={() => onPlayVideo(song)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={song.snippet.thumbnails?.medium?.url || song.snippet.thumbnails?.default?.url} 
                alt={song.snippet.title}
              />
              <div className="play-overlay">▶️</div>
            </div>
            <div className="favorite-info">
              <h4>{song.snippet.title}</h4>
              <p>{song.snippet.channelTitle}</p>
              <div className="favorite-actions">
                <HeartButton video={song} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;