import React, { createContext, useContext } from "react";
import { useAudioPlayer as useAudioPlayerHook } from "../hooks/useAudioPlayer";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const audio = useAudioPlayerHook();

  return (
    <AudioContext.Provider value={audio}>{children}</AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
