import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/tictactoe">Tic-Tac-Toe</Link>
    <Link to="/lightsout">Lights Out</Link>
    <Link to="/minesweeper">Minesweeper</Link>
    <Link to="/hauntedhouse">Haunted House</Link>
    
  </nav>
);

export default Navbar;