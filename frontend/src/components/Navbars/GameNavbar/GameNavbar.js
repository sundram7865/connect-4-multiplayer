import React, { useState } from 'react'
import { useInfo } from '../../../context/Info'
import { useLocation } from "react-router-dom"
import History from './History.js'
import Stats from './Stats.js'
import Help from './Help.js'
import Quit from './Quit.js'
import Chat from './Chat.js'

//component that contains the componenets of the game navbar for ai/multiplayer mode
function GameNavbar({socket}) {
    const [newGameHover,setnewGameHover] = useState(false)
    const [firstPlayerHover, setFirstPlayerHover] = useState(false)
    const [playHover, setPlayHover] = useState(false)
    const { 
        setFirstPlayerClick, setFirstPlayer, setLevel, firstPlayerClick,
        setHelpClick, setHistoryClick, setStatsClick, setNewGameClick, 
        username, setQuitClick, players, setChatClick, 
        chatClick, setPlayClick, statsClick, winning, dropping, newGameClick,
        setCheckLevel, winningM, historyClick, helpClick,
        playClick, OKClickM, droppingM, firstPlayer, newMessages, setNewMessages,
        quitClick, historyHover, setHistoryHover, statsHover, setStatsHover, 
        helpHover, setHelpHover, quitHover, setQuitHover, chatHover, setChatHover
    } = useInfo()
    const location = useLocation()

    //handles the changes of the radio buttons
    function handleChange(e) {
        setFirstPlayer(e.target.value)
    }

    //handles the click of the new game to show or not the trivial,medium and hard
    function handleNewGameClick() {
        setFirstPlayerClick(false)
        setHistoryClick(false)
        setHelpClick(false)
        setStatsClick(false)
        if(newGameHover&&!winning&&!dropping) {
            setNewGameClick(!newGameClick)
        }
    }

    //handles the click of some level "Trivial", "Medium" or "Hard"
    function handleLevelClick(buttonLevel) {
        setLevel(buttonLevel)
        setCheckLevel(1)
        setNewGameClick(false)
    }

    //handles the click of the stats button
    function handleStatsClick() {
        setNewGameClick(false)
        setFirstPlayerClick(false)
        setHistoryClick(false)
        setHelpClick(false)
        setQuitClick(false)
        setChatClick(false)
        if((location.pathname==="/ai"&&!winning)||(location.pathname==="/multiplayer"&&!winningM)) {
            setStatsClick(!statsClick)
        }
    }

    //sets the hover of new game div in false
    function removeNewGameHover() {
        setnewGameHover(false)
    }

    //sets the hover of new game div in true
    function addNewGameHover() {
        setnewGameHover(true)
    }

    //sets the hover of first player div in false
    function removeFirstPlayerHover() {
        setFirstPlayerHover(false)
    }

    //sets the hover of first player div in true
    function addFirstPlayerHover() {
        setFirstPlayerHover(true)
    }

    //sets the hover of help div in true
    function addHelpHover() {
        setHelpHover(true)
    }

    //sets the hover of help div in false
    function removeHelpHover() {
        setHelpHover(false)
    }

    //sets the hover of history div in true
    function addHistoryHover() {
        setHistoryHover(true)
    }

    //sets the hover of history div in false
    function removeHistoryHover() {
        setHistoryHover(false)
    }

    //sets the hover of stats div in true
    function addStatsHover() {
        setStatsHover(true)
    }

    //sets the hover of stats div in false
    function removeStatsHover() {
        setStatsHover(false)
    }

    //handles the click of the first player to show or not who plays first you or ai
    function handlefirstPlayerClick() {
        setNewGameClick(false)
        setHistoryClick(false)
        setHelpClick(false)
        setStatsClick(false)
        if(firstPlayerHover&&!winning) {
            setFirstPlayerClick(!firstPlayerClick)
        }
    }

    //handles the click of history div
    function handleHistoryClick() {
        setNewGameClick(false)
        setFirstPlayerClick(false)
        setHelpClick(false)
        setStatsClick(false)
        setQuitClick(false)
        setChatClick(false)
        if((location.pathname==="/ai"&&!winning)||(location.pathname==="/multiplayer"&&!winningM)) {
            setHistoryClick(!historyClick)
        }
    }

    //handles the click of help div
    function handleHelpClick() {
        setNewGameClick(false)
        setFirstPlayerClick(false)
        setHistoryClick(false)
        setStatsClick(false)
        setQuitClick(false)
        setChatClick(false)
        if((location.pathname==="/ai"&&!winning)||(location.pathname==="/multiplayer"&&!winningM)) {
            setHelpClick(!helpClick)
        }
    }

    //handles the play click in multiplayer mode
    const handlePlayClick = () => {
        setHelpClick(false)
        setHistoryClick(false)
        setStatsClick(false)
        setQuitClick(false)
        setChatClick(false)
        if(!winningM&&!playClick) {
            setPlayClick(!playClick)
            socket.emit("play",username)
        }
        else {
            if(OKClickM) {
                socket.emit("playAgain",username)
            }
        }
    }

    //sets the hover of play div in true 
    function addPlayHover() {
        setPlayHover(true)
    }

    //sets the hover of play div in false
    function removePlayHover() {
        setPlayHover(false)
    }

    //handles the quit click in multiplayer mode
    function handleQuitClick() {
        setHelpClick(false)
        setHistoryClick(false)
        setStatsClick(false)
        setChatClick(false)
        if(!winningM&&playClick&&!droppingM) {
            setQuitClick(!quitClick)
        }
    }

    //sets the hover of quit div in true
    function addQuitHover() {
        setQuitHover(true)
    }

    //sets the hover of quit div in false
    function removeQuitHover() {
        setQuitHover(false)
    }

    //sets the hover of chat div in true 
    function addChatHover() {
        setChatHover(true)
    }

    //sets the hover of chat div in false
    function removeChatHover() {
        setChatHover(false)
    }

    //handles the chat click in multiplayer mode 
    function handleChatClick() {
        setQuitClick(false)
        setHelpClick(false)
        setHistoryClick(false)
        setStatsClick(false)
        setNewMessages(false)
        if(location.pathname==="/multiplayer"&&!winningM) {
            setChatClick(!chatClick)
        }
    }

    return (
        <div className='options'>
            <div>
                {location.pathname==="/multiplayer" ? <div className={`play ${playHover ? "playHovered" : null}`} onClick={handlePlayClick} onMouseEnter={addPlayHover} onMouseLeave={removePlayHover}>
                    {OKClickM ? "Play Again" : "Play"}
                </div>: null}
                {location.pathname==="/ai" ? <div className={`newGame ${newGameHover ? "newGameHovered" : null}`} onClick={handleNewGameClick} onMouseEnter={addNewGameHover} onMouseLeave={removeNewGameHover}>
                    New Game
                    { newGameClick ? <div className='optionsMode' onMouseLeave={addNewGameHover} onMouseEnter={removeNewGameHover}>
                        <ul>
                            <li onMouseEnter={removeNewGameHover} onClick={() => handleLevelClick("Trivial")}>Trivial</li>
                            <li onMouseEnter={removeNewGameHover} onClick={() => handleLevelClick("Medium")}>Medium</li>
                            <li onMouseEnter={removeNewGameHover} onClick={() => handleLevelClick("Hard")}>Hard</li>
                        </ul>
                    </div> : null}
                </div> : null}
                {location.pathname==="/ai" ? <div className={`firstPlayer ${firstPlayerHover ? "firstPlayerHovered" : null}`} onClick={handlefirstPlayerClick} onMouseEnter={addFirstPlayerHover} onMouseLeave={removeFirstPlayerHover}>
                    1st Player
                    { firstPlayerClick ? <div className='firstMove' onMouseLeave={addFirstPlayerHover} onMouseEnter={removeFirstPlayerHover}>
                            <ul>
                                <label htmlFor='playerYou'>
                                        <input type="radio" value="You" name="player" id="playerYou" checked={firstPlayer === "You" ? true : false} onChange={handleChange}/>
                                        You
                                </label>
                                <label htmlFor='playerAi'>
                                    <input type="radio" value="Ai" name="player" id="playerAi" checked={firstPlayer === "Ai" ? true : false} onChange={handleChange}/>
                                    Ai
                                </label>
                            </ul>
                        </div>
                    : null}
                </div> : null}
                <div className={`history ${historyHover ? "historyHovered" : null}`} onClick={handleHistoryClick} onMouseEnter={addHistoryHover} onMouseLeave={removeHistoryHover}>History</div>
                <div className={`stats ${statsHover ? "statsHovered" : null}`} onClick={handleStatsClick} onMouseEnter={addStatsHover} onMouseLeave={removeStatsHover}>Stats</div>
                { location.pathname==="/multiplayer"&&players.username1&&players.username2 ? <div className={`chat ${chatHover ? "chatHovered" : null} ${newMessages ? "chatNewMessages" : null}`} onClick={handleChatClick} onMouseEnter={addChatHover} onMouseLeave={removeChatHover}>Chat{newMessages ? <i className="fa fa-solid fa-exclamation newMessages"></i> : null}</div> : null}
                <div className={`help ${helpHover ? "helpHovered" : null}`} onClick={handleHelpClick} onMouseEnter={addHelpHover} onMouseLeave={removeHelpHover}>
                    Help 
                </div>
                {location.pathname==="/multiplayer" ? <div className={`quit ${quitHover ? "quitHovered" : null}`} onClick={handleQuitClick} onMouseEnter={addQuitHover} onMouseLeave={removeQuitHover}>
                    Quit
                </div>: null}
            </div>
            { historyClick ? <History/> : null}
            { statsClick ? <Stats/> : null}
            {helpClick ? <Help/> : null}
            { quitClick&&playClick ? <Quit socket={socket}/> : null}
            { chatClick ? <Chat socket={socket}/> : null}
        </div>
    )
}

export default GameNavbar