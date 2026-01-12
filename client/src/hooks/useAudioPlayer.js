import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import toast from "react-hot-toast";

export const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const soundRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const loadTrack = (track) => {
    // Clean up previous track
    if (soundRef.current) {
      soundRef.current.unload();
      clearInterval(progressIntervalRef.current);
    }

    if (!track?.audioUrl) {
      toast.error("No audio URL provided for this track");
      return;
    }

    setCurrentTrack(track);

    soundRef.current = new Howl({
      src: [track.audioUrl],
      html5: true,
      volume: volume,
      onload: () => {
        setDuration(soundRef.current.duration());
      },
      onplay: () => {
        setIsPlaying(true);
        startProgressTracking();
      },
      onpause: () => {
        setIsPlaying(false);
        stopProgressTracking();
      },
      onstop: () => {
        setIsPlaying(false);
        setProgress(0);
        stopProgressTracking();
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        stopProgressTracking();
      },
      onloaderror: (id, error) => {
        console.error("Audio load error:", error);
        toast.error("Failed to load audio track");
      },
      onplayerror: (id, error) => {
        console.error("Audio play error:", error);
        toast.error("Failed to play audio track");
      },
    });
  };

  const togglePlay = () => {
    if (!soundRef.current) {
      toast.error("No track loaded");
      return;
    }

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const startProgressTracking = () => {
    progressIntervalRef.current = setInterval(() => {
      if (soundRef.current && soundRef.current.playing()) {
        const currentTime = soundRef.current.seek();
        setProgress(currentTime);
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const seek = (percentage) => {
    if (soundRef.current) {
      const newTime = duration * (percentage / 100);
      soundRef.current.seek(newTime);
      setProgress(newTime);
    }
  };

  const setPlayerVolume = (newVolume) => {
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      stopProgressTracking();
    };
  }, []);

  const closePlayer = () => {
    if (soundRef.current) {
      soundRef.current.unload();
    }
    stopProgressTracking();
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
  };

  return {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    loadTrack,
    togglePlay,
    seek,
    setVolume: setPlayerVolume,
    formatTime,
    closePlayer,
  };
};
