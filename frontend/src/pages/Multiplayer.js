import React from 'react'
import Home from "./Home"
import MultiplayerBoard from '../components/MultiplayerBoard/MultiplayerBoard'
import StartGame from '../components/MultiplayerBoard/StartGame'
import { useInfo } from '../context/Info'

function Multiplayer({ socket })  {
    const {
        p1, p2
    } = useInfo()

    //how it looks like the multiplayer path with representation of 2 players playing in a specific room
    return (
        <div>
            <Home socket={socket}/>
            {(p1.username||p2.username) ?  <StartGame socket={socket}/> : null}
            <MultiplayerBoard socket={socket}/>
        </div>
    )
}

export default Multiplayer