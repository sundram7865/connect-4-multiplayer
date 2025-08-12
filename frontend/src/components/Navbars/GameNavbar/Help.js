import React from "react"
import { useLocation } from "react-router-dom"
import { useInfo } from '../../../context/Info'
import './GameNavbar.css'

//component for the help in the game navabar that gives some details about the game connect4
//for ai or multiplayer mode
function Help() {
    const location = useLocation()
    const {
        setHelpHover
    } = useInfo()

    //sets the hover of help div in false
    function removeHelpHover() {
        setHelpHover(false)
    }

    return(
        <div className='helpInfo' onMouseEnter={removeHelpHover}>
            <ul>
                {location.pathname==="/ai" ? <li onMouseEnter={removeHelpHover}>
                    The ai makes moves on its own based on the current state of the board.<br/>
                    You play against it as if you were playing with any other opponent.<br/>
                    You must choose the firstplayer first and after the level of the ai and the game begins.<br/>
                    Below is a video that shows generally how to play this game.<br/>
                    Link: <a href='https://www.youtube.com/watch?v=utXzIFEVPjA' target="_blank" rel="noopener noreferrer">How to play Connect4</a>
                </li> : null}
                {location.pathname==="/multiplayer" ? <li onMouseEnter={removeHelpHover}>
                    You play against other player online.<br/>
                    The "play" button begins the game and the "quit" button terminates the game and you lose.<br/>
                    The "play again" button after a result from a game you can click it <br/>
                    only if both two players have clicked OK after the end of the game.<br/>
                    The firsplayer is selected automatically the first that makes the request to play.<br/>
                    The username button is disabled when you are in a room.<br/>
                    Below is a video that shows generally how to play this game.<br/>
                    Link: <a href='https://www.youtube.com/watch?v=utXzIFEVPjA' target="_blank" rel="noopener noreferrer">How to play Connect4</a>
                </li> : null}
            </ul>
        </div>
    )
}

export default Help