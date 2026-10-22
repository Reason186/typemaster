export default function TypingBox({
  words,
  input,
  seconds,
  isFinished,
  inputRef,
  onChange,
  onContainerClick,
}) {
  return (
    <div
      className="typing-box"
      onClick={onContainerClick}
    >
      <div className="timer">00:{seconds}</div>

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
