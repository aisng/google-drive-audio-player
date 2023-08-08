import Waveform from "../components/Waveform";
import Playlist from "../components/Playlist";
import Comments from "../components/comments/Comments";
import { useState, useEffect } from "react";
import { getSongs, streamSong, getCurrentUser } from "../apiService";
import { CircularProgress } from "@mui/material";

const Listen = () => {
  const [songs, setSongs] = useState();
  const [currentSong, setCurrentSong] = useState(null);
  const [timestamp, setTimestamp] = useState();
  const [currentUser, setCurrentUser] = useState(null);

  const handleSongClick = (song) => {
    setCurrentSong(song);
  };

  useEffect(() => {
    getCurrentUser().then((res) => {
      setCurrentUser(res.data);
    });
    getSongs().then((response) => {
      setSongs(response.data);
      setCurrentSong(response.data[0]);
    });
  }, []);

  return (
    <>
      <h1>Listen</h1>
      <p>hi</p>
      <div className="player-interface">
        {songs && (
          <Waveform
            audio={currentSong.path}
            onTimestampChange={(currentTime) => {
              setTimestamp(currentTime);
            }}
          />
        )}
        {songs ? (
          <Playlist
            handleSongClick={handleSongClick}
            currentAudio={currentSong.path}
            currentSongId={currentSong.id}
            songs={songs}
          />
        ) : (
          <div className="loader">
            <p>Fetching data...</p>
            <CircularProgress color="inherit" />
          </div>
        )}
      </div>
      <div className="comments-section">
        {songs && (
          <Comments
            currentSongId={currentSong.id}
            currentUser={currentUser}
            timestamp={timestamp}
          />
        )}
      </div>
    </>
  );
};

export default Listen;
