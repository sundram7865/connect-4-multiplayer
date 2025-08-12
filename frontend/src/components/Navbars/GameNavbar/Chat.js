import React, { useState, useEffect, useRef } from "react"
import { useInfo } from '../../../context/Info'
import './GameNavbar.css'

//component for the chat in the game navabar that allows two players 
//in the multiplayer game to communicate
function Chat({socket}) {
    const {
        messages, username, setChatHover, chatClick
    } =  useInfo()
    const [message, setMessage] = useState("")
    const chatContainerRef = useRef()

    //is used for showing the latest message when a player sends a message in the chat
    useEffect(() => {
        if(chatClick) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages,chatClick])

    //sets the hover of chat div in false
    function removeChatHover() {
        setChatHover(false)
    }

    //handles the changes of the message that the user is typing
    function handleMessageChange(e) {
        setMessage(e.target.value)
    }

    //handles the sending of the message of the chat in multiplayer mode
    function handleSendMessage() {
        if(message!=="") {
            let hours = new Date().getHours()
            let minutes = new Date().getMinutes()
            minutes = minutes < 10 ? 0+`${minutes}` : `${minutes}`
            socket.emit("chatShowMessages",messages,{message: message, sender: username, time: `${hours}:`+minutes})
            setMessage("")
        }
    }

    return (
        <div className='chatBox' onMouseEnter={removeChatHover}>
            <div className='chatMessages' ref={chatContainerRef}>
                <ul>
                    {messages.map((element,index) => {
                        let styling, backgroundColor, borderRadius

                        if (element.sender===username) {
                            styling="flex-end"
                            backgroundColor="#168ae3"
                            borderRadius="1em 0 1em 1em"
                        }
                        else {
                            styling="flex-start"
                            backgroundColor="#61a4d7"
                            borderRadius="0 1em 1em 1em"
                        }

                        return (<li key={index} style={{alignItems:styling}}>
                            <div>
                                {element.sender}
                            </div>
                            <div style={{backgroundColor:backgroundColor,borderRadius:borderRadius}}>
                                {element.message}
                            </div>
                            <div style={styling==="flex-end" ? {paddingRight:"10px"} : {paddingLeft:"10px"}}>
                                {element.time}
                            </div>
                        </li>)
                    })}
                </ul>
            </div>
            <div className='chatMessageInput'>
                <input id="message" type='text' placeholder='Type your message' value={message} autoComplete="off" name="message" onChange={handleMessageChange} onKeyDown={(e) => {
                    if(e.key==="Enter") {
                        handleSendMessage()
                    }
                }}/>
                <div onClick={handleSendMessage}>
                    <i className="fa fa-solid fa-paper-plane"></i>
                </div>
            </div>
        </div>
    )
}

export default Chat