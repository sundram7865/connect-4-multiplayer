import React, { useState, useEffect } from "react"
import axios from 'axios'
import { useLocation } from "react-router-dom"
import { useInfo } from '../../../context/Info'
import './GameNavbar.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || ""

function Stats() {
    const [totalGames,setTotalGames] = useState(null)
    const [totalGamesM, setTotalGamesM] = useState(null)
    const [totalOpponentGamesM, setTotalOpponentGamesM] = useState(null)
    const {
        statsClick, opponent, username, setStatsHover
    } = useInfo()
    const location = useLocation()

    useEffect(() => {
        if(statsClick) {
            axios.get(`${BACKEND_URL}/ai/find-total-games`, { withCredentials:true }).then((res) => {
                setTotalGames(res.data.games)
            }).catch(error => {
                console.log(error)
            })
        }
    },[statsClick])

    useEffect(() => {
        if(statsClick) {
            axios.get(`${BACKEND_URL}/multiplayer/find-total-games`, {
                params:{opponent:opponent},
                withCredentials:true
            }).then((res) => {
                setTotalGamesM(res.data.games)
                setTotalOpponentGamesM(res.data.opponentGames)
            }).catch(error => {
                console.log(error)
            })
        }
    },[statsClick,opponent])

    function removeStatsHover() {
        setStatsHover(false)
    }

    return (
        <div className={location.pathname==="/ai" ? "aiBoard" : "multiplayerBoard"} onMouseEnter={removeStatsHover}>
            <ul>
                {location.pathname==="/ai" ? <li>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Trivial</th>
                                <th>Medium</th>
                                <th>Hard</th>
                            </tr>
                        </thead>
                        {totalGames ?
                            <tbody>
                                <tr>
                                    <th>Total:</th>
                                    <td>{totalGames.trivial.total}</td>
                                    <td>{totalGames.medium.total}</td>
                                    <td>{totalGames.hard.total}</td>
                                </tr>
                                <tr>
                                    <th>Win:</th>
                                    <td>{totalGames.trivial.win}</td>
                                    <td>{totalGames.medium.win}</td>
                                    <td>{totalGames.hard.win}</td>
                                </tr>
                                <tr>
                                    <th>Defeat:</th>
                                    <td>{totalGames.trivial.defeat}</td>
                                    <td>{totalGames.medium.defeat}</td>
                                    <td>{totalGames.hard.defeat}</td>
                                </tr>
                                <tr>
                                    <th>Draw:</th>
                                    <td>{totalGames.trivial.draw}</td>
                                    <td>{totalGames.medium.draw}</td>
                                    <td>{totalGames.hard.draw}</td>
                                </tr>
                                <tr>
                                    <th>Win Percentage:</th>
                                    <td>{totalGames.trivial.total === 0 ? "0.00" :(((totalGames.trivial.win+0.5*totalGames.trivial.draw)/totalGames.trivial.total)*100).toFixed(2)}%</td>
                                    <td>{totalGames.medium.total === 0 ? "0.00" :(((totalGames.medium.win+0.5*totalGames.medium.draw)/totalGames.medium.total)*100).toFixed(2)}%</td>
                                    <td>{totalGames.hard.total === 0 ? "0.00" :(((totalGames.hard.win+0.5*totalGames.hard.draw)/totalGames.hard.total)*100).toFixed(2)}%</td>
                                </tr>
                            </tbody>: null}
                    </table>
                </li> : null}
                {location.pathname==="/multiplayer" ? <li>
                <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>{username}</th>
                                { opponent ? <th>{opponent}</th> : null}
                            </tr>
                        </thead>
                        {totalGamesM ?
                            <tbody>
                                <tr>
                                    <th>Total:</th>
                                    <td>{totalGamesM.total}</td>
                                    { opponent && totalOpponentGamesM ? <td>{totalOpponentGamesM.total}</td> : null}
                                </tr>
                                <tr>
                                    <th>Win:</th>
                                    <td>{totalGamesM.win}</td>
                                    { opponent && totalOpponentGamesM ? <td>{totalOpponentGamesM.win}</td> : null}
                                </tr>
                                <tr>
                                    <th>Defeat:</th>
                                    <td>{totalGamesM.defeat}</td>
                                    { opponent && totalOpponentGamesM ? <td>{totalOpponentGamesM.defeat}</td> : null}
                                </tr>
                                <tr>
                                    <th>Draw:</th>
                                    <td>{totalGamesM.draw}</td>
                                    { opponent && totalOpponentGamesM ? <td>{totalOpponentGamesM.draw}</td> : null}
                                </tr>
                                <tr>
                                    <th>Win Percentage:</th>
                                    <td>{totalGamesM.total === 0 ? "0.00" :(((totalGamesM.win+0.5*totalGamesM.draw)/totalGamesM.total)*100).toFixed(2)}%</td>
                                    { opponent && totalOpponentGamesM ? <td>{totalOpponentGamesM.total === 0 ? "0.00" :(((totalOpponentGamesM.win+0.5*totalOpponentGamesM.draw)/totalOpponentGamesM.total)*100).toFixed(2)}%</td> : null}
                                </tr>
                            </tbody>: null}
                    </table>
                </li> : null}
            </ul>
        </div>
    )
}

export default Stats
