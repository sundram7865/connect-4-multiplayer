import React, { useState } from "react"
import UserIcon from "../SignupForm/UserIcon.js"
import PasswordIcon from "../SignupForm/PasswordIcon.js"
import { Link, useNavigate } from "react-router-dom"
import LoginErrors from "./LoginErrors"
import './LoginForm.css'
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'

//component for the login form
function LoginForm() {
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [warning, setWarning] = useState(false)
    const [notVerify, setNotVerify] = useState(null)
    const navigate = useNavigate()

    //disable the enter key for submision of the form
    function handleKeyDown(e) {
        if(e.key==="Enter") {
            e.preventDefault()
        }
    }

    //handles the submission and checks if there is an error and if not goes to the pathname /GameEntrance
    function handleSubmit(e) {
        e.preventDefault()
        axios.post("/user/login",{
            username:username,
            password:password
        },{withCredentials:true}).then(res => {
            if(res.data.success) {
                navigate(res.data.redirectUrl)
            }
            else {
                if(res.data.message==="Invalid credentials") {
                    setWarning(true)
                }
                else {
                    setNotVerify(res.data.message)
                }
            }
        }).catch(error => {
            console.error('Error sending data:', error)
        })
    }

    return (
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <label htmlFor="username">Username</label>
                <div>
                    <UserIcon/>
                    <input id="username" className="loginUsername" autoComplete="off" type="text" placeholder="Enter your username" value={username} name="username" onChange={(e) => { 
                        setWarning(false)
                        setUsername(e.target.value)}} onKeyDown={handleKeyDown}/>
                </div>
                <label htmlFor="password">Password</label>
                <div>
                    <PasswordIcon/>
                    <input id="password" className="loginPassword" type="password" placeholder="Enter your password" value={password} name="password" onChange={(e) => { 
                        setWarning(false)
                        setPassword(e.target.value)}} onKeyDown={handleKeyDown}/>
                </div>
                <div className="loginSubmit">
                    <input type="submit" name="Login" value="Login"/>
                </div>
                <div className="loginFooter">
                    Don't have an account? <Link className="signupLink" to="/signup">Sign Up</Link>
                </div>
            </form>
            <LoginErrors warning={warning} notVerify={notVerify}/>
        </div>
    )
}

export default LoginForm