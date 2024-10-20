// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import tictactoeIcon from '../assets/tic.png';
import lightsOutIcon from '../assets/lightsout.png';
import minesweeperIcon from '../assets/minesweeper.png';
import hauntedHouseIcon from '../assets/hauntedhouse.png'; // Add an icon for HauntedHouse

const Home = () => (
  <div className="home">
    <h1>Welcome to Mini Games!</h1>
    <p>Choose a game from the menu to start playing.</p>
    <div className="games">
      <Link to="/tictactoe" className="game-link">
        <img src={tictactoeIcon} alt="Tic-Tac-Toe" className="game-icon" />
        <span className="game-name">Tic-Tac-Toe</span>
      </Link>
      <Link to="/lightsout" className="game-link">
        <img src={lightsOutIcon} alt="Lights Out" className="game-icon" />
        <span className="game-name">Lights Out</span>
      </Link>
      <Link to="/minesweeper" className="game-link">
        <img src={minesweeperIcon} alt="Minesweeper" className="game-icon" />
        <span className="game-name">Minesweeper</span>
      </Link>
      <Link to="/hauntedhouse" className="game-link">
        <img src={hauntedHouseIcon} alt="Haunted House" className="game-icon" />
        <span className="game-name">Haunted House</span>
      </Link>
    </div>
  </div>
);

export default Home;