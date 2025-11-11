import React from 'react';
import { usePlaylist } from '../context/PlaylistContext';

const Playlist = ({ onPlayVideo }) => {
  const { playlist, removeFromPlaylist, clearPlaylist } = usePlaylist();

  return (
    <div className="playlist-page">
      <div className="playlist-header">
        <h2>My Playlist</h2>
        <button className="clear-history-btn" onClick={clearPlaylist}>Clear Playlist</button>
      </div>
      {playlist.length === 0 ? (
        <div className="empty-history">
          <p>Your playlist is empty. Add songs from search results.</p>
        </div>
      ) : (
        <ul className="recently-played-list">
          {playlist.map((item) => (
            <li key={item.id.videoId} className="recent-item">
              <img
                src={item.snippet.thumbnails?.default?.url || item.snippet.thumbnails?.medium?.url}
                alt={item.snippet.title}
                className="recent-thumbnail"
              />
              <div className="recent-info">
                <h4 className="recent-title">{item.snippet.title}</h4>
                <p className="recent-channel">{item.snippet.channelTitle}</p>
              </div>
              <div className="recent-actions">
                <button className="action-btn play" onClick={() => onPlayVideo(item)}>▶️ Play</button>
                <button className="action-btn delete" onClick={() => removeFromPlaylist(item.id.videoId)}>🗑️ Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Playlist;