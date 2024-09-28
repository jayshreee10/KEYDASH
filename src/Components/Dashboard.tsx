import React, { useState, useEffect, useRef } from "react";
import { easyWords, mediumWords, hardWords, WordType } from "../Utility/words";
import ResultModal from "./ResultModal";

const Dashboard = () => {
  // Define word sets

  // State declarations with types
  const [words, setWords] = useState<WordType>(easyWords);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalChars, setTotalChars] = useState<number>(0);
  const [isTimerStarted, setIsTimerStarted] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  const startTime = useRef<number | null>(null); // UseRef to hold start time

  // Utility function to shuffle words
  const shuffleWords = (array: WordType): WordType => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Initialize game
  const init = () => {
    setWords(shuffleWords([...words]));
    resetGame();
  };

  // Reset the game
  const resetGame = () => {
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setCorrectChars(0);
    setTotalChars(0);
    setIsTimerStarted(false);
    setShowResult(false);
    document.addEventListener("keydown", handleTyping);
  };

  // Handle typing events
  const handleTyping = (e: KeyboardEvent) => {
    if (!isTimerStarted && e.key.length === 1) {
      startTimer();
      setIsTimerStarted(true);
    }

    const currentWord = words[currentWordIndex];
    const currentChar = currentWord[currentCharIndex];

    if (e.key === "Backspace") {
      handleBackspace();
    } else if (e.key === currentChar) {
      handleCorrectChar();
    } else if (e.key === " " && currentCharIndex === currentWord.length) {
      handleWordComplete();
    } else if (e.key.length === 1) {
      handleIncorrectChar();
    }
  };

  // Handle backspace event
  const handleBackspace = () => {
    if (currentCharIndex > 0) {
      setCurrentCharIndex((prev) => prev - 1);
      setTotalChars((prev) => prev - 1);
    } else if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1);
      setCurrentCharIndex(words[currentWordIndex].length - 1);
      setTotalChars((prev) => prev - 1);
    }
  };

  // Handle correct character typing
  const handleCorrectChar = () => {
    setCorrectChars((prev) => prev + 1);
    setTotalChars((prev) => prev + 1);
    setCurrentCharIndex((prev) => prev + 1);
  };

  // Handle incorrect character typing
  const handleIncorrectChar = () => {
    setTotalChars((prev) => prev + 1);
    setCurrentCharIndex((prev) => prev + 1);
  };

  // Handle word completion (space bar)
  const handleWordComplete = () => {
    setCurrentWordIndex((prev) => prev + 1);
    setCurrentCharIndex(0);
  };

  // Start the timer for the typing test
  const startTimer = () => {
    startTime.current = Date.now();
    const timer = setInterval(() => {
      setTimerDuration((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endGame();
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // End the game and calculate results
  const endGame = () => {
    document.removeEventListener("keydown", handleTyping);
    const elapsedTime = (Date.now() - (startTime.current || 0)) / 1000;
    const elapsedMinutes = elapsedTime / 60;
    setWpm(Math.round(correctChars / 5 / elapsedMinutes));
    setAccuracy(parseFloat(((correctChars / totalChars) * 100).toFixed(2)));
    setShowResult(true);
  };

  // On first render, initialize the game
  useEffect(() => {
    init();
    return () => document.removeEventListener("keydown", handleTyping);
  }, []);

  return (
    <div className="container">
      <header>
        <span>KeyDash</span>
        <nav>
          <ul id="time-options">
            <li
              id="15"
              onClick={() => {
                setTimerDuration(15);
              }}
            >
              15s
            </li>
            <li
              id="30"
              onClick={() => {
                setTimerDuration(30);
              }}
            >
              30s
            </li>
            <li
              id="60"
              onClick={() => {
                setTimerDuration(60);
              }}
            >
              60s
            </li>
          </ul>
        </nav>
        <nav>
          <ul id="level-options">
            <li
              id="easy"
              onClick={() => {
                setWords(easyWords);
              }}
            >
              Easy
            </li>
            <li
              id="medium"
              onClick={() => {
                setWords(mediumWords);
              }}
            >
              Medium
            </li>
            <li
              id="hard"
              onClick={() => {
                setWords(hardWords);
              }}
            >
              Hard
            </li>
          </ul>
        </nav>
      </header>

      <div id="timer">{timerDuration}</div>
      <div id="words-display">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="word">
            {word.split("").map((char, charIndex) => (
              <span
                key={charIndex}
                className={`char ${
                  currentWordIndex === wordIndex &&
                  currentCharIndex === charIndex
                    ? "current"
                    : ""
                }`}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>
      <button id="restart-btn" onClick={resetGame}>
        Restart
      </button>

      {showResult && (
        <ResultModal wpm={wpm} accuracy={accuracy} resetGame={resetGame} />
      )}
    </div>
  );
};

export default Dashboard;
