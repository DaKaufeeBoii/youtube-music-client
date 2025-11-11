import React, { useRef, useState, useEffect } from 'react';

const MusicPlayer = ({ videoId, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (iframeRef.current && videoId) {
        window.player = new window.YT.Player(iframeRef.current, {
          videoId: videoId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }
    };

    return () => {
      if (window.player) {
        window.player.destroy();
      }
    };
  }, [videoId]);

  const onPlayerReady = (event) => {
    setDuration(event.target.getDuration());
    // Initialize volume from memory
    try {
      const savedVol = localStorage.getItem('playerVolume');
      if (savedVol !== null) {
        const vol = parseInt(savedVol, 10);
        setVolume(vol);
        event.target.setVolume(vol);
      } else {
        event.target.setVolume(volume);
      }
    } catch (e) {}
    // Expose play/pause toggle globally
    window.togglePlayPause = togglePlayPause;
  };

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    
    // Handle video end event
    if (event.data === window.YT.PlayerState.ENDED && window.handleVideoEnd) {
      window.handleVideoEnd();
    }
  };

  const togglePlayPause = () => {
    if (window.player && window.player.getPlayerState) {
      const state = window.player.getPlayerState();
      if (state === 1) { // Playing
        window.player.pauseVideo();
      } else {
        window.player.playVideo();
      }
    } else {
      console.log('Player not ready yet');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (window.player) {
      window.player.setVolume(newVolume);
    }
    try {
      localStorage.setItem('playerVolume', String(newVolume));
    } catch (e) {}
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.player && window.player.getCurrentTime) {
        setCurrentTime(window.player.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Preload saved volume into UI state even before player ready
    try {
      const savedVol = localStorage.getItem('playerVolume');
      if (savedVol !== null) {
        setVolume(parseInt(savedVol, 10));
      }
    } catch (e) {}
  }, []);

  if (!videoId) {
    return (
      <div className="music-player">
        <div className="player-placeholder">
          <p>Select a song to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="music-player">
      <div className="player-info">
        <h3>{title}</h3>
      </div>
      
      <div className="player-controls">
        <button onClick={togglePlayPause} className="play-pause-btn">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div className="volume-control">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
      
      <div className="youtube-embed" style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={iframeRef} id="youtube-player"></div>
      </div>
    </div>
  );
};

export default MusicPlayer;