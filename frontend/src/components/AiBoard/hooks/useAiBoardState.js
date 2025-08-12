import { useEffect, useRef, useState } from "react"
import axios from 'axios'
import { animateDrop, dropCheckerAudio } from "../../../utils/gameFunctions"
import { useInfo } from '../../../context/Info'
import { GameData } from '../../../classes/GameData'
import { AiModule } from '../../../classes/AiModule'

//hook that checks the state of the board in the ai mode of the game
export const useAiBoardState = () => {
    const initialBoard = [
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W'],
        ['W','W','W','W','W','W','W']
    ]
    const buttons = useRef(null)
    const { 
        level, dropping, winning, OKClick, setDropping, firstPlayer, checkLevel, 
        setCheckLevel, setOKClick, setWinning, setFirstPlayer, setLevel
    } = useInfo()
    const [boardState,setBoardState] = useState(new GameData(initialBoard))
    const [playerState, setPlayerState] = useState(new AiModule(null,null))
    const [playerTurn, setPlayerTurn] = useState(firstPlayer)
    const [firstPlayerForThisGame, setFirstPlayerForThisGame] = useState(null)
    const [beginDatetime, setBeginDatetime] = useState(null)
    
    //handles the initialization of the game and makes the first move if ai is playing first
    useEffect(() => {
        if(buttons !== null) {
            let newPlayerState

            async function playFirstAi() {

                setDropping(true)
                await animateDrop(5,3,'goldenrod',0,buttons)
                await dropCheckerAudio.play()
                
                const newBoard = new GameData([
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W']
                ])
                newBoard.addInGameArray("AI", 3)
                setBoardState(newBoard)
                setDropping(false)
                
                setPlayerTurn("You")
                setPlayerState((prevPlayerState) => {
                    prevPlayerState.playerTurn="User"
                    return prevPlayerState
                })
            }

            if(checkLevel===1) {
                setBoardState(new GameData([
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W'],
                    ['W','W','W','W','W','W','W']
                ]))
                if(level==="Trivial") {
                    if(firstPlayer==="You") {
                        newPlayerState = new AiModule(1,"User")
                        setPlayerState(newPlayerState)
                    } else if(firstPlayer==="Ai") {
                        newPlayerState = new AiModule(1,"AI")
                        setPlayerState(newPlayerState)
                    }
                } else if(level==="Medium") {
                    if(firstPlayer==="You") {
                        newPlayerState = new AiModule(3,"User")
                        setPlayerState(newPlayerState)
                    } else if(firstPlayer==="Ai") {
                        newPlayerState = new AiModule(3,"AI")
                        setPlayerState(newPlayerState)
                    }
                } else if(level==="Hard") {
                    if(firstPlayer==="You") {
                        newPlayerState = new AiModule(5,"User")
                        setPlayerState(newPlayerState)
                    } else if(firstPlayer==="Ai") {
                        newPlayerState = new AiModule(5,"AI")
                        setPlayerState(newPlayerState)
                    }
                }
                setPlayerTurn(firstPlayer)
                setCheckLevel(0)
                setOKClick(false)
                setFirstPlayerForThisGame(firstPlayer)
                const now = new Date()

                const year = now.getFullYear()
                const month = String(now.getMonth() + 1).padStart(2, '0')
                const day = String(now.getDate()).padStart(2, '0')
                const hours = String(now.getHours()).padStart(2, '0')
                const minutes = String(now.getMinutes()).padStart(2, '0')
                const seconds = String(now.getSeconds()).padStart(2, '0')

                const formattedDate = `${year}.${month}.${day} - ${hours}:${minutes}:${seconds}`

                setBeginDatetime(formattedDate)
                if(firstPlayer==="Ai") {
                    playFirstAi()
                }
            }
        }
    },[checkLevel,level,setCheckLevel,firstPlayer,setDropping,boardState,setOKClick,buttons])

    //sets the state when it has changed
    useEffect(() => {

        if(level&&!dropping) {
            const data = {
                gameArray: boardState.gameArray,
                firstPlayer: firstPlayer,
                winning: winning,
                playerTurn: playerTurn,
                level: level,
                OKClick: OKClick,
                datetime: beginDatetime,
                firstPlayerForThisGame: firstPlayerForThisGame
            }
            axios.get("/ai/set-board-state",{
                params:data,
                withCredentials:true
            }).then((res) => {
            }).catch(error => {
                console.log(error)
            })
        }
    },[boardState.gameArray,level,winning,OKClick,playerTurn,firstPlayer,beginDatetime,firstPlayerForThisGame,dropping])

    //gets the state not to be affected from refresh of the page
    useEffect(() => {

        if(level===null) {
            axios.get("/ai/get-board-state",{withCredentials:true}).then((res)=> {
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
                    setPlayerTurn(res.data.state.playerTurn)
                    setOKClick(res.data.state.OKClick)
                    setWinning(res.data.state.winning)
                    setFirstPlayer(res.data.state.firstPlayer)
                    setLevel(res.data.state.level)
                    setBeginDatetime(res.data.state.datetime)
                    setFirstPlayerForThisGame(res.data.state.firstPlayerForThisGame)
                    let player
                    if(playerTurn==="You") {
                        player="User"
                    } else if(playerTurn==="Ai") {
                        player="AI"
                    }
                    if(res.data.state.level==="Trivial") {
                        setPlayerState(new AiModule(1,player))
                    } else if(res.data.state.level==="Medium") {
                        setPlayerState(new AiModule(3,player))
                    } else if(res.data.state.level==="Hard") {
                        setPlayerState(new AiModule(5,player))
                    }
                }
            }).catch(error => {
                console.log(error)
            })
        }
    },[OKClick, boardState, firstPlayer, level, playerState, 
        playerTurn, setFirstPlayer, setLevel, setWinning, winning, setOKClick])

    return {
        buttons, boardState, setBoardState, playerState , setPlayerState,
        playerTurn, setPlayerTurn, firstPlayerForThisGame, setFirstPlayerForThisGame,
        beginDatetime, setBeginDatetime
    }
}