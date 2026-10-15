import { useReducer, useEffect } from "react";

const initialState = { index: 0, isPlaying: false, speed: 50 };

function reducer(state, action) {
  switch (action.type) {
    case "next": {
      const index = Math.min(state.index + 1, action.last);
      return {
        ...state,
        index,
        isPlaying: index === action.last ? false : state.isPlaying,
      };
    }
    case "prev":
      return { ...state, index: Math.max(state.index - 1, 0), isPlaying: false };
    case "play":
      return {
        ...state,
        index: state.index >= action.last ? 0 : state.index,
        isPlaying: true,
      };
    case "pause":
      return { ...state, isPlaying: false };
    case "reset":
      return { ...state, index: 0, isPlaying: false };
    case "setSpeed":
      return { ...state, speed: action.speed };
    default:
      return state;
  }
}

export function usePlayback(steps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const last = Math.max(steps.length - 1, 0);
  const delay = 510 - state.speed * 5;

  useEffect(() => {
    dispatch({ type: "reset" });
  }, [steps]);

  useEffect(() => {
    if (!state.isPlaying) return;
    const id = setTimeout(() => dispatch({ type: "next", last }), delay);
    return () => clearTimeout(id);
  }, [state.isPlaying, state.index, delay, last]);

  return {
    step: steps[Math.min(state.index, last)],
    index: state.index,
    last,
    isPlaying: state.isPlaying,
    speed: state.speed,
    play: () => dispatch({ type: "play", last }),
    pause: () => dispatch({ type: "pause" }),
    next: () => dispatch({ type: "next", last }),
    prev: () => dispatch({ type: "prev" }),
    reset: () => dispatch({ type: "reset" }),
    setSpeed: (speed) => dispatch({ type: "setSpeed", speed }),
  };
}