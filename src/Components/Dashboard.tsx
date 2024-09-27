import React, { useState, useEffect, useRef } from "react";

type WordType = string[]; // To type the words array

const Dashboard = () => {
  // Define word sets
  const easyWords: WordType = [
    "cat",
    "dog",
    "sun",
    "book",
    "pen",
    "tree",
    "fish",
    "milk",
    "ball",
    "hat",
    "car",
    "bike",
    "bird",
    "cup",
    "box",
    "key",
    "star",
    "apple",
    "desk",
    "chair",
    "home",
    "door",
    "frog",
    "lamp",
    "shoe",
    "flag",
    "note",
    "coin",
    "ring",
    "map",
    "sky",
    "leaf",
    "bird",
    "rope",
    "bed",
    "bowl",
    "hat",
    "bell",
    "drum",
    "sand",
    "wave",
    "hill",
    "snow",
    "rain",
    "wind",
    "moon",
    "star",
    "cloud",
    "rock",
    "grass",
    "fish",
    "frog",
    "ant",
    "duck",
    "goat",
    "wolf",
    "cow",
    "sheep",
    "hen",
    "owl",
  ];
  const mediumWords: WordType = [
    "water",
    "food",
    "cake",
    "bread",
    "grass",
    "stone",
    "cloud",
    "rain",
    "snow",
    "wind",
    "fire",
    "light",
    "dark",
    "cold",
    "warm",
    "earth",
    "moon",
    "night",
    "day",
    "happy",
    "smile",
    "laugh",
    "dance",
    "sing",
    "play",
    "write",
    "read",
    "speak",
    "listen",
    "think",
    "river",
    "forest",
    "mountain",
    "desert",
    "valley",
    "garden",
    "ocean",
    "field",
    "lake",
    "pond",
    "street",
    "house",
    "school",
    "market",
    "church",
    "bridge",
    "park",
    "shop",
    "hotel",
    "theater",
    "sunset",
    "sunrise",
    "morning",
    "evening",
    "afternoon",
    "nightfall",
    "twilight",
    "dawn",
    "noon",
    "midnight",
  ];
  const hardWords: WordType = [
    "algorithm",
    "telescope",
    "philosophy",
    "revolution",
    "microscope",
    "electricity",
    "imagination",
    "psychology",
    "hypothesis",
    "civilization",
    "architecture",
    "environment",
    "biodiversity",
    "metamorphosis",
    "photosynthesis",
    "cryptocurrency",
    "artificial",
    "intelligence",
    "nanotechnology",
    "sustainability",
    "extraterrestrial",
    "collaboration",
    "entrepreneurship",
    "biotechnology",
    "infrastructure",
    "globalization",
    "renaissance",
    "productivity",
    "consciousness",
    "technological",
    "transcendence",
    "paradigm",
    "theoretical",
  ];

  // State declarations with types
  const [words, setWords] = useState<WordType>(easyWords);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalChars, setTotalChars] = useState<number>(0);
  const [isTimerStarted, setIsTimerStarted] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
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
    setTimeLeft(timerDuration);
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
      setTimeLeft((prevTime) => {
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
      <div id="timer">{timeLeft}</div>
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
        <div id="result-card">
          <h2>Results</h2>
          <p>
            WPM: <span>{wpm}</span>
          </p>
          <p>
            Accuracy: <span>{accuracy}%</span>
          </p>
          <button id="close-result-btn" onClick={resetGame}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
