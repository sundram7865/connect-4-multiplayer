// Class that helps in BOT decision-making and evaluation of moves for Connect Four
export class GameDataBackend {
    static ROWS = 6;
    static COLUMNS = 7;
    static EMPTY = 'W';
    static RED = 'R';
    static YELLOW = 'Y';
    static WIN_SCORE = 10000;

    constructor(gameArray) {
        this.gameArray = gameArray;
    }

    // Getter and setter for gameArray
    get gameArray() {
        return this._gameArray;
    }

    set gameArray(array) {
        this._gameArray = array;
    }

    // Checks if there is at least one free column
    checkColumnFree() {
        return this.gameArray[0].some(cell => cell === GameDataBackend.EMPTY);
    }

    // Checks if board is in initial state (all bottom row slots are empty)
    checkBoardIsInitialState() {
        return this.gameArray[GameDataBackend.ROWS - 1]
            .every(cell => cell === GameDataBackend.EMPTY);
    }

    // Adds a piece in multiplayer mode
    addMultiplayer(color, columnPosition) {
        for (let i = GameDataBackend.ROWS - 1; i >= 0; i--) {
            if (this.gameArray[i][columnPosition] === GameDataBackend.EMPTY) {
                this.gameArray[i][columnPosition] = 
                    color === "red" ? GameDataBackend.RED : GameDataBackend.YELLOW;
                return i; // return the row index where the piece landed
            }
        }
        return -1; // column is full
    }

    // Counts the benefit for a player based on proximity to winning
    countBenefit(gameArray, row, column, color) {
        const opponent = color === "yellow" ? GameDataBackend.RED : GameDataBackend.YELLOW;
        let value = 0;

        const directions = [
            { dr: 0, dc: 1 },   // horizontal
            { dr: -1, dc: 0 },  // vertical
            { dr: 1, dc: 1 },   // diagonal down-right
            { dr: -1, dc: 1 }   // diagonal up-right
        ];

        for (const { dr, dc } of directions) {
            let times = 0;
            for (let step = 0; step < 4; step++) {
                const r = row + dr * step;
                const c = column + dc * step;

                if (r < 0 || r >= GameDataBackend.ROWS || c < 0 || c >= GameDataBackend.COLUMNS) {
                    times = 0;
                    break;
                }

                const cell = gameArray[r][c];
                if (cell === GameDataBackend.EMPTY) continue;
                if (cell === opponent) {
                    times = 0;
                    break;
                }
                times++;
            }

            if (times > 0) {
                value += this.getScoreForCount(times);
                if (times === 4) return GameDataBackend.WIN_SCORE;
            }
        }
        return value;
    }

    // Evaluates the entire board for the given color
    evaluateMove(gameArray, color) {
        let benefit = 0;
        for (let i = 0; i < GameDataBackend.ROWS; i++) {
            for (let j = 0; j < GameDataBackend.COLUMNS; j++) {
                benefit += this.countBenefit(gameArray, i, j, color);
                if (benefit >= GameDataBackend.WIN_SCORE) {
                    return GameDataBackend.WIN_SCORE;
                }
            }
        }
        return benefit;
    }

    // Helper: scoring table
    getScoreForCount(count) {
        switch (count) {
            case 1: return 1;
            case 2: return 4;
            case 3: return 16;
            default: return 0;
        }
    }
}
