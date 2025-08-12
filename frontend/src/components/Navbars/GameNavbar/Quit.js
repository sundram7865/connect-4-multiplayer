import React from "react"
import { useInfo } from '../../../context/Info'
import axios from 'axios'
import './GameNavbar.css'

//component for the quit in the multiplayer mode that someone can leave from a room that is joined
function Quit({socket}) {
    const {
        quitClick, setPlayClick, setQuitClick, secondPlayer, OKClickM, setQuitHover,
        setQuitYes, username
    } = useInfo()

    //sets the hover of quit div in false
    function removeQuitHover() {
        setQuitHover(false)
    }

    return (
        <div className='quitOptions' onMouseEnter={removeQuitHover}>
            <ul>
                <li onMouseEnter={removeQuitHover}>
                    Are you sure that you want to leave?
                    <br/>
                    <button onClick={ async () => {
                        setQuitYes(true)
                        setQuitClick(!quitClick)
                        setPlayClick(false)
                        await axios.get("/multiplayer/clear-data",{withCredentials:true})
                        socket.emit("quit",username)
                        await axios.get("/multiplayer/clear-data",{withCredentials:true})
                    }}>Yes</button>
                    <button onClick={() => {
                        setQuitClick(!quitClick)
                    }}>No</button>
                    <br/>
                    {!OKClickM&&secondPlayer ? <div><i className="fa fa-exclamation-triangle caution" aria-hidden="true"></i>
                            <span>Caution!&nbsp;</span>If you leave during the game and not after a win, <br/>loss 
                            or draw has passed, you will lose the game.   
                        </div> : OKClickM ?
                        <div><i className="fa fa-check good"></i>
                            If you want you can leave now from this room <br/>without penalty.
                        </div> : <div><i className="fa fa-check good"></i>
                            If you are alone in a room you can leave without penalty.
                        </div>
                    }
                </li>
            </ul>
        </div>
    )
}

export default Quit