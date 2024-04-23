// Tiles.tsx
import React from "react";
import "./Tiles.css";

interface Props {
  tiles: number[][];
  onClick: (row: number, col: number) => void;
  checkCorrectPlacement: (value: number, row: number, col: number) => boolean;
}

const Tiles: React.FC<Props> = ({ tiles, onClick, checkCorrectPlacement }) => {
  return (
    <div>
      {tiles.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((tile, colIndex) => (
            <div
              key={colIndex}
              className={`tile ${
                checkCorrectPlacement(tile, rowIndex, colIndex) ? "correct" : ""
              }`}
              onClick={() => onClick(rowIndex, colIndex)}
            >
              {tile !== 0 ? tile : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Tiles;
