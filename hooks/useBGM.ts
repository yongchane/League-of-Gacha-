import { useState, useEffect, useRef } from "react";
import { getBgmMuted, setBgmMuted } from "@/lib/my-page-storage";

export function useBGM() {
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const mainBgmRef = useRef<HTMLAudioElement | null>(null);
  const pickBgmRef = useRef<HTMLAudioElement | null>(null);
  const cardBgmRef = useRef<HTMLAudioElement | null>(null);

  // Load BGM muted setting on mount
  useEffect(() => {
    const savedMuted = getBgmMuted();
    setIsBgmMuted(savedMuted);
  }, []);

  // Toggle BGM mute
  const toggleBgmMute = (isGachaOpen: boolean, isMultiGachaOpen: boolean) => {
    const newMuted = !isBgmMuted;
    setIsBgmMuted(newMuted);
    setBgmMuted(newMuted);

    // Mute/unmute all audio
    if (mainBgmRef.current) {
      mainBgmRef.current.muted = newMuted;
      if (newMuted) {
        mainBgmRef.current.pause();
      } else if (!isGachaOpen && !isMultiGachaOpen) {
        mainBgmRef.current.play().catch(console.log);
      }
    }
    if (pickBgmRef.current) {
      pickBgmRef.current.muted = newMuted;
    }
    if (cardBgmRef.current) {
      cardBgmRef.current.muted = newMuted;
    }
  };

  // Initialize background music
  useEffect(() => {
    // Main BGM - preload metadata only for faster initial load
    const mainAudio = new Audio();
    mainAudio.src = "/log_bgm.mp3";
    mainAudio.preload = "metadata";
    mainAudio.loop = true;
    mainAudio.volume = 0.3;
    mainAudio.muted = isBgmMuted;
    mainBgmRef.current = mainAudio;

    // Pick BGM - preload auto for immediate playback when needed
    const pickAudio = new Audio();
    pickAudio.src = "/pick_bgm.mp3";
    pickAudio.preload = "auto";
    pickAudio.loop = false;
    pickAudio.volume = 0.3;
    pickAudio.muted = isBgmMuted;
    pickBgmRef.current = pickAudio;

    // Card BGM - preload auto for seamless transition
    const cardAudio = new Audio();
    cardAudio.src = "/card_bgm.mp3";
    cardAudio.preload = "auto";
    cardAudio.loop = false;
    cardAudio.volume = 0.3;
    cardAudio.muted = isBgmMuted;
    cardBgmRef.current = cardAudio;

    let audioInitialized = false;

    // Play main BGM on first user interaction (only if not muted)
    const handleInteraction = () => {
      if (!audioInitialized && mainBgmRef.current && !isBgmMuted) {
        mainBgmRef.current.play().catch((error) => {
          console.log("Audio autoplay prevented:", error);
        });
        audioInitialized = true;
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("keydown", handleInteraction);
      }
    };

    // Try to play immediately (may be blocked by browser)
    if (!isBgmMuted) {
      mainBgmRef.current
        .play()
        .then(() => {
          audioInitialized = true;
          document.removeEventListener("click", handleInteraction);
          document.removeEventListener("keydown", handleInteraction);
        })
        .catch(() => {
          // If autoplay is blocked, wait for user interaction
          console.log("Autoplay blocked, waiting for user interaction");
          document.addEventListener("click", handleInteraction);
          document.addEventListener("keydown", handleInteraction);
        });
    }

    return () => {
      if (mainBgmRef.current) {
        mainBgmRef.current.pause();
        mainBgmRef.current.currentTime = 0;
      }
      if (pickBgmRef.current) {
        pickBgmRef.current.pause();
        pickBgmRef.current.currentTime = 0;
      }
      if (cardBgmRef.current) {
        cardBgmRef.current.pause();
        cardBgmRef.current.currentTime = 0;
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [isBgmMuted]);

  // BGM control functions
  const stopMainBgm = () => {
    if (mainBgmRef.current && !mainBgmRef.current.paused) {
      mainBgmRef.current.pause();
    }
  };

  const playPickBgm = () => {
    if (pickBgmRef.current) {
      pickBgmRef.current.currentTime = 0;
      pickBgmRef.current.play().catch((error) => {
        console.log("Pick BGM play failed:", error);
      });
    }
  };

  const resumeMainBgm = () => {
    if (mainBgmRef.current) {
      mainBgmRef.current.play().catch((error) => {
        console.log("Main BGM resume failed:", error);
      });
    }
  };

  const stopAllBgmsExceptMain = () => {
    if (pickBgmRef.current) {
      pickBgmRef.current.pause();
      pickBgmRef.current.currentTime = 0;
    }
    if (cardBgmRef.current) {
      cardBgmRef.current.pause();
      cardBgmRef.current.currentTime = 0;
    }
  };

  const restartPickBgm = () => {
    if (cardBgmRef.current && !cardBgmRef.current.paused) {
      cardBgmRef.current.pause();
      cardBgmRef.current.currentTime = 0;
    }
    playPickBgm();
  };

  return {
    isBgmMuted,
    toggleBgmMute,
    mainBgmRef,
    pickBgmRef,
    cardBgmRef,
    stopMainBgm,
    playPickBgm,
    resumeMainBgm,
    stopAllBgmsExceptMain,
    restartPickBgm,
  };
}
