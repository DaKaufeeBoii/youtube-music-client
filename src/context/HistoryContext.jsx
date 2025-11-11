import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const maxHistoryItems = 50; // Limit history to last 50 songs

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('youtube-music-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('youtube-music-history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (video) => {
    setHistory(prev => {
      // Remove existing entry if present
      const filtered = prev.filter(item => item.id.videoId !== video.id.videoId);
      
      // Add new entry at the beginning with timestamp
      const newEntry = {
        ...video,
        playedAt: new Date().toISOString()
      };
      
      // Keep only the most recent items
      const updated = [newEntry, ...filtered].slice(0, maxHistoryItems);
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (videoId) => {
    setHistory(prev => prev.filter(item => item.id.videoId !== videoId));
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const value = {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    formatTimestamp
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};