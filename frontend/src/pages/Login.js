import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import LoginForm from "../components/LoginForm/LoginForm"

function Login() {
    const navigate = useNavigate()

    //checks if the user is authenticated to go to the pathname home
    useEffect(() => {
        axios.get("/user/home",{withCredentials:true}).then (res => {
            if(res.data.authenticated) {
                navigate("/home")
            }
        }).catch(error => console.error('Error sending data:', error))
    })

    //how it looks like the login form in the web page
    return (
        <LoginForm />
    )
}

export default Login