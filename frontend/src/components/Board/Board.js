import React from "react"
import { setBackgroundColor, delay, gameOverAudio, animateDrop, dropCheckerAudio } from "../../utils/gameFunctions"
import { useInfo } from '../../context/Info'
import { GameData } from '../../classes/GameData'
import { AiModule } from '../../classes/AiModule'
import './Board.css'

//component that shows the board with buttons that can play the user the connect4 game
function Board(props) {
    const { winningM, OKClickM, historyClick, chatClick, p1, p2, playerTurnM, droppingM, 
        helpClick, statsClick, quitClick, level, dropping, winning, OKClick,
        newGameClick, setDropping, setWinning 
    } = useInfo()
    
    async function handleBoardClick(colIndex) {
        //communicate with the server to make the move and be shown both players
        if(props.mode === "multiplayer") {
            if(p1.username&&p2.username) {
                if(props.boardState.checkColumn(colIndex)&&!OKClickM&&!winningM&&!droppingM&&!historyClick&&!statsClick&&!helpClick&&!quitClick&&!chatClick) {
                    props.socket.emit("makeMove", { board: props.boardState.gameArray ,room: p1.room, column: colIndex, player: playerTurnM})
                }
            }
        }
        //makes move when clicks in some circle button of the board
        else if(props.mode === "ai") {
            var result = null
            let score = null
            
            if(level&&!dropping&&!winning&&!helpClick&&!OKClick&&!historyClick&&!statsClick&&!newGameClick) {
                if(props.playerTurn==="You"&&props.boardState.checkColumn(colIndex)) {
                    const newBoardStateForUser = new GameData(props.boardState.gameArray)
                    const rowUser = newBoardStateForUser.findFirstRowEmpty(colIndex)

                    setDropping(true)
                    await animateDrop(rowUser,colIndex,'darkred',0,props.buttons)

                    newBoardStateForUser.addInGameArray("User", colIndex)
                    await dropCheckerAudio.play()
                    props.setBoardState(newBoardStateForUser)

                    score = props.playerState.evaluateMove(props.boardState)
                    
                    if(score===-10000) {
                        setWinning("You")
                        await gameOverAudio.play()
                        setDropping(false)
                        return
                    }
                    
                    props.setPlayerTurn("Ai")
                    let newPlayerState = new AiModule(props.playerState.maxDepth,"AI")
                    props.setPlayerState(newPlayerState)

                    await delay(500)

                    if(props.boardState.checkColumnFree()) {
                        const newBoardStateForAi = new GameData(props.boardState.gameArray)
                        result = props.playerState.minMaxWithAlphaBeta(newBoardStateForAi,0,true,-Number.MAX_VALUE,Number.MAX_VALUE)
                        const rowAi = newBoardStateForAi.findFirstRowEmpty(result[1])

                        await animateDrop(rowAi,result[1],'goldenrod',0,props.buttons)

                        newBoardStateForAi.addInGameArray("AI", result[1])
                        await dropCheckerAudio.play()
                        props.setBoardState(newBoardStateForAi)

                        score = props.playerState.evaluateMove(props.boardState)
                        
                        if(score===10000) {
                            setWinning("Ai")
                            await gameOverAudio.play()
                            setDropping(false)
                            return
                        }
                    }
                    else {
                        setWinning("Draw")
                        await gameOverAudio.play()
                        setDropping(false)
                        return
                    }
                    if(result) {
                        props.setPlayerTurn("You")
                        props.setPlayerState((prevPlayerState) => {
                            prevPlayerState.playerTurn="User"
                            return prevPlayerState
                        })
                    }
                    if(!props.boardState.checkColumnFree()) {
                        setWinning("Draw")
                        await gameOverAudio.play()
                        setDropping(false)
                        return
                    }
                    await delay(500)
                    setDropping(false)
                }
            }
        }
    }
    
    return (
        <table className='board' ref={props.buttons}>
            <tbody>
                {props.boardState.gameArray && props.boardState.gameArray.map((row,rowIndex) => {
                    return (
                        <tr key={rowIndex} className='row'> 
                            {row.map((value,colIndex) => {
                                const backgroundColor = setBackgroundColor(value)
                                return (
                                    <td key={rowIndex+""+colIndex}>
                                        <button className="cell" style={{backgroundColor}} onClick={async () => handleBoardClick(colIndex)}></button>
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Board