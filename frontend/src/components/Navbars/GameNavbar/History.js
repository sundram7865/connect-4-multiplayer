import React from "react"
import axios from 'axios'
import { useInfo } from "../../../context/Info"
import { useLocation } from "react-router-dom"
import './GameNavbar.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || ""

function History() {
    const {
        listItems, setListItems, listItemsM, setListItemsM, setHistoryHover
    } = useInfo()
    const location = useLocation()

    const handleDeleteGames = async () => {
        try {
            await axios.get(`${BACKEND_URL}/ai/delete-games`, { withCredentials: true })
            setListItems([])
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteGamesM = async () => {
        try {
            await axios.get(`${BACKEND_URL}/multiplayer/delete-games`, { withCredentials: true })
            setListItemsM([])
        } catch (error) {
            console.log(error)
        }
    }

    function removeHistoryHover() {
        setHistoryHover(false)
    }

    return (
        <div className='historyInfo' onMouseEnter={removeHistoryHover}>
            <ol>
                {location.pathname === "/ai" && <button onClick={handleDeleteGames}>Delete All</button>}
                {location.pathname === "/ai" && listItems.map((element) => (
                    <li key={element.gameId}>
                        {`${element.datetime}, FirstPlayer: ${element.firstplayer}, Level: ${element.level}, Winner: ${element.winner}`}
                    </li>
                ))}
                {location.pathname === "/multiplayer" && <button onClick={handleDeleteGamesM}>Delete All</button>}
                {location.pathname === "/multiplayer" && listItemsM.map((element) => (
                    <li key={element.gameId}>
                        {`${element.datetime}, FirstPlayer: ${element.firstplayer}, Opponent: ${element.opponent}, Winner: ${element.winner}`}
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default History
