import React, { useState, useCallback, useEffect } from 'react';
import Cell from './Cell';
import GameInfo from './GameInfo';
import { initializeBoard, checkWin, BOARD_SIZE } from '../utils/gameLogic';
import type { Player, BoardState } from '../utils/gameLogic';
import { getBestMove } from '../utils/aiLogic';

const Board: React.FC = () => {
    const [board, setBoard] = useState<BoardState>(initializeBoard());
    const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
    const [winner, setWinner] = useState<Player | 'draw' | null>(null);
    const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);
    const [gameMode, setGameMode] = useState<'pvp' | 'pve'>('pvp');
    const [isAiThinking, setIsAiThinking] = useState(false);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (board[row][col] || winner || (gameMode === 'pve' && currentPlayer === 'white' && isAiThinking)) return;

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
    }, [board, currentPlayer, winner, gameMode, isAiThinking]);

    // AI Turn
    useEffect(() => {
        if (gameMode === 'pve' && currentPlayer === 'white' && !winner) {
            setIsAiThinking(true);
            // Small delay for better UX
            const timer = setTimeout(() => {
                const bestMove = getBestMove(board, 'white');
                if (bestMove) {
                    const { row, col } = bestMove;
                    const newBoard = board.map(r => [...r]);
                    newBoard[row][col] = 'white';
                    setBoard(newBoard);
                    setLastMove({ row, col });

                    if (checkWin(newBoard, row, col, 'white')) {
                        setWinner('white');
                    } else if (newBoard.every(r => r.every(c => c !== null))) {
                        setWinner('draw');
                    } else {
                        setCurrentPlayer('black');
                    }
                }
                setIsAiThinking(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentPlayer, gameMode, winner, board]);

    const handleRestart = () => {
        setBoard(initializeBoard());
        setCurrentPlayer('black');
        setWinner(null);
        setLastMove(null);
        setIsAiThinking(false);
    };

    const handleGameModeChange = (mode: 'pvp' | 'pve') => {
        setGameMode(mode);
        handleRestart();
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-4 gap-8 bg-gray-50">
            <div className="lg:order-2">
                <GameInfo
                    currentPlayer={currentPlayer}
                    winner={winner}
                    onRestart={handleRestart}
                    gameMode={gameMode}
                    onGameModeChange={handleGameModeChange}
                />
            </div>

            <div className="relative p-2 sm:p-4 bg-[#DEB887] rounded-lg shadow-2xl border-4 border-[#8B4513] w-full max-w-[90vw] lg:max-w-[600px] aspect-square lg:order-1">
                {/* Wood texture overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none rounded-lg"></div>

                <div
                    className="grid gap-0 bg-[#DEB887] w-full h-full"
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
