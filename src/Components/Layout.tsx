function Layout() {
  return (
    <div className="container">
      <div id="timer">10</div>
      <div id="words-display">hello</div>
      <button id="restart-btn">Restart</button>

      <div id="result-card">
        <h2>Results</h2>
        <p>
          WPM: <span>wpm</span>
        </p>
        <p>
          Accuracy: <span>%</span>
        </p>
        <button id="close-result-btn">Close</button>
      </div>
    </div>
  );
}

export default Layout;
