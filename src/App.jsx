import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { FavoritesProvider } from './context/FavoritesContext';
import { HistoryProvider } from './context/HistoryContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Favorites from './components/Favorites';
import RecentlyPlayed from './components/RecentlyPlayed';
import MusicPlayerWithHistory from './components/MusicPlayerWithHistory';
import EnhancedPlayerControls from './components/EnhancedPlayerControls';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import Playlist from './components/Playlist';
import { PlaylistProvider } from './context/PlaylistContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query, filters = {}) => {
    setIsLoading(true);
    setSearchResults([]);
    try {
      const params = new URLSearchParams({ query });
      if (filters.type && filters.type !== 'any') params.set('type', filters.type);
      if (filters.videoDuration && filters.videoDuration !== 'any') params.set('videoDuration', filters.videoDuration);
      if (filters.uploadDate && filters.uploadDate !== 'any') params.set('uploadDate', filters.uploadDate);
      const response = await axios.get(`/api/search?${params.toString()}`);
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVideo = (video) => {
    setCurrentVideo(video);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <FavoritesProvider>
          <HistoryProvider>
            <PlaylistProvider>
            <div className="app-container">
              <Header onSearch={handleSearch} />
              <div className="main-body">
                <Sidebar onNavigate={handleNavigation} />
                <div className="content-area">
                  {currentPage === 'home' && (
                    <MainContent 
                      searchResults={searchResults} 
                      onPlayVideo={handlePlayVideo}
                      isLoading={isLoading}
                    />
                  )}
                  {currentPage === 'favorites' && (
                    <Favorites onPlayVideo={handlePlayVideo} />
                  )}
                  {currentPage === 'playlist' && (
                    <Playlist onPlayVideo={handlePlayVideo} />
                  )}
                  {currentPage === 'recently-played' && (
                    <RecentlyPlayed onPlayVideo={handlePlayVideo} />
                  )}
                </div>
              </div>
              <MusicPlayerWithHistory 
                videoId={currentVideo?.id.videoId} 
                title={currentVideo?.snippet.title}
                video={currentVideo}
              />
              <EnhancedPlayerControls
                currentVideo={currentVideo}
                onPlayVideo={handlePlayVideo}
                searchResults={searchResults}
              />
              <KeyboardShortcuts />
            </div>
            </PlaylistProvider>
          </HistoryProvider>
        </FavoritesProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
