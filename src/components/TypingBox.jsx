import { useState } from "react";

export default function TypingBox({
  hasStarted,
  words,
  input,
  seconds,
  isFinished,
  inputRef,
  onChange,
  onContainerClick,
  onRestart,
}) {
  const [showOverlay, setShowOverlay] = useState(
    window.matchMedia("(hover: none) and (pointer: coarse)").matches,
  );

  function handleOverlayClick(e) {
    e.stopPropagation();
    setShowOverlay(false);
    inputRef.current?.focus();
  }

  return (
    <div
      className="typing-box"
      onClick={onContainerClick}
    >
      <div className="typing-toolbar">
        <div className="timer">00:{seconds}</div>

        <button
          className="typing-restart"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRestart();
          }}
          aria-label="Restart test"
          title="Restart test"
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
        </button>
      </div>

      {showOverlay && !hasStarted && (
        <div
          className="tap-to-type"
          onClick={handleOverlayClick}
        >
          Tap to start typing
        </div>
      )}

      <div className="words-display">
        {words.split("").map((char, index) => {
          let charClass = "char-untyped";

          if (index < input.length) {
            charClass =
              char === input[index] ? "char-correct" : "char-incorrect";
          }

          const isCurrent = index === input.length;

          return (
            <span
              key={index}
              className={`char ${charClass}`}
            >
              {isCurrent && <span className="caret" />}
              {char}
            </span>
          );
        })}
      </div>

      <textarea
        ref={inputRef}
        value={input}
        onChange={onChange}
        className="hidden-input"
        disabled={isFinished}
        autoFocus
        maxLength={words.length}
      />
    </div>
  );
}
