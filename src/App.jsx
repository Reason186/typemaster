import WORD_POOL from "./words.json" with { type: "json" };
import "./App.css";
import Results from "./components/Results";
import TypingBox from "./components/TypingBox";
import { useEffect, useRef, useState } from "react";
import rojanTrack from "./assets/10 Cr. - Rojan.mp3";

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
  const [words, setWords] = useState(generateOfflineTest(50));
  const [input, setInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  const accuracy = Math.round((correctChars / input.length) * 100);
  const wpm = Math.round(correctChars / 5 / 0.5);
  const seconds = String(timeLeft).padStart(2, "0");

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const audioElementRef = useRef(null);

  useEffect(function () {
    inputRef.current?.focus();
  }, []);

  useEffect(
    function () {
      if (!hasStarted) return;

      timerRef.current = setInterval(function () {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return function () {
        clearInterval(timerRef.current);
      };
    },
    [hasStarted],
  );

  useEffect(
    function () {
      if (isFinished) {
        audioElementRef.current.play();
      }
    },
    [isFinished],
  );

  function handleChange(e) {
    if (timeLeft === 0) return;
    const value = e.target.value;

    if (value.length === words.length) {
      setIsFinished(true);
    }

    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === words[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    setCorrectChars(correct);
    setIncorrectChars(incorrect);

    setInput(value);
    if (!hasStarted && value.length > 0) {
      setHasStarted(true);
    }
  }

  function handleContainerClick() {
    inputRef.current?.focus();
  }

  function handleRestart() {
    setTimeLeft(30);
    setInput("");
    setIsFinished(false);
    setHasStarted(false);
    setWords(generateOfflineTest(50));
  }

  return (
    <div className="app-container">
      {!isFinished && (
        <TypingBox
          words={words}
          input={input}
          seconds={seconds}
          isFinished={isFinished}
          inputRef={inputRef}
          onChange={handleChange}
          onContainerClick={handleContainerClick}
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

      <audio
        src={rojanTrack}
        ref={audioElementRef}
      ></audio>
    </div>
  );
}
