import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useWatchTime = ({ musicId }) => {
  const [ setWatchTime] = useState(0); // Track local watch time
  const [isBuffering, setIsBuffering] = useState(false); // Track buffering state
  const isPaused = useRef(true); // Ref to track play/pause state
  const saveInterval = useRef(null); // Ref for the periodic timer
  const isSaving = useRef(false); // Flag to prevent concurrent saves
  const threshold = 10; // Save every 10 seconds

  // Function to save watch time
  const saveWatchTime = async () => {
    if (isSaving.current || !musicId) return; // Prevent overlapping saves
    isSaving.current = true;

    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post(`/home/audio/api/watchtime/${musicId}/${userId}`, {});

      if (response.status === 200) {
        console.log("Watch time saved successfully");
      } else {
        console.error("Failed to save watch time:", response.data);
      }
    } catch (error) {
      console.error("Error saving watch time:", error);
    } finally {
      isSaving.current = false; // Allow future saves
    }
  };

  // Handle periodic saving when the audio/video is playing
  const startWatchTimer = () => {
    if (!saveInterval.current) {
      saveInterval.current = setInterval(() => {
        setWatchTime((prevWatchTime) => {
          let newWatchTime = prevWatchTime + 1;

          if (newWatchTime >= threshold) {
            saveWatchTime(); // Save watch time when threshold is reached
            newWatchTime -= threshold; // Reset local watch time after saving
          }

          return newWatchTime;
        });
      }, 1000);
    }
  };

  // Stop the timer when paused, stopped, or buffering
  const stopWatchTimer = () => {
    if (saveInterval.current) {
      clearInterval(saveInterval.current);
      saveInterval.current = null;
    }
  };

  // Cleanup on unmount or dependency change
  useEffect(() => {
    return () => {
      stopWatchTimer();
    };
  }, [musicId]);

  // Functions to start and stop the watch timer
  const Wstart = () => {
    if (isPaused.current && !isBuffering) {
      isPaused.current = false;
      startWatchTimer();
    }
  };

  const Wstop = () => {
    if (!isPaused.current) {
      isPaused.current = true;
      stopWatchTimer();
    }
  };

  // Buffering event handling
  const onBufferingStart = () => {
    setIsBuffering(true);
    stopWatchTimer(); // Pause watch time tracking
  };

  const onBufferingEnd = () => {
    setIsBuffering(false);
    if (!isPaused.current) {
      startWatchTimer(); // Resume watch time tracking if not paused
    }
  };

  return { Wstart, Wstop, onBufferingStart, onBufferingEnd };
};

export default useWatchTime;
