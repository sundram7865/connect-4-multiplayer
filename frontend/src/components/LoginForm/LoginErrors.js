import React from "react"
import './LoginErrors.css'

//component about login errors
function LoginErrors(props) {
    return (
        <div className={ props.warning||props.notVerify ? "error" : null}>
            {props.warning||props.notVerify ? <h2>Error</h2> : null}
            {props.warning && <p>Invalid username or password.<br/>Try again!</p>}
            {props.notVerify && <p>{props.notVerify}<br/>Go to your email account and click on the link that is sent to verify your email!</p>}
        </div>
    )
}

export default LoginErrors