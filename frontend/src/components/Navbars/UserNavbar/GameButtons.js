import React from "react"
import './GameButtons.css'
import { useNavigate } from "react-router-dom"

//component for two buttons that they navigate in the two different modes ai/multiplayer
function GameButtons() {
    const navigate = useNavigate()

    function handleAiClick() {
        navigate("/ai")
    }

    function handleMultiplayerClick() {
        navigate("/multiplayer")
    }

    //handles the click of two buttons for ai or multiplayer game
    return (
        <div className="gameButtons">
            <button className="aiButton" onClick={handleAiClick}>Play with AI</button>
            <button className="multiplayerButton" onClick={handleMultiplayerClick}>Play Online</button>
        </div>
    )
}

export default GameButtons