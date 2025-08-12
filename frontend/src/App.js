import { useLocation } from "react-router-dom"
import { Connect4Routes } from './routes/Routes.js'
import { LeftGlobalStyle, MiddleGlobalStyle, AiStyle } from './style/styles'
import { useEffect } from 'react'
import React from "react"
import socketIOClient from 'socket.io-client'

let socket = socketIOClient('http://localhost:5000',{transports: ['websocket', 'polling'], upgrade: false})

function App() {
    const location = useLocation()
    
    useEffect(() => {
        
        //move the background image in according to pathname
        if(location.pathname==="/login"||location.pathname==="/signup") {
            document.body.style.backgroundImage = LeftGlobalStyle.backgroundImage
            document.body.style.backgroundRepeat = LeftGlobalStyle.backgroundRepeat
            document.body.style.backgroundSize = LeftGlobalStyle.backgroundSize
            document.body.style.backgroundPosition = LeftGlobalStyle.backgroundPosition
        } else if(location.pathname==="/home") {
            document.body.style.backgroundImage = LeftGlobalStyle.backgroundImage
            document.body.style.backgroundRepeat = LeftGlobalStyle.backgroundRepeat
            document.body.style.backgroundSize = LeftGlobalStyle.backgroundSize
            document.body.style.backgroundPosition = MiddleGlobalStyle.backgroundPosition
        } else if(location.pathname==="/ai"||location.pathname==="/multiplayer") {
            document.body.style.backgroundImage = LeftGlobalStyle.backgroundImage
            document.body.style.backgroundRepeat = LeftGlobalStyle.backgroundRepeat
            document.body.style.backgroundSize = LeftGlobalStyle.backgroundSize
            document.body.style.backgroundPosition = AiStyle.backgroundPosition
        }

        if(location.pathname==="/login") {
            socket.emit("quit",null)
        }
    },[location])

    return (
        <div className="App">
            <Connect4Routes socket={socket}/>
        </div>
    )
}

export default App
