import React, { useState } from "react"
import SignupErrors from './SignupErrors.js'
import axios from 'axios'
import { Link } from "react-router-dom"
import EnvelopeIcon from './EnvelopeIcon.js'
import UserIcon from './UserIcon.js'
import PasswordIcon from './PasswordIcon.js'
import XmarkIcon from './XmarkIcon.js'
import { containsUppercaseAndLowercase, containsSpecialCharacter } from '../../utils/signupFunctions.js'
import './SignupForm.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || ""

function SignupForm() {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = window.location.port
    const initialData = {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirm: "",
        protocol: protocol,
        hostname: hostname,
        port: port
    }
    const initialWarning = {
        firstname: false,
        lastname: false,
        username: false,
        email: false,
        passwordLength: false,
        passwordCase: false,
        passwordSpecial: false,
        confirm: false,
        usernameDatabase: false,
        emailDatabase: false
    }
    const [data, setData] = useState(initialData)
    const [warning, setWarning] = useState(initialWarning)
    const [verify, setVerify] = useState(false)
    const [countVerify, setCountVerify] = useState(null)

    function handleChange(e) {
        const { name, value } = e.target
        setWarning(initialWarning)
        setData((prevData) => {
            return { ...prevData, [name]: value }
        })
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault()
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (
            data.firstname === "" || data.lastname === "" || data.username === "" ||
            data.password.length < 8 || !containsUppercaseAndLowercase(data.password) ||
            !containsSpecialCharacter(data.password) || data.password !== data.confirm || data.confirm === ""
        ) {
            setWarning({
                ...warning,
                firstname: data.firstname === "",
                lastname: data.lastname === "",
                username: data.username === "",
                email: data.email,
                passwordLength: data.password.length < 8,
                passwordCase: !containsUppercaseAndLowercase(data.password),
                passwordSpecial: !containsSpecialCharacter(data.password),
                confirm: data.password !== data.confirm || data.confirm === ""
            })
        } else {
            try {
                if (countVerify === null) {
                    const res = await axios.post(`${BACKEND_URL}/user/signup`, data, { withCredentials: true })
                    if (res.data.success) {
                        setVerify(true)
                        setCountVerify(1)
                    } else {
                        if (res.data.message === "Invalid username") {
                            setWarning({
                                ...warning,
                                usernameDatabase: true
                            })
                        } else if (res.data.message === "Invalid email") {
                            setWarning({
                                ...warning,
                                emailDatabase: true
                            })
                        }
                    }
                }
            } catch (error) {
                console.error('Error sending data:', error);
            }
        }
    }

    return (
        <div className="signupContainer">
            <form className="signupForm" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <label htmlFor="firstname">Firstname<sup>*</sup></label>
                <div>
                    <UserIcon />
                    <input id="firstname" className={warning.firstname ? "redInput" : "signupFirstname"} autoComplete="off" type="text" placeholder="Enter your firstname" value={data.firstname} name="firstname" onChange={handleChange} onKeyDown={handleKeyDown} />
                    {warning.firstname ? <XmarkIcon emailChoice={false} /> : null}
                </div>
                <label htmlFor="lastname">Lastname<sup>*</sup></label>
                <div>
                    <UserIcon />
                    <input id="lastname" className={warning.lastname ? "redInput" : "signupLastname"} autoComplete="off" type="text" placeholder="Enter your lastname" value={data.lastname} name="lastname" onChange={handleChange} onKeyDown={handleKeyDown} />
                    {warning.lastname ? <XmarkIcon emailChoice={false} /> : null}
                </div>
                <label htmlFor="email">Email<sup>*</sup></label>
                <div>
                    <EnvelopeIcon />
                    <input id="email" className={warning.email || warning.emailDatabase ? "redInputEmail" : "signupEmail"} autoComplete="off" type="text" placeholder="Enter your email" value={data.email} name="email" onChange={handleChange} onKeyDown={handleKeyDown} />
                    {warning.email || warning.emailDatabase ? <XmarkIcon emailChoice={true} /> : null}
                </div>
                <label htmlFor="username">Username<sup>*</sup></label>
                <div>
                    <UserIcon />
                    <input id="username" className={warning.username || warning.usernameDatabase ? "redInput" : "signupUsername"} autoComplete="off" type="text" placeholder="Enter your username" value={data.username} name="username" onChange={handleChange} onKeyDown={handleKeyDown} />
                    {warning.username || warning.usernameDatabase ? <XmarkIcon emailChoice={false} /> : null}
                </div>
                <label htmlFor="password">Password<sup>*</sup></label>
                <div>
                    <PasswordIcon />
                    <input id="password" className={warning.passwordLength || warning.passwordCase || warning.passwordSpecial ? "redInput" : "signupPassword"} type="password" placeholder="Enter your password" value={data.password} name="password" onChange={handleChange} onKeyDown={handleKeyDown} />
                    {warning.passwordLength || warning.passwordCase || warning.passwordSpecial ? <XmarkIcon emailChoice={false} /> : null}
                </div>
                <label htmlFor="confirm">Confirm Password<sup>*</sup></label>
                <div>
                    <PasswordIcon />
                    <input id="confirm" className={warning.confirm ? "redInput" : "signupConfirm"} type="password" placeholder="Enter your password again" value={data.confirm} name="confirm" onChange={handleChange} onKeyDown={handleKeyDown} />
                    {warning.confirm ? <XmarkIcon emailChoice={false} /> : null}
                </div>
                <div className="signupSubmit">
                    <input type="submit" name="Login" value="Sign Up" />
                </div>
                <div className="signupFooter">
                    Have already an account? <Link className="loginLink" to="/login">Login</Link>
                </div>
            </form>
            <SignupErrors warning={warning} verify={verify} />
        </div>
    )
}

export default SignupForm
