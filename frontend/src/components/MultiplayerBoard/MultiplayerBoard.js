import React, { useEffect } from 'react'
import axios from 'axios'
import { useInfo } from '../../context/Info'
import { useMultiplayerBoardState } from './hooks/useMultiplayerBoardState'
import '../AiBoard/AiBoard.css'
import './MultiplayerBoard.css'
import Board from '../Board/Board.js'

//component that shows the multiplayer board with buttons that can play the user against other user
//is the same philosophy with the ai board
function MultiplayerBoard({socket}) {
    const { winningM, setWinningM, OKClickM, setOKClickM, historyClick, setListItemsM, 
        opponent, p1 } = useInfo()
    const {
        boardState, buttons, playAgainText, setPlayAgainText, noPlayAgain, 
        setNoPlayAgain, beginDatetime, firstPlayerForThisGame, winner
    } = useMultiplayerBoardState(socket)

    //finds all the multiplayer games of a player to be shown when clicks to the history button
    useEffect(() => {

        axios.get("/multiplayer/find-all-games",{withCredentials:true}).then((res) => {
            if(res.data) {
                setListItemsM(res.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    },[historyClick,setListItemsM])

    //handles when a player clicks ok and saves the game in history
    const handleOKClick = () => {
        const data = {
            datetime: beginDatetime,
            firstplayer: firstPlayerForThisGame,
            opponent: opponent,
            winner: winner
        }
        axios.get("/multiplayer/add-game",{
            params: data,
            withCredentials:true
        }).then((res) => {
            if(res.data.success) {
                setWinningM(null)
                setOKClickM(true)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className='boardBackground'>
            <Board buttons={buttons} boardState={boardState} mode={"multiplayer"} socket={socket}/>
            { winningM ? <div className='win'>
                <header>Game Over!</header>
                <hr/>
                { winningM === "lost" ? <p>You Lost!</p> : winningM === "won" ? <p>You Won!</p> : <p>Draw!</p>}
                <div onClick={handleOKClick}>OK</div>
            </div> : null}
            { playAgainText&&OKClickM ? <div className='playAgain'>
                <ul>
                    <li>
                        Do you want to play again<br/> with the same opponent?
                        <br/>
                        <button onClick={() => {
                            socket.emit("yesPlayAgain", p1.room)
                        }}>Yes</button>
                        <button onClick={() => {
                            setPlayAgainText(null)
                            socket.emit("noPlayAgain", p1.room)
                        }}>No</button>
                    </li>
                </ul>
            </div>
            : null}
            { noPlayAgain ? <div className='noPlayAgain'>
                {opponent} does not want to play again!<br/>
                <button onClick={() => {setNoPlayAgain(false)}}>OK</button>
            </div> : null}
        </div>
    )
}

export default MultiplayerBoard