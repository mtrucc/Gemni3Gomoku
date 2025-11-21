import React, { useState, useCallback } from 'react';
import Cell from './Cell';
import GameInfo from './GameInfo';
import { initializeBoard, checkWin, BOARD_SIZE } from '../utils/gameLogic';
import type { Player, BoardState } from '../utils/gameLogic';

const Board: React.FC = () => {
    const [board, setBoard] = useState<BoardState>(initializeBoard());
    const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
    const [winner, setWinner] = useState<Player | 'draw' | null>(null);
    const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (board[row][col] || winner) return;

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setLastMove({ row, col });

        if (checkWin(newBoard, row, col, currentPlayer)) {
            setWinner(currentPlayer);
        } else if (newBoard.every(r => r.every(c => c !== null))) {
            setWinner('draw');
        } else {
            setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
        }
    }, [board, currentPlayer, winner]);

    const handleRestart = () => {
        setBoard(initializeBoard());
        setCurrentPlayer('black');
        setWinner(null);
        setLastMove(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <GameInfo currentPlayer={currentPlayer} winner={winner} onRestart={handleRestart} />

            <div className="relative p-4 bg-[#DEB887] rounded-lg shadow-2xl border-4 border-[#8B4513]">
                {/* Wood texture overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none rounded-lg"></div>

                <div
                    className="grid gap-0 bg-[#DEB887]"
                    style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
                >
                    {board.map((row, rowIndex) => (
                        row.map((cell, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                value={cell}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                isLastMove={lastMove?.row === rowIndex && lastMove?.col === colIndex}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                            />
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Board;
