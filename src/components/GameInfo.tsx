import React from 'react';
import type { Player } from '../utils/gameLogic';

interface GameInfoProps {
    currentPlayer: Player;
    winner: Player | 'draw' | null;
    onRestart: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer, winner, onRestart }) => {
    return (
        <div className="flex flex-col items-center gap-4 mb-6 p-6 bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">
                Gomoku
            </h1>

            <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPlayer === 'black' ? 'bg-black text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-500'
                    }`}>
                    Black
                </div>
                <div className="text-gray-400 font-bold">vs</div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPlayer === 'white' ? 'bg-white text-black border border-gray-200 shadow-lg scale-105' : 'bg-gray-200 text-gray-500'
                    }`}>
                    White
                </div>
            </div>

            {winner && (
                <div className="text-xl font-bold animate-bounce text-blue-600">
                    {winner === 'draw' ? 'Draw!' : `${winner === 'black' ? 'Black' : 'White'} Wins!`}
                </div>
            )}

            <button
                onClick={onRestart}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
                {winner ? 'Play Again' : 'Restart Game'}
            </button>
        </div>
    );
};

export default GameInfo;
