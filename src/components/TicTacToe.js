import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TicTacToe.module.css'; // Import CSS module
import pumpkin from '../assets/pumpkin.png';
import skull from '../assets/skull.png';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [moveHistory, setMoveHistory] = useState({ pumpkin: [], skull: [] });
  const [winningLine, setWinningLine] = useState([]);
  const navigate = useNavigate();

  const handleClick = (index) => {
    const boardCopy = [...board];
    if (calculateWinner(board) || boardCopy[index]) return;

    const currentPlayer = xIsNext ? 'pumpkin' : 'skull';
    const playerMoves = moveHistory[currentPlayer];

    // If player already has 3 marks on the board, remove the oldest move
    if (playerMoves.length === 3) {
      const [firstMove, ...rest] = playerMoves;
      boardCopy[firstMove] = null; // Clear the first move
      setMoveHistory({
        ...moveHistory,
        [currentPlayer]: [...rest, index], // Update moves with new move added
      });
    } else {
      setMoveHistory({
        ...moveHistory,
        [currentPlayer]: [...playerMoves, index], // Simply add new move
      });
    }

    boardCopy[index] = currentPlayer;
    setBoard(boardCopy);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(boardCopy);
    if (winner) {
      setWinningLine(winner.line);
    }
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setMoveHistory({ pumpkin: [], skull: [] });
    setWinningLine([]);
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner.player}` : `Next player: ${xIsNext ? 'Pumpkin' : 'Skull'}`;

  return (
    <div className={styles.ticTacToe}>
      <h2>Tic-Tac-Toe</h2>
      <div className={styles.board}>
        {board.map((value, index) => (
          <button
            key={index}
            className={`${styles.square} ${winningLine.includes(index) ? styles.winningSquare : ''}`}
            onClick={() => handleClick(index)}
          >
            {value && <img src={value === 'pumpkin' ? pumpkin : skull} alt={value} />}
          </button>
        ))}
      </div>
      <div className={styles.status}>{status}</div>
      {winner && <button className={styles.restartButton} onClick={handleRestart}>Restart</button>}
      <button className={styles.homeButton} onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line };
    }
  }
  return null;
}

export default TicTacToe;