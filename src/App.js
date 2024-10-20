import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import TicTacToe from './components/TicTacToe';
import LightsOutGame from './components/LightsOutGame';
import Minesweeper from './components/Minesweeper';
import HauntedHouse from './components/HauntedHouse';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/lightsout" element={<LightsOutGame />} />
          <Route path="/minesweeper" element={<Minesweeper />} />
          <Route path="/hauntedhouse" element={<HauntedHouse />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;