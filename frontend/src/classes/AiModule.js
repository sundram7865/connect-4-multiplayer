
import { GameData } from "./GameData"

export class AiModule {

    //constructor of AiModule class
    constructor(maxDepth,playerTurn) {
        this.maxDepth=maxDepth
        this.playerTurn=playerTurn
    }

    //returns the max depth
    get maxDepth() {
        return this._maxDepth
    }

    //sets the max depth
    set maxDepth(newMaxDepth) {
        this._maxDepth=newMaxDepth
    }

    //returns the player that has turn
    get playerTurn() {
        return this._playerTurn
    }

    //sets the player that has turn
    set playerTurn(newPlayerTurn) {
        this._playerTurn=newPlayerTurn
    }

    //counts the benefit for AI or User or the cost for AI or User 
    countCostOrBenefit(gameArray,row,column,costOrBenefit) {
        var value=0, times=0
        var check=0

        //looks to what must evaluate cost or benefit about AI or User
        if((this.playerTurn==="AI"&&costOrBenefit===1)||(this.playerTurn==="User"&&costOrBenefit===0)) {
            check='Y'
        }
        else if((this.playerTurn==="User"&&costOrBenefit===1)||(this.playerTurn==="AI"&&costOrBenefit===0)) {
            check='R'
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
        if(gameArray[row][column]!=='W'&&row>GameData.ROWS-4) {
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
        if(column<GameData.COLUMNS-3&&row<GameData.ROWS-3) {
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
        if(column<GameData.COLUMNS-3&&row>GameData.ROWS-4) {
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

    //evaluates the each move either User or AI
    evaluateMove(gameData) {
        var cost=0, benefit=0

        //benefit and cost for AI
        if(this.playerTurn==="AI") {
            for(let i=0; i<GameData.ROWS; i++) {
                for(let j=0; j<GameData.COLUMNS; j++) {
                    cost=cost+this.countCostOrBenefit(gameData.gameArray, i, j,1) //costOrBnefit=1 if it is cost or 0 if it is benefit
                    benefit=benefit+this.countCostOrBenefit(gameData.gameArray, i, j,0)
                    if(benefit>=10000) { //if it is a win for AI
                        return 10000
                    }
                }
            }
        }
        else if(this.playerTurn==="User") { //benefit and cost for User
            for(let i=0; i<GameData.ROWS; i++) {
                for(let j=0; j<GameData.COLUMNS; j++) {
                    cost=cost-this.countCostOrBenefit(gameData.gameArray, i, j,1) //costOrBnefit=1 if it is cost or 0 if it is benefit
                    benefit=benefit-this.countCostOrBenefit(gameData.gameArray, i, j,0)
                    if(benefit<=-10000) { //if it is a win for User
                        return -10000
                    }
                }
            }
        }
        //sub between benefit and cost either AI or User
        return benefit-cost
    }

    //minmax algorithm with alpha beta pruning to find the the best column to put the checker the AI
    minMaxWithAlphaBeta(gameData,depth,max,alpha,beta) {
        let score=this.evaluateMove(gameData)
        
        //if it is terminal node or is detected some win or the game board is full return
        if(depth===this.maxDepth||!gameData.checkColumnFree()||score===10000||score===-10000) {
            var evaluation = [score,0]
            return evaluation
        }

        if(max) { //maximizer node, the AI
            let bestEvaluation = [-Number.MAX_VALUE,0]
            for(let j=0; j<GameData.COLUMNS; j++) {
                if(gameData.gameArray[0][j]==='W') {
                    let rowPosition = gameData.addInGameArray("AI", j)
                    this.playerTurn="AI"

                    let value = this.minMaxWithAlphaBeta(gameData, depth+1, false, alpha, beta)

                    this.playerTurn="AI"
                    gameData.removeFromGameArray(rowPosition, j)

                    if(bestEvaluation[0]<value[0]) { //chooses the best column and best score for AI
                        bestEvaluation = [value[0],j]    
                    }
                    if(alpha<bestEvaluation[0]) {
                        alpha=bestEvaluation[0]
                    }
                    if(alpha>=beta) {
                        break
                    }
                }
            }
            return bestEvaluation
        }
        else { //minimizer node, the User
            var worstEvaluation = [Number.MAX_VALUE,0] 
            for(let j=0; j<GameData.COLUMNS; j++) {
                if(gameData.gameArray[0][j]==='W') {
                    let rowPosition = gameData.addInGameArray("User", j)
                    this.playerTurn="User"

                    let value = this.minMaxWithAlphaBeta(gameData, depth+1, true, alpha, beta)

                    this.playerTurn="User"
                    gameData.removeFromGameArray(rowPosition, j)

                    if(worstEvaluation[0]>value[0]) {  //chooses the worst column and worst score for User
                        worstEvaluation = [value[0],j]
                    }
                    if(beta>worstEvaluation[0]) {
                        beta=worstEvaluation[0]
                    }
                    if(alpha>=beta) {
                        break
                    }
                }
            }
            return worstEvaluation
        }
    }
}