import React from "react";
import "./Shuffle.css";
interface ShuffleProps {
  onShuffle: () => void;
}

const Shuffle: React.FC<ShuffleProps> = ({ onShuffle }) => {
  return (
    <button className="btn" onClick={onShuffle}>
      Shuffle
    </button>
  );
};

export default Shuffle;
