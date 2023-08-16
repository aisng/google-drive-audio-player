import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import CursorPlugin from "wavesurfer.js/src/plugin/cursor";
import AudioControls from "./AudioControls";
import { CircularProgress } from "@mui/material/";

const Waveform = ({ audio, onTimestampChange, onError }) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTIme] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

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
    if (hasErrors) {
      return;
    }
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
    // try {
    //   waveSurfer.load(audio);
    // } catch {
    //   console.error("blablababa");
    //   return waveSurfer.destroy();
    // }
    waveSurfer.load(audio);
    waveSurfer.setVolume(volume);
    waveSurfer.on("ready", () => {
      setLoading(false);
      updateDuration();
      updateCurrentTime();
    });
    waveSurfer.on("error", () => {
      waveSurfer.destroy();
      setHasErrors(true);
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

    // overwrite cursor plugin not to show miliseconds
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

      {!hasErrors ? (
        <div ref={containerRef} />
      ) : (
        <div style={{ textAlign: "center", color: "red", width: "100%" }}>
          <p>Audio type is not supported or the file was not found.</p>
        </div>
      )}
    </>
  );
};

export default Waveform;
