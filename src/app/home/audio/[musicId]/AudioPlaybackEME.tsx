"use client";

import { useEffect, useRef, useState } from "react";
import dashjs from "dashjs";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import axios from "axios";
import useWatchTime from "@/hooks/useWatchTime";

export default function Playback({ manifestUrl, musicId }: { manifestUrl: string, musicId: string |string[]}) {
  
  const { Wstart, Wstop, onBufferingStart, onBufferingEnd } = useWatchTime({ musicId });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedSegments, setBufferedSegments] = useState<number[][]>([]);

  // Setup Dash.js and event listeners
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const player = dashjs.MediaPlayer().create();
    player.initialize(audio, manifestUrl, false);

    player.on("error", (e) => {
      console.error("Dash.js Error:", e);
    });

    const updateBufferedSegments = () => {
      const buffered = audio.buffered;
      const segments: number[][] = [];
      for (let i = 0; i < buffered.length; i++) {
        segments.push([buffered.start(i), buffered.end(i)]);
      }
      setBufferedSegments(segments);
    };

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      updateBufferedSegments();
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      recordView(musicId);
    };

    // Attach event listeners
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("ended", handleEnded); // Listen for playback end

  return () => {
    // Cleanup Dash.js and event listeners
    player.reset();
    audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    audio.removeEventListener("timeupdate", updateTime);
    audio.removeEventListener("ended", handleEnded); // Remove the "ended" listener
  };
  }, [manifestUrl]);
  const recordView = async (musicId:any) => {
    if (!musicId ) {
      console.error("Music ID are required.");
      return;
    }
      const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post(`/home/audio/api/views/${musicId}/${userId}`);
      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        console.error("Failed to record view:", response.data.message);
      }
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };
const handleEnded = ()=>{
  setIsPlaying(false);
};
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
      Wstart(); // Start watch time tracking
    } else {
      audio.pause();
      setIsPlaying(false);
      Wstop(); // Stop watch time tracking
    }
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(duration, audio.currentTime + 10);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 dark:font-light p-6 rounded-lg shadow-lg max-w-lg mx-auto relative">
      <audio
        ref={audioRef}
        onPlay={Wstart}
        onPause={Wstop}
        onWaiting={onBufferingStart}
        onPlaying={onBufferingEnd}
        preload="auto"
        className="hidden"
      />

      {/* Duration Display */}
      <div className="absolute top-2 left-4 text-gray-300">
        {formatTime(currentTime) || "0:00"}
      </div>

      <div className="absolute top-2 right-4 text-gray-300">
        {formatTime(duration) || "0:00"}
      </div>

      {/* Seek Bar with Buffered Segments */}
      <div className="relative mt-1 w-full h-4 bg-gray-700 rounded-lg overflow-hidden mb-4">
        {/* Buffered Segments */}
        {bufferedSegments.map(([start, end], index) => (
          <div
            key={index}
            className="absolute bg-blue-300 h-full"
            style={{
              left: `${(start / duration) * 100}%`,
              width: `${((end - start) / duration) * 100}%`,
            }}
          />
        ))}
        {/* Seek Bar */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute top-0 w-full h-4 opacity-0 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          />
          <div
            className="absolute top-0 left-0 h-4 bg-blue-600 rounded-lg"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          onClick={skipBackward}
          className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition"
        >
          <FaBackward />
        </button>
        <button
          onClick={togglePlay}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-500 transition"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={skipForward}
          className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition"
        >
          <FaForward />
        </button>
      </div>
    </div>
  );
}
