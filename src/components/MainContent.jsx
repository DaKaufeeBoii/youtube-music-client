import React, { useState } from 'react';
import HeartButton from './HeartButton';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { usePlaylist } from '../context/PlaylistContext';

const MainContent = ({ searchResults, onPlayVideo, isLoading = false }) => {
  const { showToast } = useToast();
  const { addToPlaylist } = usePlaylist();

  const handlePlayVideo = (video) => {
    showToast(`Playing: ${video.snippet.title}`, 'success', 2000);
    onPlayVideo(video);
  };
  return (
    <main className="main-content">
      {isLoading ? (
        <div className="loading-section">
          <LoadingSpinner size="large" text="Searching for music..." />
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <h2>Search Results</h2>
          <div className="search-results">
            {searchResults.map((result) => (
              <div 
                key={result.id.videoId || result.id.channelId || result.id.playlistId || Math.random().toString()} 
                className="search-result-item"
                onClick={() => handlePlayVideo(result)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={result.snippet.thumbnails?.default?.url || result.snippet.thumbnails?.medium?.url || 'https://via.placeholder.com/120x90?text=No+Image'} 
                  alt={result.snippet.title}
                  crossOrigin="anonymous"
                />
                <p>{result.snippet.title}</p>
                <div className="search-result-actions">
                  <HeartButton video={result} size="small" />
                  <button 
                    className="action-btn play"
                    onClick={(e) => { e.stopPropagation(); addToPlaylist(result); showToast('Added to playlist', 'info', 1500); }}
                    title="Add to Playlist"
                  >
                    ➕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="welcome-section">
          <h2>Welcome to your YouTube Music Client! 🎵</h2>
          <p>Use the search bar to find your favorite music.</p>
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">❤️</span>
              <span>Favorite your songs</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🕒</span>
              <span>Recently played history</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔀</span>
              <span>Shuffle & repeat controls</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;