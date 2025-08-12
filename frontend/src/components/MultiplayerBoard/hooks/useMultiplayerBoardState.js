import { useEffect } from 'react'
import { GameData } from '../../../classes/GameData'
import { useInfo } from '../../../context/Info'
import axios from 'axios'
import { useSocketListeners } from './useSocketListeners'

//hook that checks/handles the state of the board in the multiplayer mode of the game
export const useMultiplayerBoardState = (socket) => {
    const { username, winningM, setWinningM, OKClickM, 
        setOKClickM, setSecondPlayer, time, setTime,
        players ,setPlayers, opponent, setOpponent, messages, setMessages, playClick, 
        setPlayClick, quitYes, setQuitYes, p1, setP1, p2, setP2,playerTurnM, setPlayerTurnM, 
        playerTurnUsernameM, setPlayerTurnUsernameM, playingM, setPlayingM } = useInfo()
    const { boardState, setBoardState, buttons, playAgainText, setPlayAgainText, noPlayAgain, 
        setNoPlayAgain, beginDatetime, setBeginDatetime, firstPlayerForThisGame, 
        setFirstPlayerForThisGame, winner, setWinner
    } = useSocketListeners(socket)
    
    //sets the state when it has changed
    useEffect(() => {

        if(playClick&&p1.username) {
            socket.on("updatePlayerTurn", (turn) => {
                setPlayerTurnM(turn)
            })
            const data = {
                gameArray: boardState.gameArray,
                winningM: winningM,
                playerTurn: playerTurnM,
                playerTurnUsername: playerTurnUsernameM,
                OKClickM: OKClickM,
                datetime: beginDatetime,
                firstPlayerForThisGame: firstPlayerForThisGame,
                winner: winner,
                opponent: opponent,
                playAgainText: playAgainText,
                noPlayAgain: noPlayAgain,
                time: time,
                chatMessages: messages,
                playing: playingM,
                p1: p1,
                p2: p2,
                playClick: playClick
            }
            axios.get("/multiplayer/set-board-state",{
                params:data,
                withCredentials:true
            }).then((res) => {
            }).catch(error => {
                console.log(error)
            })
            if(data.winningM) {
                axios.get("/multiplayer/set-board-state",{
                    params:data,
                    withCredentials:true
                }).then((res) => {
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    },[boardState.gameArray,OKClickM,beginDatetime,firstPlayerForThisGame,messages,noPlayAgain,
        playAgainText,opponent,p1,p2,playingM,playClick,playerTurnM,playerTurnUsernameM,time,time.timeP1,
        time.timeP2,winner,winningM,socket,quitYes, setPlayerTurnM])
    
    //gets the state not to be affected from refresh of the page
    useEffect(() => {

        socket.emit("updateSocket",username,playerTurnUsernameM)
        if(!playClick&&!quitYes) {
            axios.get("/multiplayer/get-board-state",{withCredentials:true}).then((res)=> {
                if(res.data.state) {
                    let board = [
                        ['W','W','W','W','W','W','W'],
                        ['W','W','W','W','W','W','W'],
                        ['W','W','W','W','W','W','W'],
                        ['W','W','W','W','W','W','W'],
                        ['W','W','W','W','W','W','W'],
                        ['W','W','W','W','W','W','W']
                    ]
                    if(res.data.state.gameArray) {
                        for(let i=0; i<GameData.ROWS; i++) {
                            for(let j=0; j<GameData.COLUMNS; j++) {
                                board[i][j]=res.data.state.gameArray[i][j].trim()
                            }
                        }
                        setBoardState(new GameData(board))
                    }
                    setPlayerTurnM(res.data.state.playerTurn)
                    setPlayerTurnUsernameM(res.data.state.playerTurnUsername)
                    setOKClickM(res.data.state.OKClickM)
                    setWinningM(res.data.state.winningM)
                    setWinner(res.data.state.winner)
                    setOpponent(res.data.state.opponent)
                    setBeginDatetime(res.data.state.datetime)
                    setFirstPlayerForThisGame(res.data.state.firstPlayerForThisGame)
                    setPlayAgainText(res.data.state.playAgainText)
                    setNoPlayAgain(res.data.state.noPlayAgain)
                    setTime({
                        ...time,
                        timeP1: Number(res.data.state.time.timeP1),
                        timeP2: Number(res.data.state.time.timeP2)
                    })
                    if(res.data.state.chatMessages) {
                        setMessages(res.data.state.chatMessages)
                    }
                    else {
                        setMessages([])
                    }
                    setPlayingM({...playingM,...res.data.state.playing})
                    setP1({...p1,...res.data.state.p1})
                    setP2({...p2,...res.data.state.p2})
                    setPlayClick(res.data.state.playClick)
                    setPlayers({
                        ...players,
                        username1: res.data.state.p1.username,
                        username2: res.data.state.p2.username
                    })
                    setSecondPlayer(res.data.state.p2.username)
                }
            }).catch(error => {
                console.log(error)
            })
        }

    },[playClick,boardState,setMessages,setOKClickM,setOpponent,setPlayClick,
        setTime,setWinningM,playingM,p1,p2,socket,username,players,setPlayers,
        setSecondPlayer,time,playerTurnUsernameM,quitYes,setQuitYes, setP1, setP2,
        setPlayerTurnM, setPlayerTurnUsernameM, setPlayingM, setBeginDatetime, setBoardState, 
        setFirstPlayerForThisGame, setNoPlayAgain, setPlayAgainText, setWinner])

    return {
        boardState, buttons, playAgainText, setPlayAgainText, noPlayAgain, 
        setNoPlayAgain, beginDatetime, firstPlayerForThisGame, winner
    }
}