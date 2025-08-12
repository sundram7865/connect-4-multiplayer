import React from "react"
import axios from 'axios'
import { useInfo } from "../../../context/Info"
import { useLocation } from "react-router-dom"
import './GameNavbar.css'

//component for the history in the game navabar that shows the previous games
//in the ai or multiplayer mode
function History() {
    const {
        listItems, setListItems, listItemsM, setListItemsM, setHistoryHover
    } = useInfo()
    const location = useLocation()

    //handles the deletion of the ai games in history
    const handleDeleteGames = async () => {

        try {
            await axios.get("/ai/delete-games", {withCredentials:true})
            setListItems([])
        }catch(error) {
            console.log(error)
        }
    }

    //handles the deletion of the multiplayer games in history
    const handleDeleteGamesM = async () => {

        try {
            await axios.get("/multiplayer/delete-games", {withCredentials:true})
            setListItemsM([])
        }catch(error) {
            console.log(error)
        }
    }

    //sets the hover of history div in false
    function removeHistoryHover() {
        setHistoryHover(false)
    }

    return (
        <div className='historyInfo' onMouseEnter={removeHistoryHover}>
            <ol>
                {location.pathname==="/ai" ? <button onClick={handleDeleteGames}>Delete All</button>: null}
                {location.pathname==="/ai" ? listItems.map((element) => {

                    return <li key={element.gameId}>{`${element.datetime}, FirstPlayer: ${element.firstplayer}, Level: ${element.level}, Winner: ${element.winner}`}</li>
                }) : null }
                {location.pathname==="/multiplayer" ? <button onClick={handleDeleteGamesM}>Delete All</button>: null}
                {location.pathname==="/multiplayer" ? listItemsM.map((element) => {

                    return <li key={element.gameId}>{`${element.datetime}, FirstPlayer: ${element.firstplayer}, Opponent: ${element.opponent}, Winner: ${element.winner}`}</li>
                }) : null }
            </ol>
        </div>
    )
}

export default History