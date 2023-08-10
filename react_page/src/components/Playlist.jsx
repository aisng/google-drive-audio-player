import { useRef, useEffect } from "react";

const Playlist = ({ handleSongClick, currentSongId, songs }) => {
  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedRef.current) {
      const scrollContainer = selectedRef.current.closest(".playlist-items");
      const itemRect = selectedRef.current.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      // Check if the selected item is near the bottom of the container
      const itemIsNearBottom = itemRect.bottom > containerRect.bottom;

      if (itemIsNearBottom) {
        scrollContainer.scrollTop += itemRect.bottom - containerRect.bottom;
      }
    }
  }, [currentSongId]);
  return (
    <div className="playlist">
      <h3>Playlist</h3>
      <div className="playlist-container">
        <ul className="playlist-items">
          {songs.map((song) => (
            <li
              className={currentSongId === song.id ? "song-active" : "song"}
              key={song.id}
              onClick={() => handleSongClick(song)}
              ref={currentSongId === song.id ? selectedRef : null}
            >
              {song.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Playlist;
