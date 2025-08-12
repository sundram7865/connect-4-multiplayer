import React from "react"
import './Navbar.css'
import { useInfo } from '../../../context/Info'
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios'

//component for the navbar that shows the avatar, username and gives the ability
//to make signout or delete account 
function Navbar() {
    const { 
        buttonClicked, setButtonClicked, avatar, 
        level, username, OKClick, players 
    } = useInfo()
    const location = useLocation()
    const navigate = useNavigate()

    //handles the click of the profile to show or not the signout and deletion
    function handleClick() {
        if((location.pathname==="/multiplayer"&&players.username1!==username&&players.username2!==username)
        ||(location.pathname==="/ai"&&(OKClick||level===null))||(location.pathname==="/home")) {
            setButtonClicked(!buttonClicked)
        }
        else {
            setButtonClicked(false)
        }
    }

    //handles the signout and if there is not an error goes to the login path
    async function handleSignout() {
        const res = await axios.get("/user/signout",{withCredentials:true})
        if(res.data.logout) {
            setButtonClicked(false)
            navigate("/login")
        }
    }

    //handles the deletion and if there is not an error goes to the signup path
    async function handleDelete() {
        const res = await axios.get("/user/delete",{withCredentials:true})
        if(res.data.logout) {
            setButtonClicked(false)
            navigate("/signup")
        }
    }

    //handles the change of mode and go back to home path
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
                        {location.pathname==="/ai"||location.pathname==="/multiplayer" ? <button className='changeModeButton' onClick={handleMode}>Change Mode</button> : null}
                        {location.pathname==="/ai"||location.pathname==="/multiplayer" ? <br/> : null }
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