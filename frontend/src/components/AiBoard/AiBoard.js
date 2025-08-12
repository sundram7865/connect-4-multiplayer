import React from "react"
import { useInfo } from '../../context/Info'
import axios from 'axios'
import './AiBoard.css'
import { useAiBoardState } from "./hooks/useAiBoardState"
import Board from "../Board/Board"

//component that shows the ai board with buttons that can play the user against the ai
function AiBoard() {
    const {
        level, winning, setOKClick, setWinning
    } = useInfo()
    const {
        buttons, boardState, firstPlayerForThisGame, beginDatetime,
        setBoardState, playerState , setPlayerState, playerTurn, setPlayerTurn
    } = useAiBoardState()
    
    //handles the ok click to save the ai game in history
    const handleOKClick = () => {
        const data = {
            level: level,
            datetime: beginDatetime,
            winner: winning,
            firstplayer: firstPlayerForThisGame
        }
        axios.get("/ai/add-game",{
            params: data,
            withCredentials:true
        }).then((res) => {
            if(res.data.success) {
                setWinning(null)
                setOKClick(true)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className='boardBackground'>
            <Board buttons={buttons} boardState={boardState} mode={"ai"} setBoardState={setBoardState}
            playerState={playerState} setPlayerState={setPlayerState} playerTurn={playerTurn}
            setPlayerTurn={setPlayerTurn}/>
            { winning ? <div className='win'>
                <header>Game Over!</header>
                <hr/>
                { winning === "Ai" ? <p>You Lost!</p> : winning === "You" ? <p>You Won!</p> : <p>Draw!</p>}
                <div onClick={handleOKClick}>OK</div>
            </div> : null}
        </div>
    )
}

export default AiBoard