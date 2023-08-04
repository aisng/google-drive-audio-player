import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

const AudioControls = ({
  handlePlayClick = null,
  isPlaying = null,
  currentVolume = null,
  handleVolumeChange = null,
  currentTime = null,
  duration = null,
}) => {
  return (
    <div className="audio-controls">
      <div className="play-button-div">
        <button onClick={handlePlayClick} type="button">
          {isPlaying ? (
            <FaPauseCircle size="3em" />
          ) : (
            <FaPlayCircle size="3em" />
          )}
        </button>
      </div>

      <div className="volume-control">
        <VolumeDown />
        <Slider
          size="small"
          aria-label="Volume"
          min={0}
          max={1}
          step={0.01}
          value={currentVolume}
          onChange={handleVolumeChange}
          sx={{
            "& .MuiSlider-thumb": {
              color: "#3f4e66",
            },
            "& .MuiSlider-track": {
              color: "#323b42",
            },
            "& .MuiSlider-rail": {
              color: "#acc4e4",
            },
            "& .MuiSlider-active": {
              color: "#bdbdbd",
            },
          }}
        ></Slider>
        <VolumeUp />
      </div>

      <div className="time-info">
        {currentTime}/{duration}
      </div>
    </div>
  );
};

export default AudioControls;
