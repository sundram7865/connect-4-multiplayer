import React from "react"
import './Navbar.css'
import { useInfo } from '../../../context/Info'
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || ""

function Navbar() {
    const { 
        buttonClicked, setButtonClicked, avatar, 
        level, username, OKClick, players 
    } = useInfo()
    const location = useLocation()
    const navigate = useNavigate()

    function handleClick() {
        if((location.pathname==="/multiplayer" && players.username1!==username && players.username2!==username)
        || (location.pathname==="/ai" && (OKClick || level===null))
        || (location.pathname==="/home")) {
            setButtonClicked(!buttonClicked)
        }
        else {
            setButtonClicked(false)
        }
    }

    async function handleSignout() {
        try {
            const res = await axios.get(`${BACKEND_URL}/user/signout`, { withCredentials:true })
            if(res.data.logout) {
                setButtonClicked(false)
                navigate("/login")
            }
        } catch(error) {
            console.log(error)
        }
    }

    async function handleDelete() {
        try {
            const res = await axios.get(`${BACKEND_URL}/user/delete`, { withCredentials:true })
            if(res.data.logout) {
                setButtonClicked(false)
                navigate("/signup")
            }
        } catch(error) {
            console.log(error)
        }
    }

    function handleMode() {
        setButtonClicked(!buttonClicked)
        navigate("/home")
    }

    return (
        <nav className="userNavbar">
            <div className="usernameButton" onClick={handleClick}>
                <span>{username}</span>
                <i className={buttonClicked ? "fa fa-caret-up" : "fa fa-caret-down"}></i>
            </div>
            <div className='avatarContainer'>
                <span className='avatar'>{avatar}</span>
            </div>
            <div className='twoOptions'>
                {buttonClicked && (
                    <div className="userDropDown">
                        {(location.pathname === "/ai" || location.pathname === "/multiplayer") && (
                            <>
                                <button className='changeModeButton' onClick={handleMode}>Change Mode</button>
                                <br/>
                            </>
                        )}
                        <button className="signoutButton" onClick={handleSignout}>Sign Out</button>
                        <br/>
                        <button className="deleteButton" onClick={handleDelete}>
                            <i className="fa fa-solid fa-trash"></i>
                            Delete Account
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
