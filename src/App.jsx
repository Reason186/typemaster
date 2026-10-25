import WORD_POOL from "./words.json" with { type: "json" };
import "./App.css";
import Results from "./components/Results";
import TypingBox from "./components/TypingBox";
import { useEffect, useRef, useState } from "react";

function generateOfflineTest(wordCount = 25) {
  const selectedWords = [];

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * WORD_POOL.length);
    selectedWords.push(WORD_POOL[randomIndex]);
  }

  return selectedWords.join(" ");
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [words, setWords] = useState(() => generateOfflineTest(50));
  const [input, setInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const totalAttempts = correctChars + incorrectChars;

  const accuracy =
    totalAttempts > 0 ? Math.round((correctChars / totalAttempts) * 100) : 0;

  const wpm =
    elapsedSeconds > 0
      ? Math.round(correctChars / 5 / (elapsedSeconds / 60))
      : 0;

  const seconds = String(timeLeft).padStart(2, "0");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!hasStarted || isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setElapsedSeconds((Date.now() - startTimeRef.current) / 1000);
          setIsFinished(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [hasStarted, isFinished]);

  function handleChange(e) {
    if (isFinished || timeLeft === 0) return;

    const value = e.target.value;

    if (!hasStarted && value.length > 0) {
      startTimeRef.current = Date.now();
      setHasStarted(true);
    }

    // Count newly entered characters, but not deletions.
    let prefix = 0;

    while (
      prefix < input.length &&
      prefix < value.length &&
      input[prefix] === value[prefix]
    ) {
      prefix++;
    }

    let oldEnd = input.length;
    let newEnd = value.length;

    while (
      oldEnd > prefix &&
      newEnd > prefix &&
      input[oldEnd - 1] === value[newEnd - 1]
    ) {
      oldEnd--;
      newEnd--;
    }

    const inserted = value.slice(prefix, newEnd);

    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i < inserted.length; i++) {
      if (inserted[i] === words[prefix + i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    if (inserted.length > 0) {
      setCorrectChars((prev) => prev + correct);
      setIncorrectChars((prev) => prev + incorrect);
    }

    setInput(value);

    if (value.length === words.length) {
      setElapsedSeconds((Date.now() - startTimeRef.current) / 1000);
      setIsFinished(true);
    }
  }

  function handleContainerClick() {
    inputRef.current?.focus();
  }

  function handleRestart() {
    clearInterval(timerRef.current);
    startTimeRef.current = null;

    setTimeLeft(30);
    setInput("");
    setHasStarted(false);
    setIsFinished(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setElapsedSeconds(0);
    setWords(generateOfflineTest(50));
  }

  return (
    <div className="app-container">
      {!isFinished && (
        <TypingBox
          hasStarted={hasStarted}
          words={words}
          input={input}
          seconds={seconds}
          isFinished={isFinished}
          inputRef={inputRef}
          onChange={handleChange}
          onContainerClick={handleContainerClick}
          onRestart={handleRestart}
        />
      )}

      {isFinished && (
        <Results
          wpm={wpm}
          accuracy={accuracy}
          correct={correctChars}
          incorrect={incorrectChars}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
