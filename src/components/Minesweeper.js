import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Minesweeper.module.css';
import mine1 from '../assets/light.png'; // Mine that takes 1 life
import mine2 from '../assets/mine2.png'; // Mine that ends game instantly
import extraLife from '../assets/extraLife.png'; // Square that gives 1 more life
import flag from '../assets/markedMine.png'; // Image for marking a potential mine
import screamAudio from '../assets/scream.mp3'; // Scream audio file

const levels = {
  easy: { size: 5, mines: 5, mine2Count: 0 },
  medium: { size: 7, mines: 10, mine2Count: 1 },
  hard: { size: 9, mines: 17, mine2Count: 4 },
};

const Minesweeper = () => {
  const [level, setLevel] = useState('easy');
  const [grid, setGrid] = useState([]);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [jumpscare, setJumpscare] = useState(false);

  useEffect(() => {
    resetGame();
  }, [level]);

  const resetGame = () => {
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setJumpscare(false);
    const { size, mines, mine2Count } = levels[level];
    const newGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({ type: 'empty', revealed: false, adjacentMines: 0, flagged: false }))
    );

    // Place mine2 mines
    let placedMine2 = 0;
    while (placedMine2 < mine2Count) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (newGrid[x][y].type === 'empty') {
        newGrid[x][y].type = 'mine2';
        placedMine2++;
      }
    }

    // Place remaining mines
    let placedMines = 0;
    while (placedMines < mines - mine2Count) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (newGrid[x][y].type === 'empty') {
        newGrid[x][y].type = 'mine1';
        placedMines++;
      }
    }

    // Place extra life squares
    placeSpecialSquare(newGrid, 'extraLife');

    // Calculate adjacent mines
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (newGrid[x][y].type === 'empty') {
          newGrid[x][y].adjacentMines = countAdjacentMines(newGrid, x, y);
        }
      }
    }

    setGrid(newGrid);
  };

  const placeSpecialSquare = (grid, type) => {
    const { size } = levels[level];
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (grid[x][y].type === 'empty') {
        grid[x][y].type = type;
        placed = true;
      }
    }
  };

  const countAdjacentMines = (grid, x, y) => {
    const { size } = levels[level];
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
          if (grid[newX][newY].type === 'mine1' || grid[newX][newY].type === 'mine2') {
            count++;
          }
        }
      }
    }
    return count;
  };

  const handleClick = (x, y) => {
    if (gameOver || gameWon || grid[x][y].revealed || grid[x][y].flagged) return;

    const newGrid = [...grid];
    revealSquare(newGrid, x, y);

    setGrid(newGrid);
    checkWin(newGrid);
  };

  const handleRightClick = (e, x, y) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[x][y].revealed) return;

    const newGrid = [...grid];
    newGrid[x][y].flagged = !newGrid[x][y].flagged;

    setGrid(newGrid);
  };

  const revealSquare = (grid, x, y) => {
    if (grid[x][y].revealed) return;

    grid[x][y].revealed = true;

    switch (grid[x][y].type) {
      case 'mine1':
        setLives(lives - 1);
        if (lives - 1 <= 0) setGameOver(true);
        break;
      case 'mine2':
        triggerJumpscare();
        setGameOver(true);
        break;
      case 'extraLife':
        setLives(lives + 1);
        break;
      default:
        if (grid[x][y].adjacentMines === 0) {
          revealAdjacentSquares(grid, x, y);
        }
        break;
    }
  };

  const revealAdjacentSquares = (grid, x, y) => {
    const { size } = levels[level];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
          if (!grid[newX][newY].revealed && grid[newX][newY].type === 'empty') {
            revealSquare(grid, newX, newY);
          }
        }
      }
    }
  };

  const triggerJumpscare = () => {
    setJumpscare(true);
    const audio = new Audio(screamAudio);
    audio.play();
    setTimeout(() => {
      setJumpscare(false);
    }, 1000); // Adjust the duration as needed
  };

  const checkWin = (grid) => {
    const { size } = levels[level];
    let won = true;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (grid[x][y].type === 'empty' && !grid[x][y].revealed) {
          won = false;
          break;
        }
      }
    }
    if (won) {
      setGameWon(true);
    }
  };

  return (
    <div className={styles.minesweeper}>
      <h2>🎃 Halloween Minesweeper 🎃</h2>
      <div className={styles.controls}>
        <label>
          Level:
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={styles.levelSelect}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <div className={styles.lives}>Lives: {lives}</div>
        {gameOver && <div className={styles.gameOver}>Game Over</div>}
        {gameWon && <div className={styles.gameWon}>You Won!</div>}
        <button onClick={resetGame} className={styles.resetButton}>Reset Game</button>
        <Link to="/" className={styles.resetButton}>Home</Link>
      </div>
      <div className={styles.board}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                className={`${styles.square} ${cell.revealed ? styles.revealed : ''} ${cell.type === 'extraLife' ? styles.special : ''}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              >
                {cell.flagged ? (
                  <img src={flag} alt="Flag" />
                ) : cell.revealed ? (
                  cell.type === 'empty' ? (
                    <span className={styles.number}>{cell.adjacentMines > 0 ? cell.adjacentMines : ''}</span>
                  ) : (
                    <img
                      src={
                        cell.type === 'mine1'
                          ? mine1
                          : cell.type === 'mine2'
                          ? mine2
                          : cell.type === 'extraLife'
                          ? extraLife
                          : null
                      }
                      alt={cell.type}
                    />
                  )
                ) : null}
              </button>
            ))}
          </div>
        ))}
      </div>
      {jumpscare && (
        <div className={styles.jumpscare}>
          <img src={mine2} alt="Jumpscare" className={styles.jumpscareImage} />
        </div>
      )}
      
    </div>
  );
};

export default Minesweeper;