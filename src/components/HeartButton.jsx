import React from 'react';
import { useFavorites } from '../context/FavoritesContext';

const HeartButton = ({ video, size = 'medium' }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(video.id.videoId);

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    if (favorite) {
      removeFromFavorites(video.id.videoId);
    } else {
      addToFavorites(video);
    }
  };

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <button
      onClick={handleClick}
      className={`heart-button ${favorite ? 'favorite' : ''}`}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={sizeClasses[size]}
        fill={favorite ? '#ff0000' : 'none'}
        stroke={favorite ? '#ff0000' : '#ffffff'}
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default HeartButton;