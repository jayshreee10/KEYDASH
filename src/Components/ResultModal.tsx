type ResultModalProps = {
  wpm: any;
  accuracy: any;
  resetGame: any;
};
function ResultModal({ wpm, accuracy, resetGame }: ResultModalProps) {
  return (
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
  );
}

export default ResultModal;
