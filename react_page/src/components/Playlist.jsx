const Playlist = ({ handleSongClick, currentSongId, songs }) => {
  return (
    <div className="playlist">
      <h3>Playlist</h3>
      <div>
        <ul className="playlist-items">
          {songs.map((song) => (
            <li
              className={currentSongId === song.id ? "song-active" : "song"}
              key={song.id}
              onClick={() => handleSongClick(song)}
            >
              {song.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Playlist;
