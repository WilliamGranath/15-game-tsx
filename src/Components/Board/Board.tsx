import React, { useState, useEffect } from "react";
import Tiles from "../Tiles/Tiles";
import Shuffle from "../Shuffle/Shuffle";
import Winner from "../Winner/Winner";

const Board: React.FC = () => {
  // State för att hålla brickornas positioner och om spelaren har vunnit
  const [tiles, setTiles] = useState<number[][]>([]);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [initialized, setInitialized] = useState(false);

  // Använd useEffect för att initiera brickorna vid komponentens första renderering
  useEffect(() => {
    initializeTiles();
  }, []);

  // Funktion för att initiera brickorna
  const initializeTiles = () => {
    let initialTiles: number[][] = [];
    let count = 1;
    for (let i = 0; i < 4; i++) {
      const row: number[] = [];
      for (let j = 0; j < 4; j++) {
        row.push(count++);
      }
      initialTiles.push(row);
    }
    initialTiles[3][3] = 0; // Sätt den tomma brickan

    setTiles(initialTiles);
  };

  // Funktion för att blanda brickorna
  const shuffleTiles = () => {
    // Skapa en kopia av brickorna
    const shuffledTiles = tiles.map((row) => [...row]);
    // Slumpmässigt byt plats på brickorna
    for (let i = shuffledTiles.length - 1; i > 0; i--) {
      for (let j = shuffledTiles[i].length - 1; j > 0; j--) {
        const ri = Math.floor(Math.random() * (i + 1));
        const rj = Math.floor(Math.random() * (j + 1));
        const temp = shuffledTiles[i][j];
        shuffledTiles[i][j] = shuffledTiles[ri][rj];
        shuffledTiles[ri][rj] = temp;
      }
    }
    // Gör ytterligare några slumpmässiga byten för att introducera fel
    const maxSwaps = 5; // Justera detta värde efter behov
    let swaps = 0;
    while (swaps < maxSwaps) {
      const row1 = Math.floor(Math.random() * 4);
      const col1 = Math.floor(Math.random() * 4);
      const row2 = Math.floor(Math.random() * 4);
      const col2 = Math.floor(Math.random() * 4);

      // Byt plats på brickorna
      const temp = shuffledTiles[row1][col1];
      shuffledTiles[row1][col1] = shuffledTiles[row2][col2];
      shuffledTiles[row2][col2] = temp;

      swaps++;
    }

    setTiles(shuffledTiles);
  };

  // Använd useEffect för att blanda brickorna när komponenten har initialiserats
  useEffect(() => {
    if (initialized) {
      shuffleTiles();
    } else {
      setInitialized(true);
    }
  }, [initialized]);

  // Funktion för att hantera klick på en bricka
  const handleTileClick = (row: number, col: number) => {
    const emptyTileCoords = findEmptyTile();
    if (emptyTileCoords) {
      // Kolla om klicket är en giltig flytt
      if (row === emptyTileCoords[0]) {
        moveRow(row, emptyTileCoords[1], col);
      } else if (col === emptyTileCoords[1]) {
        moveColumn(col, emptyTileCoords[0], row);
      } else if (
        isMoveValid(row, col, emptyTileCoords[0], emptyTileCoords[1])
      ) {
        // Utför flytten om den är giltig
        const newTiles = [...tiles];
        newTiles[emptyTileCoords[0]][emptyTileCoords[1]] = tiles[row][col];
        newTiles[row][col] = 0;
        setTiles(newTiles);
      }

      // Kolla om spelaren har vunnit efter flytten
      if (checkWinner()) {
        setIsWinner(true);
      }
    }
  };

  // Funktion för att flytta en hel rad
  const moveRow = (row: number, emptyCol: number, targetCol: number) => {
    const newTiles = [...tiles];
    if (targetCol < emptyCol) {
      for (let col = emptyCol; col > targetCol; col--) {
        newTiles[row][col] = newTiles[row][col - 1];
      }
    } else {
      for (let col = emptyCol; col < targetCol; col++) {
        newTiles[row][col] = newTiles[row][col + 1];
      }
    }
    newTiles[row][targetCol] = 0;
    setTiles(newTiles);
  };

  // Funktion för att flytta en hel kolumn
  const moveColumn = (col: number, emptyRow: number, targetRow: number) => {
    const newTiles = [...tiles];
    if (targetRow < emptyRow) {
      for (let row = emptyRow; row > targetRow; row--) {
        newTiles[row][col] = newTiles[row - 1][col];
      }
    } else {
      for (let row = emptyRow; row < targetRow; row++) {
        newTiles[row][col] = newTiles[row + 1][col];
      }
    }
    newTiles[targetRow][col] = 0;
    setTiles(newTiles);
  };

  // Funktion för att hitta den tomma brickan
  const findEmptyTile = (): [number, number] | null => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (tiles[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  };

  // Funktion för att kolla om en flytt är giltig
  const isMoveValid = (
    row: number,
    col: number,
    emptyRow: number,
    emptyCol: number
  ) => {
    const rowDiff = Math.abs(row - emptyRow);
    const colDiff = Math.abs(col - emptyCol);
    return (rowDiff === 0 && colDiff === 1) || (colDiff === 0 && rowDiff === 1);
  };

  // Funktion för att kontrollera om brickorna är i rätt ordning
  const checkCorrectPlacement = (value: number, row: number, col: number) => {
    const expectedValue = row * 4 + col + 1;
    return value === expectedValue;
  };

  // Funktion för att starta en ny omgång
  const handleNewGame = () => {
    setIsWinner(false);
    shuffleTiles();
  };

  // Funktion för att kontrollera om spelaren har vunnit
  const checkWinner = () => {
    let count = 1;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          tiles[i][j] !== count &&
          !(i === 3 && j === 3 && tiles[i][j] === 0)
        ) {
          return false;
        }
        count++;
      }
    }
    return true;
  };

  return (
    <div>
      {!isWinner && (
        <>
          <h1>15-Puzzle</h1>
          <Tiles
            tiles={tiles}
            onClick={handleTileClick}
            checkCorrectPlacement={checkCorrectPlacement}
          />
          <Shuffle onShuffle={shuffleTiles} />
        </>
      )}
      {isWinner && <Winner onNewGame={handleNewGame} />}
    </div>
  );
};

export default Board;
