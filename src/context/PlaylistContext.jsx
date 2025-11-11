import React, { createContext, useContext, useState } from 'react';

const PlaylistContext = createContext();

export const usePlaylist = () => {
  const ctx = useContext(PlaylistContext);
  if (!ctx) throw new Error('usePlaylist must be used within PlaylistProvider');
  return ctx;
};

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);

  const addToPlaylist = (video) => {
    setPlaylist((prev) => {
      const exists = prev.find((v) => v.id?.videoId === video.id?.videoId);
      if (exists) return prev;
      return [...prev, video];
    });
  };

  const removeFromPlaylist = (videoId) => {
    setPlaylist((prev) => prev.filter((v) => v.id?.videoId !== videoId));
  };

  const clearPlaylist = () => setPlaylist([]);

  const value = { playlist, addToPlaylist, removeFromPlaylist, clearPlaylist };
  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>;
};