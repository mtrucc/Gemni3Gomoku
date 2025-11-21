import { BOARD_SIZE } from './gameLogic';
import type { BoardState, Player } from './gameLogic';

// Heuristic scores
const SCORES = {
    WIN: 100000,
    OPEN_FOUR: 10000,
    FOUR: 1000,
    OPEN_THREE: 1000,
    THREE: 100,
    OPEN_TWO: 100,
    TWO: 10,
};

type Direction = [number, number];

const DIRECTIONS: Direction[] = [
    [0, 1],  // Horizontal
    [1, 0],  // Vertical
    [1, 1],  // Diagonal \
    [1, -1], // Diagonal /
];

const evaluateLine = (count: number, openEnds: number): number => {
    if (count >= 5) return SCORES.WIN;
    if (count === 4) {
        if (openEnds === 2) return SCORES.OPEN_FOUR;
        if (openEnds === 1) return SCORES.FOUR;
    }
    if (count === 3) {
        if (openEnds === 2) return SCORES.OPEN_THREE;
        if (openEnds === 1) return SCORES.THREE;
    }
    if (count === 2) {
        if (openEnds === 2) return SCORES.OPEN_TWO;
        if (openEnds === 1) return SCORES.TWO;
    }
    return 0;
};

const evaluateBoard = (board: BoardState, player: Player): number => {
    let score = 0;

    // Evaluate all cells
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === null) continue;

            const isCurrentPlayer = board[r][c] === player;
            const multiplier = isCurrentPlayer ? 1 : -1.2; // Weight defense slightly higher

            for (const [dr, dc] of DIRECTIONS) {
                // Only check in positive directions to avoid double counting
                // But we need to check if this is the start of a sequence to avoid partial counting
                const prevR = r - dr;
                const prevC = c - dc;
                if (prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE && board[prevR][prevC] === board[r][c]) {
                    continue;
                }

                let count = 1;
                let openEnds = 0;

                // Check backward open end
                if (prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE && board[prevR][prevC] === null) {
                    openEnds++;
                }

                // Check forward
                let i = 1;
                while (true) {
                    const nextR = r + dr * i;
                    const nextC = c + dc * i;

                    if (nextR < 0 || nextR >= BOARD_SIZE || nextC < 0 || nextC >= BOARD_SIZE) break;

                    if (board[nextR][nextC] === board[r][c]) {
                        count++;
                        i++;
                    } else {
                        if (board[nextR][nextC] === null) {
                            openEnds++;
                        }
                        break;
                    }
                }

                score += evaluateLine(count, openEnds) * multiplier;
            }
        }
    }
    return score;
};

export const getBestMove = (board: BoardState, player: Player): { row: number, col: number } | null => {
    let bestScore = -Infinity;
    let bestMoves: { row: number, col: number }[] = [];

    // Optimization: only check cells around existing stones
    const candidateMoves = new Set<string>();
    let hasStones = false;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== null) {
                hasStones = true;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) {
                            candidateMoves.add(`${nr},${nc}`);
                        }
                    }
                }
            }
        }
    }

    if (!hasStones) {
        return { row: Math.floor(BOARD_SIZE / 2), col: Math.floor(BOARD_SIZE / 2) };
    }

    for (const moveStr of candidateMoves) {
        const [r, c] = moveStr.split(',').map(Number);

        // Simulate move
        board[r][c] = player;
        const score = evaluateBoard(board, player);
        board[r][c] = null; // Undo move

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [{ row: r, col: c }];
        } else if (score === bestScore) {
            bestMoves.push({ row: r, col: c });
        }
    }

    if (bestMoves.length === 0) return null;
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
};
