import './XmarkIcon.css'
import 'font-awesome/css/font-awesome.min.css'
import React from "react"

//component about the X icon for the input fields
function XmarkIcon(props) {
    return (
        <i className={props.emailChoice ? "fa fa-times xIconEmail" : "fa fa-times xIcon"}></i>
    )
}

export default XmarkIcon