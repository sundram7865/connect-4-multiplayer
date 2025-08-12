import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from '../pages/Login.js'
import Signup from '../pages/Signup.js'
import Home from '../pages/Home.js'
import Ai from '../pages/Ai.js'
import Multiplayer from '../pages/Multiplayer.js'


function Connect4Routes({socket}) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login"/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/> 
            <Route path="/home" element={<Home/>}/>
            <Route path="/ai" element={<Ai/>}/>
            <Route path="/multiplayer" element={<Multiplayer socket={socket}/>}/>

        </Routes>
    )
}

export { Connect4Routes }