import React from 'react';
import { useHistory } from '../context/HistoryContext';
import HeartButton from './HeartButton';

const RecentlyPlayed = ({ onPlayVideo }) => {
  const { history, formatTimestamp, clearHistory } = useHistory();

  if (history.length === 0) {
    return (
      <div className="recently-played-page">
        <h2>Recently Played</h2>
        <div className="empty-history">
          <p>🕒 No recently played songs!</p>
          <p>Start listening to music to see your history here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recently-played-page">
      <div className="recently-played-header">
        <h2>Recently Played ({history.length})</h2>
        <button onClick={clearHistory} className="clear-history-btn">
          Clear History
        </button>
      </div>
      <div className="recently-played-list">
        {history.map((song, index) => (
          <div key={`${song.id.videoId}-${song.playedAt}`} className="history-item">
            <div className="history-number">{index + 1}</div>
            <div 
              className="history-thumbnail"
              onClick={() => onPlayVideo(song)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={song.snippet.thumbnails?.default?.url || song.snippet.thumbnails?.medium?.url} 
                alt={song.snippet.title}
              />
            </div>
            <div className="history-info">
              <h4>{song.snippet.title}</h4>
              <p>{song.snippet.channelTitle}</p>
              <span className="timestamp">{formatTimestamp(song.playedAt)}</span>
            </div>
            <div className="history-actions">
              <HeartButton video={song} size="small" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;