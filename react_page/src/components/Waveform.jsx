import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import CursorPlugin from "wavesurfer.js/src/plugin/cursor";
import AudioControls from "./AudioControls";
import { CircularProgress } from "@mui/material/";
const Waveform = ({ audio, onTimestampChange }) => {
  if (!audio) {
    return (
      <>
        <AudioControls />
        <div style={{ textAlign: "center", color: "red" }}>
          <h2>Couldn't load audio</h2>
        </div>
      </>
    );
  }
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTIme] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const formatTime = (timeInMs) => {
    return [
      Math.floor((timeInMs % 3600) / 60), // minutes
      ("00" + Math.floor(timeInMs % 60)).slice(-2), // seconds
    ].join(":");
  };

  const updateCurrentTime = () => {
    let currentTime = formatTime(waveSurferRef.current.getCurrentTime());
    onTimestampChange(currentTime);
    return setCurrentTIme(currentTime);
  };

  const updateDuration = () => {
    let duration = formatTime(waveSurferRef.current.getDuration());
    return setDuration(duration);
  };

  // doesn't work without event parameter
  const handleVolumeChange = (e, newValue) => {
    waveSurferRef.current.setVolume(newValue);
    return setVolume(newValue);
  };

  const handlePlayClick = () => {
    waveSurferRef.current.playPause();
    setIsPlaying(waveSurferRef.current.isPlaying());
  };

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#727d87",
      progressColor: "#49535c",
      height: 150,
      responsive: true,
      hideScrollbar: true,
      cursorColor: "#777",
      cursorWidth: 0,
      normalize: true,
      partialRender: true,
      plugins: [
        CursorPlugin.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            "background-color": "#023",
            color: "#fff",
            padding: "0.2rem",
            "font-size": "0.7rem",
          },
        }),
      ],
    });

    if (!audio) {
      return () => waveSurfer.destroy();
    }
    waveSurferRef.current = waveSurfer;

    waveSurfer.load(audio);
    waveSurfer.on("loading", (X, e) => {
      setLoadProgress(X);
      setLoading(true);
      console.log(loading);
    });
    waveSurfer.setVolume(volume);
    waveSurfer.on("ready", () => {
      setLoading(false);
      updateDuration();
      updateCurrentTime();
    });
    waveSurfer.on("audioprocess", () => {
      updateCurrentTime();
    });

    waveSurfer.on("interaction", () => {
      setTimeout(() => {
        updateCurrentTime();
      }, 0);
    });

    waveSurfer.on("destroy", () => {
      setIsPlaying(false);
    });

    // overwrite cursor plugin lib not to show miliseconds
    waveSurfer.cursor.formatTime = function formatTime(cursorTime) {
      cursorTime = isNaN(cursorTime) ? 0 : cursorTime;
      if (this.params.formatTimeCallback) {
        return this.params.formatTimeCallback(cursorTime);
      }
      return [cursorTime].map((time) =>
        [
          Math.floor((time % 3600) / 60), // minutes
          ("00" + Math.floor(time % 60)).slice(-2), // seconds
        ].join(":")
      );
    };

    return () => waveSurfer.destroy();
  }, [audio]);

  return (
    <>
      {loading ? (
        <div className="loader">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <AudioControls
          handlePlayClick={handlePlayClick}
          isPlaying={isPlaying}
          currentVolume={volume}
          handleVolumeChange={handleVolumeChange}
          currentTime={currentTime}
          duration={duration}
        />
      )}
      <div ref={containerRef} />
    </>
  );
};

export default Waveform;
