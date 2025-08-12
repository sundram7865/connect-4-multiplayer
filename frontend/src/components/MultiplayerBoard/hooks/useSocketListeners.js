import { useEffect, useState, useRef } from 'react'
import { useInfo } from '../../../context/Info'
import { animateDrop } from '../../../utils/gameFunctions'
import { GameData } from '../../../classes/GameData'
import axios from 'axios'

//hook that checks/handles the socket listeners that are useful for the multiplayer mode
//and the communication with the server
export const useSocketListeners = (socket) => {
    const { username, winningM, setWinningM, setQuitInitally, OKClickM, 
        setOKClickM, setSecondPlayer, setHelpClick, setHistoryClick, time, setTime,
        setStatsClick, setQuitClick, setDroppingM, players ,setPlayers, 
        opponent, setOpponent, setMessages, chatClick ,setChatClick,
        setQuitYes, setNewMessages, p1, setP1, p2, setP2, playerTurnM, setPlayerTurnM, 
        setPlayerTurnUsernameM, playingM, setPlayingM } = useInfo()
    const initialBoard = [
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W']
    ]
    const [boardState,setBoardState] = useState(new GameData(initialBoard))
    const buttons = useRef(null)
    const [playAgainText, setPlayAgainText] = useState(null)
    const [noPlayAgain, setNoPlayAgain] = useState(false)
    const [beginDatetime, setBeginDatetime] = useState(null)
    const [firstPlayerForThisGame, setFirstPlayerForThisGame] = useState(null)
    const [winner, setWinner] = useState(null)

    useEffect(() => {

        //sets the opponent for the history
        if(p1.username&&p2.username) {

            socket.on("setMessages", (messages,currentMessage) => {
                setMessages([...messages,currentMessage])
                if(!chatClick) {
                    setNewMessages(true)
                }
                else {
                    setNewMessages(false)
                }
            })

            socket.on("setOpponent", (opponent) => {
                setOpponent(opponent)
            })
        }

        //handles the answer no in play again question
        socket.on("noIsAnswer", () => {
            setNoPlayAgain(true)
        })

        //clear the data when a game starts from play again
        socket.on("clearData", () => {
            setBoardState(new GameData([
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W']
            ]))
            setPlayerTurnM(null)
            setPlayerTurnUsernameM(null)
            setWinningM(null)
            setOKClickM(false)
            setTime({
                ...time,
                timeP1:60,
                timeP2:60
            })
            setPlayAgainText(null)
            setDroppingM(false)
            setNoPlayAgain(false)
            setHistoryClick(false)
            setHelpClick(false)
            setStatsClick(false)
            setChatClick(false)
            setQuitClick(false)
            const now = new Date()

            const year = now.getFullYear()
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')
            const hours = String(now.getHours()).padStart(2, '0')
            const minutes = String(now.getMinutes()).padStart(2, '0')
            const seconds = String(now.getSeconds()).padStart(2, '0')

            const formattedDate = `${year}.${month}.${day} - ${hours}:${minutes}:${seconds}`

            setBeginDatetime(formattedDate)
        })

        //makes the question to the opponent and is waiting for an answer
        socket.on("doYouWantToPlayAgain", (text) => {
            setPlayAgainText(text)
        })

        //if time is over check who wins
        if(time.timeP1===0||time.timeP2===0) {
            socket.on("timeState", (winner) => {
                if(!OKClickM) {
                    setWinningM(winner)
                }
                if(winner!==null) {
                    setHistoryClick(false)
                    setHelpClick(false)
                    setStatsClick(false)
                    setChatClick(false)
                    setQuitClick(false)
                }
                if(winner==="won") {
                    setWinner("You")
                }
                else if(winner==="lost") {
                    setWinner(opponent)
                }
                else if(winner==="draw") {
                    setWinner("Draw")
                }
            })
        }

        //sets who player plays, because if player's turn is changed the timer is initializing and the timer of the other starts
        socket.on("updatePlaying",(data) => {
            setPlayingM({
                ...playingM,
                playingP1:data.playingP1,
                playingP2:data.playingP2
            })
        })

        //updates the board when a move made
        socket.on("updateBoard", async (board,player,playerUsername,rowIndex,colIndex,color,winner) => {
            if(color==="red"&&rowIndex!==null) {
                setDroppingM(true)
                await animateDrop(rowIndex,colIndex,'darkred',0,buttons)
            }
            else if(color==="yellow"&&rowIndex!==null) {
                setDroppingM(true)
                await animateDrop(rowIndex,colIndex,'goldenrod',0,buttons)
            }
            setBoardState(new GameData(board))
            setPlayerTurnM(player)
            socket.emit("checkTime",p1.room,player)
            setPlayerTurnUsernameM(playerUsername)
            setWinningM(winner)
            if(winner!==null) {
                setHistoryClick(false)
                setHelpClick(false)
                setStatsClick(false)
                setChatClick(false)
                setQuitClick(false)
            }
            setDroppingM(false)
            if(winner==="won") {
                setWinner("You")
            }
            else if(winner==="lost") {
                setWinner(opponent)
            }
            else if(winner==="draw") {
                setWinner("Draw")
            }
        })

        //if some player join in a new room, sets the first player(P1)
        socket.on("updateJoin", (data) => {
            setP1({
                ...p1,
                username: data.username,
                firstPlayer: data.firstPlayer,
                color: data.color,
                room: data.room
            })
            setPlayers({
                ...players,
                username1: data.username,
                username2: null
            })
        })

        //if a room is fulled sets the first and the second player(P1 and P2) and the game begins
        socket.on("gameRoomFulled", (data) => {
            
            setP1({
                ...p1,
                username: data.p1.username,
                firstPlayer: data.p1.firstPlayer,
                color: data.p1.color,
                room: data.p1.room
            })
            setP2({
                ...p2,
                username: data.p2.username,
                firstPlayer: data.p2.firstPlayer,
                color: data.p2.color,
                room: data.p2.room
            })
            setSecondPlayer(data.p2.username)
            setPlayers({
                ...players,
                username1: data.p1.username,
                username2: data.p2.username
            })
            const now = new Date()

            const year = now.getFullYear()
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')
            const hours = String(now.getHours()).padStart(2, '0')
            const minutes = String(now.getMinutes()).padStart(2, '0')
            const seconds = String(now.getSeconds()).padStart(2, '0')

            const formattedDate = `${year}.${month}.${day} - ${hours}:${minutes}:${seconds}`

            setBeginDatetime(formattedDate)
            if(username===data.p1.username) {
                setFirstPlayerForThisGame("You")
            }
            else {
                setFirstPlayerForThisGame(data.p1.username)
            }
            socket.emit("findOpponent",data.p1.room)
            socket.emit("checkTime",data.p1.room,playerTurnM)
        })

        //saves a multiplayer game for the history for a user
        const saveGame = (data) => {
            axios.get("/multiplayer/add-game",{
                params: data,
                withCredentials:true
            }).then((res) => {
                if(res.data.success) {
                    setWinningM(null)
                    setOKClickM(false)
                }
            }).catch((error) => {
                console.log(error)
            })
        }

        //handles the quit, if there is a winner or saves the game if the opponent did not have time to save the game  
        //and initializes the state of the two players
        socket.on("quitUpdate",(data,quitUser) => {
            if(data===0||username!==data.p1.username) {
                setP1({
                    ...p1,
                    username: null,
                    firstPlayer: false,
                    color: null,
                    room: -1
                })
                setP2({
                    ...p2,
                    username: null,
                    firstPlayer: false,
                    color: null,
                    room: -1
                })
                setSecondPlayer(null)
                setPlayers({
                    ...players,
                    username1: null,
                    username2: null
                })
            }
            else {
                if(username===data.p1.username) {
                    setP1({
                        ...p1,
                        username: data.p1.username,
                        firstPlayer: true,
                        color: data.p1.color,
                        room: data.p1.room
                    })
                    setP2({
                        ...p2,
                        username: null,
                        firstPlayer: false,
                        color: null,
                        room: -1
                    })
                    setSecondPlayer(null)
                    setPlayers({
                        ...players,
                        username1: data.p1.username,
                        username2: null
                    })
                }
            }
            setBoardState(new GameData([
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W'],
                ['W','W','W','W','W','W','W']
            ]))
            if(!OKClickM&&data!==0&&!winningM) {
                let dataHistory
                if(quitUser===username) {
                    dataHistory = {
                        datetime: beginDatetime,
                        firstplayer: firstPlayerForThisGame,
                        opponent: opponent,
                        winner: opponent
                    }
                }
                else {
                    dataHistory = {
                        datetime: beginDatetime,
                        firstplayer: firstPlayerForThisGame,
                        opponent: opponent,
                        winner: "You"
                    }
                }
                saveGame(dataHistory)
            }
            else if(winningM) {
                let dataHistory
                dataHistory = {
                    datetime: beginDatetime,
                    firstplayer: firstPlayerForThisGame,
                    opponent: opponent,
                    winner: winner
                }
                saveGame(dataHistory)
            }
            setPlayerTurnM(null)
            setPlayerTurnUsernameM(null)
            setWinningM(null)
            setOKClickM(false)
            setTime({
                ...time,
                timeP1:60,
                timeP2:60
            })
            setPlayAgainText(null)
            setDroppingM(false)
            setNoPlayAgain(false)
            setOpponent(null)
            setMessages([])
            setHistoryClick(false)
            setHelpClick(false)
            setStatsClick(false)
            setChatClick(false)
            setQuitClick(false)
        })

        return () => {
            socket.off("updateJoin")
            socket.off("gameRoomFulled")
            socket.off("quitUpdate")
            socket.off("updateBoard")
            socket.off("updatePlaying")
            socket.off("timeState")
        }
    },[socket,p1,p2,username,playingM,setWinningM,time,setTime,setQuitInitally,setOKClickM,
    setSecondPlayer,setDroppingM,opponent,players,setPlayers,
    beginDatetime,winner,firstPlayerForThisGame,OKClickM,winningM,setOpponent,setMessages,
    setHelpClick,setHistoryClick,setStatsClick, setChatClick, setQuitClick, 
    playerTurnM,setQuitYes,setNewMessages,chatClick, setPlayerTurnUsernameM, 
    setPlayingM, setP1, setP2, setPlayerTurnM])

    return { 
        boardState, setBoardState, buttons, playAgainText, setPlayAgainText, noPlayAgain, 
        setNoPlayAgain, beginDatetime, setBeginDatetime, firstPlayerForThisGame, 
        setFirstPlayerForThisGame, winner, setWinner
    }
}