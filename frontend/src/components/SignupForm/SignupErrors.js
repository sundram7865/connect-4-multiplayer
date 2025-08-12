import React from "react"
import './SignupErrors.css'

//error message for email
function ErrorEmailMessage() {
    return (
        <li>Invalid email.</li>
    )
}

//error messages for password
function ErrorPasswordMessage(props) {
    return (
        props.length ? <li>The password must be at least 8 characters.</li> :
        props.case ? <li>The password must contain one uppercase and one lowercase character.</li> :
        props.special ? <li>The password must contain at least one special character '#','!','&','*' or '$'.</li> : null
    )
}

//error message for confirm password
function ErrorConfirmMessage() {
    return (
        <li>The confirm password must be same with the password.</li>
    )
}

//error messages from the check from the database in submission of the form
function ErrorDatabaseMessage(props) {
    let message
    if(props.choice==="username") {
        message = <li>The username already exists.<br/>Try again with different username!</li> 
    }
    else if(props.choice==="email") {
        message = <li>The email already exists.<br/>Try again with different email!</li>
    }
    return message
}

//component about signup errors
function SignupErrors(props) {
    return (
        <div className={props.warning.email||props.warning.passwordLength||
        props.warning.passwordCase||props.warning.passwordSpecial||
        props.warning.confirm||props.warning.usernameDatabase||props.warning.emailDatabase||props.verify ? 'listErrors' : null}>
            <ol>
                {props.warning.email||props.warning.passwordLength||
                props.warning.passwordCase||props.warning.passwordSpecial||
                props.warning.confirm||props.warning.usernameDatabase||props.warning.emailDatabase ? <h2>Errors</h2> : null}
                {props.warning.email ? <ErrorEmailMessage/> : null}
                {props.warning.passwordLength ? <ErrorPasswordMessage length={true} case={false} special={false}/> : null}
                {props.warning.passwordCase ? <ErrorPasswordMessage length={false} case={true} special={false}/> : null}
                {props.warning.passwordSpecial ? <ErrorPasswordMessage length={false} case={false} special={true}/> : null}
                {props.warning.confirm ? <ErrorConfirmMessage/> : null}
                {props.warning.usernameDatabase ? <ErrorDatabaseMessage choice={"username"}/> : null}
                {props.warning.emailDatabase ? <ErrorDatabaseMessage choice={"email"}/> : null}
                {props.verify ? <h>you can log in now</h> : null}
            </ol>
        </div>
    )
}

export default SignupErrors