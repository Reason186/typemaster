export default function Results({
  wpm,
  accuracy,
  correct,
  incorrect,
  onRestart,
}) {
  return (
    <div className="results-container">
      <div className="results-header">Result</div>

      {/* Main Stats */}
      <div className="results-grid">
        <div className="stat-box">
          <span className="stat-label">wpm</span>
          <span className="stat-value">{wpm}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">acc</span>
          <span className="stat-value secondary">{accuracy}%</span>
        </div>
      </div>

      {/* Optional Character Breakdown */}
      <div className="stat-breakdown">
        characters: <span className="correct">{correct}</span> /{" "}
        <span className="incorrect">{incorrect}</span>
      </div>

      {/* Restart Button */}
      <button
        className="restart-btn"
        onClick={onRestart}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
        Restart Test
      </button>
    </div>
  );
}
