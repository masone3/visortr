export default function Controls({
  isPlaying,
  index,
  last,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
}) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "16px 0" }}>
      <button onClick={onReset}>Reset</button>
      <button onClick={onPrev} disabled={index === 0}>Prev</button>
      {isPlaying ? (
        <button onClick={onPause}>Pause</button>
      ) : (
        <button onClick={onPlay}>Play</button>
      )}
      <button onClick={onNext} disabled={index === last}>Next</button>

      <label style={{ marginLeft: 16 }}>
        Speed{" "}
        <input
          type="range"
          min={1}
          max={100}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </label>

      <span style={{ marginLeft: 16 }}>
        Step {index} / {last}
      </span>
    </div>
  );
}