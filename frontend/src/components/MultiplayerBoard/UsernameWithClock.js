import React, { useEffect } from 'react'
import { useInfo } from '../../context/Info'
import './UsernameWithClock.css'

//creates the circle countdown timer 
function UsernameWithClock(props) {
    const { setTime } = useInfo()

    useEffect(() => {
        let counter
        
        if(props.playing) {
            counter = setInterval(() => {
                if(props.time!==0&&props.time>0) {
                    if(props.p==="P1") {
                        setTime({
                            timeP1:props.time-1,
                            timeP2:60
                        })
                    }
                    else {
                        setTime({
                            timeP1:60,
                            timeP2:props.time-1
                        })
                    }
                    props.socket.emit("checkTime",props.room,props.turn)
                    if(props.time-1===0) {
                        props.socket.emit("timeIsOver",props.room,props.turn)
                    }
                }
            }, 1000)
        }
        
        return () => {
            clearInterval(counter)
        }
    },[props.time,props.turn,props.socket,props.room,props.playing,props.p,setTime])

    return (
        <div className='userWithClock'>
            <div className='userNextToClock'>{props.username}</div>
            <div className='circleTimer'>
                {props.playing ? (props.time>=10 ? props.time : "0"+props.time) : props.time===0 ? "0"+props.time : 60}
            </div>
            { props.time === 0 && ((props.username===props.turnUsername)||(props.first&&props.turn===null))  ? <div className="timer">Time is over!</div> : null}
        </div>
    )
}

export default UsernameWithClock