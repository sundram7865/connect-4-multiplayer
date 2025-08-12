import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import LoginForm from "../components/LoginForm/LoginForm"

function Login() {
    const navigate = useNavigate()
    const backendUrl = process.env.REACT_APP_BACKEND_URL

    // checks if the user is authenticated to go to the pathname home
    useEffect(() => {
        if (!backendUrl) {
            console.error("Backend URL is not set in environment variables.")
            return
        }
        axios.get(`${backendUrl}/user/home`, { withCredentials: true })
            .then(res => {
                if (res.data.authenticated) {
                    navigate("/home")
                }
            })
            .catch(error => console.error('Error sending data:', error))
    }, [backendUrl, navigate])

    // how it looks like the login form in the web page
    return (
        <LoginForm />
    )
}

export default Login
