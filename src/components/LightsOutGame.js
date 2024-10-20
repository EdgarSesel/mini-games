import React, { useState, useEffect } from 'react';
import styles from './LightsOutGame.module.css';
import pumpkin from '../assets/pumpkin.png'; // Update with any Halloween-themed image

const LightsOutGame = () => {
  const [grid, setGrid] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const resetGame = () => {
    setTimer(0);
    const maxMarks = 10;
    let count = 0;
    const newGrid = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => {
        if (count < maxMarks && Math.random() < 0.4) {
          count++;
          return 1;
        }
        return 0;
      })
    );
    setGrid(newGrid);
  };

  const toggleSquare = (x, y) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        if (
          (rowIndex === x && colIndex === y) ||
          (rowIndex === x - 1 && colIndex === y) ||
          (rowIndex === x + 1 && colIndex === y) ||
          (rowIndex === x && colIndex === y - 1) ||
          (rowIndex === x && colIndex === y + 1)
        ) {
          return value ? 0 : 1;
        }
        return value;
      })
    );
    setGrid(newGrid);
  };

  const isGameWon = grid.every(row => row.every(value => value === 0));

  return (
    <div className={styles.lightsOutGame}>
      <div className={styles.gameContainer}>
        <div className={styles.gameBoard}>
          <h1 className={styles.title}>🎃 Halloween Lights Out 🎃</h1>
          <p className={styles.timer}>Time: {timer} seconds</p>
          <div className={styles.board}>
            {grid.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((value, colIndex) => (
                  <button
                    key={colIndex}
                    className={`${styles.square} ${value ? styles.lit : ''}`}
                    onClick={() => toggleSquare(rowIndex, colIndex)}
                  >
                    {value ? <img src={pumpkin} alt="Pumpkin" /> : null}
                  </button>
                ))}
              </React.Fragment>
            ))}
          </div>
          {isGameWon && <div className={styles.winMessage}>🎉 You Won! 🎉</div>}
          <button className={styles.restartButton} onClick={resetGame}>Reset Game</button>
          
        </div>
        <div className={styles.gameRules}>
          <h3>Rules & Tips</h3>
          <p>The goal of the game is to turn off all the lights (pumpkins).</p>
          <ul>
            <li>Clicking a square will toggle it and its adjacent squares.</li>
            <li>Plan your moves carefully to turn off all the lights.</li>
            <li>Try to solve the puzzle in the least amount of time.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LightsOutGame;