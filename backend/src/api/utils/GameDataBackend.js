//class that helps in the ai and the evaluation of ai moves
export class GameDataBackend {
    static ROWS = 6
    static COLUMNS = 7

    //constructor of GameDataBackend class
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

    //checks if there is some free column in the game array and returns true if there is or false otherwise
    checkColumnFree() { 

        for(let j=0; j<GameDataBackend.COLUMNS; j++) {
            if(this.gameArray[0][j]==='W') {
                return true
            }
        }
        return false
    }

    //check if board is in initial state
    checkBoardIsInitialState() {

        for(let j=0; j<GameDataBackend.COLUMNS; j++) {
            if(this.gameArray[5][j]!=="W") {
                return false
            }
        }
        return true
    }

    //add in game array in mode multiplayer
    addMultiplayer(color,columnPosition) {
        let i
        for (i = GameDataBackend.ROWS - 1; i >= 0; i--) {
            if (this.gameArray[i][columnPosition] === 'W') {
                if(color==="red") {
                    this.gameArray[i][columnPosition] = 'R'
                } else if(color==="yellow") {
                    this.gameArray[i][columnPosition] = 'Y'
                }
                break
            }
        }
        return i
    }

    //counts the benefit of a player and how close is to win
    countBenefit(gameArray,row,column,color) {
        var value=0, times=0
        var check=0

        if(color==="yellow") {
            check='R'
        }
        else if(color==="red") {
            check='Y'
        }

        //horizontal
        if(column<4) {
            for(let j=column; j<column+4; j++) {
                if(gameArray[row][j]==='W') {
                    continue
                }
                else {
                    if(gameArray[row][j]===check) {
                        times=0
                        break
                    }
                    times++
                }
            }
            if(times===1) {
                value=value+1
            }
            if(times===2) {
                value=value+4
            }
            if(times===3) {
                value=value+16
            }
            if(times===4) {
                return 10000
            }
            times=0
        }
        //vertical
        if(gameArray[row][column]!=='W'&&row>GameDataBackend.ROWS-4) {
            for(let i=row; i>row-4; i--) {
                if(gameArray[i][column]===check) {
                    times=0
                    break
                }
                if(gameArray[i][column]==='W') {
                    break
                }
                else {
                    times++
                }
            }
            if(times===1) {
                value=value+1
            }
            if(times===2) {
                value=value+4
            }
            if(times===3) {
                value=value+16
            }
            if(times===4) {
                return 10000
            }
            times=0
        }
        //diagonal below
        if(column<GameDataBackend.COLUMNS-3&&row<GameDataBackend.ROWS-3) {
            for(let i=row,j=column; i<row+4&&j<column+4; i++,j++) {
                if(gameArray[i][j]==='W') {
                    continue
                }
                else {
                    if(gameArray[i][j]===check) {
                        times=0
                        break
                    }
                    times++
                }
            }
            if(times===1) {
                value=value+1
            }
            if(times===2) {
                value=value+4
            }
            if(times===3) {
                value=value+16
            }
            if(times===4) {
                return 10000
            }
            times=0
        }
        //diagonal above
        if(column<GameDataBackend.COLUMNS-3&&row>GameDataBackend.ROWS-4) {
            for(let i=row,j=column; i>row-4&&j<column+4; i--,j++) {
                if(gameArray[i][j]==='W') {
                    continue
                }
                else {
                    if(gameArray[i][j]===check) {
                        times=0
                        break
                    }
                    times++
                }
            }
            if(times===1) {
                value=value+1
            }
            if(times===2) {
                value=value+4
            }
            if(times===3) {
                value=value+16
            }
            if(times===4) {
                return 10000
            }
            times=0
        } 
        return value
    }

    //evaluates move if there is a win or not
    evaluateMove(gameArray,color) {
        var benefit=0

        for(let i=0; i<GameDataBackend.ROWS; i++) {
            for(let j=0; j<GameDataBackend.COLUMNS; j++) {
                benefit=benefit+this.countBenefit(gameArray, i, j,color)
                if(benefit>=10000) {
                    return 10000
                }
            }
        }
        return benefit
    }
}