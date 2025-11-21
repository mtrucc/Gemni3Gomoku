export type Player = 'black' | 'white' | null;
export type BoardState = Player[][];

export const BOARD_SIZE = 15;

export const initializeBoard = (): BoardState => {
    return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

export const checkWin = (board: BoardState, row: number, col: number, player: Player): boolean => {
    if (!player) return false;

    const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1],  // Diagonal \
        [1, -1], // Diagonal /
    ];

    for (const [dx, dy] of directions) {
        let count = 1;

        // Check forward
        for (let i = 1; i < 5; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }

        // Check backward
        for (let i = 1; i < 5; i++) {
            const r = row - dx * i;
            const c = col - dy * i;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) return true;
    }

    return false;
};
