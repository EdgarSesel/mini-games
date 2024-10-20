import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HauntedHouse.module.css';
import screamSound from '../assets/scream.mp3'; // Scream sound effect
import despairSound from '../assets/despair.mp3'; // Despair sound effect
import jumpscareImage from '../assets/jumpscare.png'; // Example jumpscare image
import doorImage from '../assets/door.png'; // Door image

const exercises = [
  { question: "What is 5 + 3?", answer: "8" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is 12 * 2?", answer: "24" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
  { question: "What is 15 / 3?", answer: "5" },
  { question: "What is the square root of 64?", answer: "8" },
  { question: "What is the chemical symbol for water?", answer: "H2O" },
  { question: "What is the speed of light in vacuum (m/s)?", answer: "300000000" },
  { question: "What is the capital of Japan?", answer: "Tokyo" },
  { question: "What is 9 + 10?", answer: "19" }
];

const HauntedHouse = () => {
  const [room, setRoom] = useState(0);
  const [hasKey, setHasKey] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [timer, setTimer] = useState(300); // 5 minutes to escape
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [ghostEncounter, setGhostEncounter] = useState(false);
  const [woops, setWoops] = useState(false);
  const [woopsRotation, setWoopsRotation] = useState(0);
  const [solvedRooms, setSolvedRooms] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [doorShake, setDoorShake] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState(false); // New state for correct answer indication
  const audioRef = useRef(new Audio(despairSound));

  const rooms = Array.from({ length: 10 }, (_, i) => `Room ${i + 1}`);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => Math.max(prev - (ghostEncounter ? 4 : 1), 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [ghostEncounter]);

  useEffect(() => {
    if (timer <= 0) {
      setGameOver(true);
    }
  }, [timer]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    if (soundEnabled) {
      audio.play().catch(error => console.log(error));
    } else {
      audio.pause();
    }
    return () => audio.pause();
  }, [soundEnabled]);

  const handleMove = (newRoom) => {
    if (solvedRooms.includes(room)) {
      if (newRoom === room) return; // If the same room, do nothing

      if (newRoom === -1) {
        // If moving to the previous room from the first room
        setTimer(prev => Math.max(prev - 10, 0));
        setWoopsRotation(Math.random() * 60 - 30); // Random rotation between -30 and 30 degrees
        setWoops(true);
        setTimeout(() => setWoops(false), 1000);
      } else {
        setRoom(newRoom);
        triggerGhostEncounter();
      }
    } else {
      setDoorShake(true);
      setTimeout(() => setDoorShake(false), 500);
    }
  };

  const handleCollectKey = () => {
    setHasKey(true);
    setInventory([...inventory, 'key']);
  };

  const triggerGhostEncounter = () => {
    if (Math.random() < 0.2) { // 20% chance of ghost encounter
      const audio = new Audio(screamSound);
      audio.play();
      setShowJumpscare(true);
      setGhostEncounter(true);
      setTimeout(() => {
        setShowJumpscare(false);
      }, 1000); // Show jumpscare for 1 second
    } else {
      setGhostEncounter(false);
    }
  };

  const shuffleDoors = () => {
    const doors = [room + 1, room + 1, room - 1];
    for (let i = doors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doors[i], doors[j]] = [doors[j], doors[i]];
    }
    return doors;
  };

  const doors = shuffleDoors();

  const handleAnswerSubmit = () => {
    if (currentAnswer.toLowerCase() === exercises[room].answer.toLowerCase()) {
      setSolvedRooms([...solvedRooms, room]);
      setCurrentAnswer("");
      setCorrectAnswer(true); // Show correct answer indication
      setTimeout(() => setCorrectAnswer(false), 2000); // Hide after 2 seconds
    } else {
      setTimer(prev => Math.max(prev - 10, 0));
      setWoopsRotation(Math.random() * 60 - 30); // Random rotation between -30 and 30 degrees
      setWoops(true);
      setTimeout(() => setWoops(false), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit();
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const restartGame = () => {
    setRoom(0);
    setHasKey(false);
    setInventory([]);
    setTimer(300);
    setShowJumpscare(false);
    setGameOver(false);
    setGhostEncounter(false);
    setWoops(false);
    setWoopsRotation(0);
    setSolvedRooms([]);
    setCurrentAnswer("");
    setDoorShake(false);
  };

  return (
    <div className={styles.hauntedHouse}>
      <h1>🎃 Haunted House Escape 🎃</h1>
      <div className={`${styles.timer} ${woops ? styles.woopsTimer : ''}`}>Time Left: {timer} seconds</div>
      <button onClick={toggleSound} className={styles.soundButton}>
        {soundEnabled ? '🔊' : '🔈'}
      </button>
      {gameOver ? (
        <div className={styles.gameOver}>Game Over! You ran out of time.</div>
      ) : room === 10 ? (
        <div className={styles.gameWon}>Congratulations! You escaped the haunted house!</div>
      ) : (
        <>
          <div className={styles.room}>
            <p>You are in {rooms[room]}.</p>
            <div className={styles.doors}>
              {doors.map((door, index) => (
                <button
                  key={index}
                  onClick={() => handleMove(door)}
                  className={doorShake ? styles.shake : ''}
                >
                  <img src={doorImage} alt="Door" className={styles.doorImage} />
                </button>
              ))}
            </div>
            <p className={styles.question}>{exercises[room].question}</p>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.answerInput}
            />
            <button onClick={handleAnswerSubmit} className={styles.submitButton}>Submit Answer</button>
            {correctAnswer && <div className={styles.correctAnswer}>Correct!</div>} {/* Correct answer indication */}
          </div>
          <div className={styles.inventory}>
            <h3>Inventory</h3>
            <ul>
              {inventory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      {showJumpscare && (
        <div className={styles.jumpscare}>
          <img src={jumpscareImage} alt="Jumpscare" className={styles.jumpscareImage} />
        </div>
      )}
      {woops && (
        <div className={styles.woops} style={{ transform: `translate(-50%, -50%) rotate(${woopsRotation}deg)` }}>
          Woops!
        </div>
      )}
      <div className={styles.buttons}>
        <Link to="/" className={styles.homeButton}>Home</Link>
        <button onClick={restartGame} className={styles.restartButton}>Restart</button>
      </div>
    </div>
  );
};

export default HauntedHouse;