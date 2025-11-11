import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('youtube-music-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('youtube-music-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (video) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id.videoId === video.id.videoId);
      if (!exists) {
        return [...prev, video];
      }
      return prev;
    });
  };

  const removeFromFavorites = (videoId) => {
    setFavorites(prev => prev.filter(fav => fav.id.videoId !== videoId));
  };

  const isFavorite = (videoId) => {
    return favorites.some(fav => fav.id.videoId === videoId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};