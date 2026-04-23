// frontend/src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState("1 3 1\n1 5 1\n4 2 1");
  const [grid, setGrid] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- NEW: RANDOM GRID GENERATOR ---
  const generateRandomGrid = () => {
    const rows = 8; // Size of grid
    const cols = 8;
    let randomString = "";
    
    for(let i=0; i<rows; i++) {
        let rowStr = [];
        for(let j=0; j<cols; j++) {
            // Random cost between 1 and 20
            rowStr.push(Math.floor(Math.random() * 20) + 1);
        }
        randomString += rowStr.join(" ") + "\n";
    }
    setInputText(randomString.trim());
    setResult(null); // Clear old results
    setGrid([]);     // Clear old visual
  };

  // --- API CALL ---
  const calculatePath = async () => {
    setLoading(true);
    // Parse the text box into a 2D array
    const currentRows = inputText.trim().split("\n");
    const currentGrid = currentRows.map(row => 
        row.trim().split(/\s+/).map(num => Number(num))
    );
    setGrid(currentGrid);

    try {
      const response = await fetch('https://dsa-dp-pathfinder.onrender.com/api/calculate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid: currentGrid }),
      });
      const data = await response.json();
      setResult(data); 
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const isPath = (r, c) => {
    if (!result || !result.path) return false;
    return result.path.some(coord => coord[0] === r && coord[1] === c);
  };

  return (
    <div className="App">
      <header>
        <h1> DP DUNGEOUN PATHFINDER</h1>
        <p>Dynamic Programming (Min Path Sum) Visualizer</p>
      </header>
      
      <div className="container">
        {/* LEFT PANEL */}
        <div className="control-panel">
          <h3>1. Create Map</h3>
          <p>Enter costs manually or randomize:</p>
          
          <div className="button-group">
            <button className="btn-secondary" onClick={generateRandomGrid}>
              🎲 RANDOM MAP
            </button>
            <button className="btn-primary" onClick={calculatePath}>
              🚀 FIND MIN PATH
            </button>
          </div>

          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="visual-panel">
          <h3>2. Result</h3>
          {result && (
            <div className="stats-box">
                <span><strong>Min Cost:</strong> {result.minCost}</span>
                <span><strong>Steps:</strong> {result.path.length}</span>
            </div>
          )}
          
          <div 
            className="grid-container"
            style={{ 
                gridTemplateColumns: `repeat(${grid[0]?.length || 1}, 1fr)` 
            }}
          >
            {grid.map((row, rIndex) => (
              row.map((cellVal, cIndex) => (
                <div 
                  key={`${rIndex}-${cIndex}`}
                  className={`grid-cell ${isPath(rIndex, cIndex) ? 'path-active' : ''}`}
                  // Add delay based on distance to animate the path walking
                  style={{ transitionDelay: `${(rIndex + cIndex) * 50}ms` }} 
                >
                  {cellVal}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;