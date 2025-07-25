"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function VideoPlayer({ gameId, className = "" }) {
  const currentGame = useSelector((state) => state.gameDetails.currentGame);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", () => {});

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    setIsMuted(!isMuted);
    video.volume = isMuted ? 1 : 0;
    setVolume(isMuted ? 1 : 0);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const time = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = time;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video.requestFullscreen) video.requestFullscreen();
  };

  if (!currentGame?.video) return null;

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={currentGame.video}
        className="w-full rounded-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-midnight/50 bg-opacity-50 p-2 flex items-center justify-between">
        <button onClick={togglePlay} className="text-ivory mr-2">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="flex-grow mr-2"
        />
        <button onClick={toggleMute} className="text-ivory mr-2">
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 mr-2"
        />
        <button onClick={toggleFullscreen} className="text-ivory">
          <Maximize size={24} />
        </button>
      </div>
    </div>
  );
}
