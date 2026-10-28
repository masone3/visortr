import { useEffect, useRef } from "react";

const FORM_TAGS = ["INPUT", "SELECT", "TEXTAREA"];

export function usePlaybackShortcuts(playback, enabled) {
  const latest = useRef(playback);

  useEffect(() => {
    latest.current = playback;
  });

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const tag = event.target.tagName;
      if (FORM_TAGS.includes(tag)) return;

      const p = latest.current;

      switch (event.key) {
        case " ":
          if (tag === "BUTTON") return;
          event.preventDefault();
          if (p.isPlaying) p.pause();
          else p.play();
          break;
        case "ArrowRight":
          event.preventDefault();
          p.next();
          break;
        case "ArrowLeft":
          event.preventDefault();
          p.prev();
          break;
        case "r":
        case "R":
          p.reset();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}