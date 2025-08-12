import React, { useEffect } from 'react'
import axios from 'axios'
import Home from './Home'
import { useInfo } from '../context/Info'
import AiBoard from '../components/AiBoard/AiBoard'

function Ai() {
    const { historyClick, setListItems } = useInfo()
    const backendUrl = process.env.REACT_APP_BACKEND_URL

    useEffect(() => {
        // Fetch all AI game history from backend URL
        axios.get(`${backendUrl}/ai/find-all-games`, { withCredentials: true })
            .then(res => {
                if (res.data) {
                    setListItems(res.data)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }, [historyClick, setListItems, backendUrl])

    return (
        <div>
            <Home />
            <AiBoard />
        </div>
    )
}

export default Ai
