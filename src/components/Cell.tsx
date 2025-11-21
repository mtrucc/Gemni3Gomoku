import React from 'react';
import type { Player } from '../utils/gameLogic';

interface CellProps {
    value: Player;
    onClick: () => void;
    isLastMove: boolean;
    rowIndex: number;
    colIndex: number;
}

const Cell: React.FC<CellProps> = ({ value, onClick, isLastMove, rowIndex, colIndex }) => {
    return (
        <div
            className="w-full h-full aspect-square relative flex items-center justify-center cursor-pointer"
            onClick={onClick}
        >
            {/* Grid lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-full h-px bg-gray-800 ${colIndex === 0 ? 'w-1/2 ml-auto' : ''} ${colIndex === 14 ? 'w-1/2 mr-auto' : ''}`}></div>
                <div className={`h-full w-px bg-gray-800 absolute ${rowIndex === 0 ? 'h-1/2 mt-auto' : ''} ${rowIndex === 14 ? 'h-1/2 mb-auto' : ''}`}></div>
            </div>

            {/* Stone */}
            {value && (
                <div
                    className={`w-[80%] h-[80%] rounded-full shadow-lg z-10 transition-transform duration-200 transform scale-100
            ${value === 'black'
                            ? 'bg-gradient-to-br from-gray-800 to-black ring-1 ring-gray-600'
                            : 'bg-gradient-to-br from-white to-gray-200 ring-1 ring-gray-300'}
            ${isLastMove ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}
          `}
                >
                    {/* Shine effect */}
                    <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] rounded-full bg-white opacity-30"></div>
                </div>
            )}

            {/* Hover effect for empty cells */}
            {!value && (
                <div className="w-[40%] h-[40%] rounded-full bg-gray-400 opacity-0 hover:opacity-50 transition-opacity duration-200 z-10"></div>
            )}
        </div>
    );
};

export default Cell;
