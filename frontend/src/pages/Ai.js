import React, { useEffect } from 'react'
import axios from 'axios'
import Home from './Home'
import { useInfo } from '../context/Info'
import AiBoard from '../components/AiBoard/AiBoard'

function Ai() {
    const { historyClick, setListItems } = useInfo()

    //finds all games from history to be shown when the player clicks to history button
    useEffect(() => {

        axios.get("/ai/find-all-games",{withCredentials:true}).then((res) => {
            if(res.data) {
                setListItems(res.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    },[historyClick,setListItems])

    //how it looks like the ai path with representation of ai playing with a player
    return (
        <div>
            <Home/>
            <AiBoard/>
        </div>
    )
}

export default Ai