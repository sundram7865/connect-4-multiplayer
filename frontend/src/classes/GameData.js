
export class GameData {
    static ROWS = 6
    static COLUMNS = 7

    //constructor of GameData class
    constructor(gameArray) {
        this.gameArray=gameArray
    }

    //returns the game array
    get gameArray() {
        return this._gameArray
    }

    //sets the game array
    set gameArray(array) {
        this._gameArray=array
    }

    //initializes the game array with 'W'
    initializationGameArray() { 
        
        for(let i=0; i<GameData.ROWS; i++) {
            for(let j=0; j<GameData.COLUMNS; j++) {
                this.gameArray[i][j]='W'
            }
        }
    }

    //checks if the column in the game array is free
    checkColumn(column) {

        if(this.gameArray[0][column]==='W') {
            return true
        }
        return false
    }

    //checks if there is some free column in the game array and returns true if there is or false otherwise
    checkColumnFree() { 

        for(let j=0; j<GameData.COLUMNS; j++) {
            if(this.gameArray[0][j]==='W') {
                return true
            }
        }
        return false
    }

    //adds a checker in the game array and returns the row of the addition
    addInGameArray(playerTurn, columnPosition) { 
        var i=0

        if(playerTurn==="AI") {
            for (i = GameData.ROWS - 1; i >= 0; i--) {
                if (this.gameArray[i][columnPosition] === 'W') {
                    this.gameArray[i][columnPosition] = 'Y'
                    break
                }
            }
        }
        else if(playerTurn==="User") {
            for (i = GameData.ROWS - 1; i >= 0; i--) {
                if (this.gameArray[i][columnPosition] === 'W') {
                    this.gameArray[i][columnPosition] = 'R'
                    break
                }
            }
        }
        return i
    }

    //finds the first row in a specific column that is empty
    findFirstRowEmpty(columnPosition) {
        for (let i = GameData.ROWS - 1; i >= 0; i--) {
            if (this.gameArray[i][columnPosition] === 'W') {
                return i
            }
        }
    }

    //removes the checker from the game array
    removeFromGameArray(rowPosition ,columnPosition) {

        this.gameArray[rowPosition][columnPosition]='W'
    }
}