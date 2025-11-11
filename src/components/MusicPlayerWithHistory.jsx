import React from 'react';
import { useHistory } from '../context/HistoryContext';
import MusicPlayer from './MusicPlayer';

const MusicPlayerWithHistory = ({ videoId, title, video }) => {
  const { addToHistory } = useHistory();

  // Make addToHistory available globally for App.jsx
  React.useEffect(() => {
    window.addToHistory = addToHistory;
    return () => {
      delete window.addToHistory;
    };
  }, [addToHistory]);

  // Add to history when video changes
  React.useEffect(() => {
    if (video && videoId) {
      addToHistory(video);
    }
  }, [video, videoId, addToHistory]);

  return <MusicPlayer videoId={videoId} title={title} />;
};

export default MusicPlayerWithHistory;