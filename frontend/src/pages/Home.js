import React, { useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios'
import GameButtons from '../components/Navbars/UserNavbar/GameButtons'
import { useInfo } from '../context/Info'
import Navbar from '../components/Navbars/UserNavbar/Navbar'
import GameNavbar from '../components/Navbars/GameNavbar/GameNavbar'

function Home({socket}) {
    const navigate = useNavigate()
    const location = useLocation()
    const { 
        buttonClicked, setButtonClicked, setFirstPlayerClick, setFirstPlayer, level ,setLevel, 
        setHelpClick,setHistoryClick, setDropping, setWinning, setStatsClick, setNewGameClick, 
        username, setUsername, setAvatar, setWinningM, setQuitClick, setDroppingM, players, 
        setChatClick, setPlayClick, setOKClickM, setPlayers, setTime, OKClick, setOKClick 
    } = useInfo()

    //if dropping a checker and username button is true makes it false to close
    useEffect(() => {
        if((location.pathname==="/ai"&&(!OKClick&&level!==null)&&buttonClicked)||
        (location.pathname==="/multiplayer"&&(players.username1||players.username2))) {
            setButtonClicked(false)
        }
    },[buttonClicked,OKClick,location.pathname,players,level,setButtonClicked])

    //checks if the user continues to be active otherwise goes to the login form and signs out the user
    useEffect(() => {
        axios.get("/user/home",{withCredentials:true}).then (res => {
            if(res.data.authenticated) {
                setUsername(res.data.username)
                setAvatar(res.data.avatar)
            }
            else {
                navigate("/login")
            }
        }).catch(error => console.error('Error sending data:', error))
    })

    //when leaves from ai or multiplayer mode initializes all variables
    useEffect(() => {
        if(location.pathname==="/home") {
            setHelpClick(false)
            setHistoryClick(false)
            setFirstPlayerClick(false)
            setStatsClick(false)
            setNewGameClick(false)
            setLevel(null)
            setDropping(false)
            setOKClick(false)
            setWinning(null)
            setFirstPlayer("You")
            setPlayClick(false)
            setQuitClick(false)
            setDroppingM(false)
            setWinningM(null)
            setOKClickM(false)
            setChatClick(false)
            setPlayers({username1:null,username2:null})
            setTime({
                timeP1: 60,
                timeP2: 60
            })
            axios.get("/ai/clear-data",{withCredentials:true}).then((res)=> {
            }).catch((error) => {
                console.log(error)
            })
            axios.get("/multiplayer/clear-data",{withCredentials:true}).then((res)=> {
            }).catch((error) => {
                console.log(error)
            })
        }
    },[location.pathname,setHelpClick,setHistoryClick,setLevel,setDropping,
        setWinning,setFirstPlayer,setStatsClick,setNewGameClick,setDroppingM,
        setWinningM,setPlayClick,setQuitClick,setOKClickM,username,setChatClick,
        setPlayers,setTime,setOKClick,setFirstPlayerClick])

    //how it looks like the gameEntrance path in the web page and how it is used in ai and multiplayer path
    return (
        <div>
            <Navbar />
            {location.pathname==="/home" ? <GameButtons/> : null}
            {location.pathname==="/ai"||location.pathname==="/multiplayer" ? <GameNavbar socket={socket}/> : null}
        </div>
    )
}

export default Home