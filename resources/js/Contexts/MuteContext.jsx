// MuteContext.js
import { createContext, useContext, useState } from "react";

const MuteContext = createContext();

export function MuteProvider({ children }) {
  const [isMuted, setIsMuted] = useState(true); // default mute ON
  const [activeVideoId, setActiveVideoId] = useState(null); // Track which video should have audio

  const toggleMute = () => setIsMuted(prev => !prev);
  const mute = () => setIsMuted(true);
  const unmute = () => setIsMuted(false);
  const setActiveVideo = (videoId) => setActiveVideoId(videoId);
  const clearActiveVideo = () => setActiveVideoId(null);
  
  return (
    <MuteContext.Provider value={{ 
      isMuted, 
      toggleMute, 
      mute, 
      unmute, 
      activeVideoId, 
      setActiveVideo, 
      clearActiveVideo 
    }}>
      {children}
    </MuteContext.Provider>
  );
}

export function useMute() {
  return useContext(MuteContext);
}
