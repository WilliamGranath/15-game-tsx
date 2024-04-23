import React from "react";
import "./Winner.css";

interface WinnerProps {
  onNewGame: () => void; //
}

const Winner: React.FC<WinnerProps> = ({ onNewGame }) => {
  const handleNewGameClick = () => {
    onNewGame(); // kalla function för new game
  };

  return (
    <div className="winner-container">
      <h1>Congratulations! You Won!</h1>
      <button className="btn" onClick={handleNewGameClick}>
        New Game
      </button>
    </div>
  );
};

export default Winner;
