import React from 'react';
import type { Player } from '../utils/gameLogic';

interface GameInfoProps {
    currentPlayer: Player;
    winner: Player | 'draw' | null;
    onRestart: () => void;
    gameMode: 'pvp' | 'pve';
    onGameModeChange: (mode: 'pvp' | 'pve') => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer, winner, onRestart, gameMode, onGameModeChange }) => {
    return (
        <div className="flex flex-col items-center gap-3 mb-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-sm sm:max-w-md transition-all">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 drop-shadow-sm">
                Gomoku
            </h1>

            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                    onClick={() => onGameModeChange('pvp')}
                    className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${gameMode === 'pvp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    PvP
                </button>
                <button
                    onClick={() => onGameModeChange('pve')}
                    className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${gameMode === 'pve' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    PvE (AI)
                </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${currentPlayer === 'black' ? 'bg-black text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-500'
                    }`}>
                    Black
                </div>
                <div className="text-gray-400 font-bold text-sm">vs</div>
                <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${currentPlayer === 'white' ? 'bg-white text-black border border-gray-200 shadow-lg scale-105' : 'bg-gray-200 text-gray-500'
                    }`}>
                    {gameMode === 'pve' ? 'AI' : 'White'}
                </div>
            </div>

            {winner && (
                <div className="text-xl font-bold animate-bounce text-blue-600">
                    {winner === 'draw' ? 'Draw!' : `${winner === 'black' ? 'Black' : (gameMode === 'pve' ? 'AI' : 'White')} Wins!`}
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
