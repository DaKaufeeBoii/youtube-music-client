import React, { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useHistory } from '../context/HistoryContext';

const EnhancedPlayerControls = ({ 
  currentVideo, 
  onPlayVideo, 
  searchResults = [], 
  favorites = [], 
  history = [] 
}) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'
  const [shuffleQueue, setShuffleQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Initialize shuffle queue when current video changes
  useEffect(() => {
    if (currentVideo && searchResults.length > 0) {
      const currentVideoIndex = searchResults.findIndex(
        video => video.id.videoId === currentVideo.id.videoId
      );
      setCurrentIndex(currentVideoIndex);
      
      if (isShuffled) {
        createShuffleQueue(currentVideoIndex);
      }
    }
  }, [currentVideo, searchResults, isShuffled]);

  const createShuffleQueue = (excludeIndex = -1) => {
    const availableVideos = searchResults.filter((_, index) => index !== excludeIndex);
    const shuffled = [...availableVideos].sort(() => Math.random() - 0.5);
    setShuffleQueue(shuffled);
  };

  const toggleShuffle = () => {
    const newShuffleState = !isShuffled;
    setIsShuffled(newShuffleState);
    
    if (newShuffleState && currentVideo) {
      createShuffleQueue(currentIndex);
    } else {
      setShuffleQueue([]);
    }
  };

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return '🔂'; // Repeat one
      case 'all':
        return '🔁'; // Repeat all
      default:
        return '🔁'; // Repeat (inactive)
    }
  };

  const skipBackward = () => {
    if (!searchResults.length) return;

    let previousIndex;
    
    if (isShuffled && shuffleQueue.length > 0) {
      // In shuffle mode, play the last song from the shuffle queue
      const lastShuffled = shuffleQueue[shuffleQueue.length - 1];
      if (lastShuffled) {
        onPlayVideo(lastShuffled);
        return;
      }
    }
    
    // Normal mode: go to previous song
    if (currentIndex > 0) {
      previousIndex = currentIndex - 1;
    } else {
      // If at the beginning, go to the last song
      previousIndex = searchResults.length - 1;
    }
    
    onPlayVideo(searchResults[previousIndex]);
  };

  const skipForward = () => {
    if (!searchResults.length) return;

    let nextIndex;
    
    if (isShuffled && shuffleQueue.length > 0) {
      // In shuffle mode, play the next song from the shuffle queue
      const nextShuffled = shuffleQueue[0];
      if (nextShuffled) {
        onPlayVideo(nextShuffled);
        // Remove played song from shuffle queue
        setShuffleQueue(prev => prev.slice(1));
        return;
      }
    }
    
    // Normal mode: go to next song
    if (currentIndex < searchResults.length - 1) {
      nextIndex = currentIndex + 1;
    } else {
      // If at the end, go to the first song (if repeat all is enabled)
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return; // Don't play anything if at the end and no repeat
      }
    }
    
    onPlayVideo(searchResults[nextIndex]);
  };

  const handleVideoEnd = () => {
    if (repeatMode === 'one') {
      // Replay the same video
      onPlayVideo(currentVideo);
    } else if (repeatMode === 'all' || currentIndex < searchResults.length - 1) {
      // Play next song
      skipForward();
    }
  };

  // Listen for video end events
  useEffect(() => {
    const handleVideoEnded = () => {
      if (currentVideo) {
        handleVideoEnd();
      }
    };

    // This would need to be integrated with the YouTube player
    // For now, we'll expose the function for manual triggering
    window.handleVideoEnd = handleVideoEnded;
    // Expose skip controls for keyboard shortcuts
    window.skipForward = skipForward;
    window.skipBackward = skipBackward;
    
    return () => {
      delete window.handleVideoEnd;
      delete window.skipForward;
      delete window.skipBackward;
    };
  }, [currentVideo, repeatMode, currentIndex, isShuffled, shuffleQueue]);

  return (
    <div className="enhanced-controls">
      <button 
        onClick={toggleShuffle} 
        className={`control-btn ${isShuffled ? 'active' : ''}`}
        title="Shuffle"
      >
        🔀
      </button>
      
      <button 
        onClick={skipBackward} 
        className="control-btn"
        title="Previous Song"
        disabled={!searchResults.length}
      >
        ⏮️
      </button>
      
      <button 
        onClick={toggleRepeat} 
        className={`control-btn ${repeatMode !== 'none' ? 'active' : ''}`}
        title={`Repeat: ${repeatMode === 'none' ? 'Off' : repeatMode === 'one' ? 'One' : 'All'}`}
      >
        {getRepeatIcon()}
      </button>
      
      <button 
        onClick={skipForward} 
        className="control-btn"
        title="Next Song"
        disabled={!searchResults.length}
      >
        ⏭️
      </button>
      
      {isShuffled && (
        <div className="shuffle-indicator">
          {shuffleQueue.length} songs queued
        </div>
      )}
    </div>
  );
};

export default EnhancedPlayerControls;