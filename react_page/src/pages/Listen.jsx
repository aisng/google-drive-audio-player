import Waveform from "../components/Waveform";
import Playlist from "../components/Playlist";
import Comments from "../components/comments/Comments";
import { useState, useEffect } from "react";
import { getSongs, getSong, getCurrentUser } from "../apiService";
import { CircularProgress } from "@mui/material";

const Listen = () => {
  const [songs, setSongs] = useState();
  const [currentSong, setCurrentSong] = useState(null);
  const [timestamp, setTimestamp] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [commentToScrollTo, setCommentToScrollTo] = useState("");

  const handleSongClick = (song) => {
    setCurrentSong(song);
  };

  useEffect(() => {
    const hash = window.location.hash;
    getCurrentUser().then((res) => {
      setCurrentUser(res.data);
    });
    getSongs().then((response) => {
      setSongs(response.data);
      if (!hash) {
        setCurrentSong(response.data[0]);
      }
    });

    if (hash) {
      const commentSong = hash.split("/")[1];
      setCommentToScrollTo(hash.split("/")[0]);
      getSong(commentSong).then((res) => {
        setCurrentSong(res.data);
      });
    }
  }, []);

  return (
    <>
      <h1>Listen</h1>
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
            commentToScrollTo={commentToScrollTo}
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
