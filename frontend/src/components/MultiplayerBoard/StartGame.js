import React from "react"
import { useInfo } from '../../context/Info'
import UsernameWithClock from './UsernameWithClock'
import { CircularProgress } from '@mui/material'
import './StartGame.css'

//component that shows the username and for waiting a circular progress or during the game
//a circle that when is time to play a user the clock counts backwards from 60 seconds
function StartGame({socket}) {
    const {
        p1, p2, OKClickM, winningM, time, playerTurnM, playerTurnUsernameM, playingM
    } = useInfo()

    return (
        <div className='usernames'>
            <div>
                {
                    p1.firstPlayer ? 
                    <div>
                        {
                            !p1.username ? 
                            <div><CircularProgress size={30} style={{color:'white'}}/><div>Searching for a player...</div></div> : 
                            <UsernameWithClock username={p1.username} room={p1.room} turn={playerTurnM} socket={socket} playing={playingM.playingP1&&p2.username&&!winningM&&!OKClickM} turnUsername={playerTurnUsernameM} first={p1.firstPlayer} time={time.timeP1} p={"P1"}/>
                        }
                    </div> : 
                    <div>
                        {
                            !p2.username ? 
                            <div><CircularProgress size={30} style={{color:'white'}}/><div>Searching for a player...</div></div> : 
                            <UsernameWithClock username={p2.username} room={p2.room} turn={playerTurnM} socket={socket} playing={playingM.playingP2&&p1.username&&!winningM&&!OKClickM} turnUsername={playerTurnUsernameM} first={p2.firstPlayer} time={time.timeP2} p={"P2"}/>
                        }
                    </div>
                }
                {
                    p2.firstPlayer===true ? 
                    <div>
                        {
                            !p1.username ? 
                            <div><CircularProgress size={30} style={{color:'white'}}/><div>Searching for a player...</div></div> : 
                            <UsernameWithClock username={p1.username} room={p1.room} turn={playerTurnM} socket={socket} playing={playingM.playingP1&&p2.username&&!winningM&&!OKClickM} turnUsername={playerTurnUsernameM} first={p1.firstPlayer} time={time.timeP1} p={"P1"}/>
                        }
                    </div> : 
                    <div>
                        {
                            !p2.username ? 
                            <div><CircularProgress size={30} style={{color:'white'}}/><div>Searching for a player...</div></div> : 
                            <UsernameWithClock username={p2.username} room={p2.room} turn={playerTurnM} socket={socket} playing={playingM.playingP2&&p1.username&&!winningM&&!OKClickM} turnUsername={playerTurnUsernameM} first={p2.firstPlayer} time={time.timeP2} p={"P2"}/>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default StartGame