import React, { useRef } from "react";
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../../context/AudioContext";

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    progress,
    duration,
    seek,
    formatTime,
    closePlayer,
  } = useAudio();

  const progressBarRef = useRef(null);

  // Don't show player if no track is selected
  if (!currentTrack) return null;

  const handleSeek = (e) => {
    if (!progressBarRef.current) return;

    const progressBar = progressBarRef.current;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const percentage = clickPosition / progressBar.clientWidth;

    seek(percentage * 100);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="glass-effect border-t border-white/10 backdrop-blur-xl bg-black/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent-pink/20" />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-sm truncate text-white">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-text-secondary truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4 md:space-x-6 flex-none justify-center">
              <button className="hidden md:block p-2 hover:text-primary transition-colors text-gray-400">
                <BackwardIcon className="h-5 w-5" />
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary to-accent-pink flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20"
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                ) : (
                  <PlayIcon className="h-5 w-5 md:h-6 md:w-6 text-white ml-1" />
                )}
              </button>

              <button className="hidden md:block p-2 hover:text-primary transition-colors text-gray-400">
                <ForwardIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar & Volume */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
              {/* Time */}
              <div className="text-xs text-text-secondary font-medium w-20 text-center">
                {formatTime(progress)} / {formatTime(duration)}
              </div>

              {/* Progress Bar */}
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="w-32 lg:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
              >
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent-pink group-hover:brightness-110 transition-all"
                  style={{ width: `${(progress / duration) * 100 || 0}%` }}
                />
              </div>

              {/* Volume */}
              <div className="flex items-center space-x-2 group">
                <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
                  {volume === 0 ? (
                    <SpeakerXMarkIcon className="h-5 w-5 text-text-secondary group-hover:text-white transition-colors" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5 text-text-secondary group-hover:text-white transition-colors" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-primary cursor-pointer h-1 bg-white/10 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>

            {/* Close Button - Visible on all sizes */}
            <div className="flex items-center border-l border-white/10 pl-4">
              <button
                onClick={closePlayer}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                title="Close Player"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="md:hidden mt-3 space-y-1">
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
            >
              <div
                className="h-full bg-gradient-to-r from-primary to-accent-pink"
                style={{ width: `${(progress / duration) * 100 || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-text-secondary font-medium">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
