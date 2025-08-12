import React, { createContext, useState, useContext } from 'react'

const InfoContext = createContext()

//in these variables have access all the components
//variables that are useful in the most components
function InfoProvider({ children }) {
    const [buttonClicked, setButtonClicked] = useState(false)
    const [firstPlayerClick, setFirstPlayerClick] = useState(false)
    const [firstPlayer, setFirstPlayer] = useState("You")
    const [level, setLevel] = useState(null)
    const [checkLevel, setCheckLevel] = useState(0)
    const [helpClick, setHelpClick] = useState(false)
    const [helpHover, setHelpHover] = useState(false)
    const [historyClick, setHistoryClick] = useState(false)
    const [historyHover, setHistoryHover] = useState(false)
    const [winning , setWinning] = useState(null)
    const [dropping,setDropping] = useState(false)
    const [listItems, setListItems] = useState([])
    const [statsClick, setStatsClick] = useState(false)
    const [statsHover, setStatsHover] = useState(false)
    const [newGameClick, setNewGameClick] = useState(false)
    const [username,setUsername] = useState("")
    const [avatar,setAvatar] = useState("")
    const [winningM, setWinningM] = useState(null)
    const [OKClickM, setOKClickM] = useState(false)
    const [secondPlayer, setSecondPlayer] = useState(null)
    const [quitClick, setQuitClick] = useState(false)
    const [quitHover, setQuitHover] = useState(false)
    const [droppingM, setDroppingM] = useState(false)
    const [listItemsM, setListItemsM] = useState([])
    const [players, setPlayers] = useState({username1:null,username2:null})
    const [opponent, setOpponent] = useState(null)
    const [messages, setMessages] = useState([])
    const [chatClick, setChatClick] = useState(false)
    const [chatHover, setChatHover] = useState(false)
    const [playClick, setPlayClick] = useState(false)
    const [newMessages,setNewMessages] = useState(false)
    const [time, setTime] = useState({
        timeP1: 60,
        timeP2: 60
    })
    const [quitYes, setQuitYes] = useState(false)
    const [OKClick, setOKClick] = useState(false)
    const [p1, setP1] = useState({
        username: null,
        firstPlayer: false,
        color: null,
        room: -1
    })
    const [p2, setP2] = useState({
        username: null,
        firstPlayer: false,
        color: null,
        room: -1
    })
    const [playerTurnM, setPlayerTurnM] = useState(null)
    const [playerTurnUsernameM , setPlayerTurnUsernameM] = useState(null)
    const [playingM , setPlayingM] = useState({
        playingP1: false,
        playingP2: false
    })

    return (
        <InfoContext.Provider value={{ buttonClicked, setButtonClicked, firstPlayer, 
            setFirstPlayer, firstPlayerClick, setFirstPlayerClick, level, setLevel, 
            checkLevel, setCheckLevel, helpClick, setHelpClick, winning, setWinning, 
            dropping, setDropping, historyClick, setHistoryClick, historyHover, setHistoryHover, 
            listItems, setListItems, statsClick, setStatsClick, newGameClick, setNewGameClick, 
            username, setUsername, avatar, setAvatar, winningM, setWinningM, OKClickM, setOKClickM, 
            secondPlayer, setSecondPlayer, quitClick, setQuitClick, droppingM, setDroppingM, 
            listItemsM, setListItemsM, players, setPlayers, opponent, setOpponent, messages, 
            setMessages, chatClick, setChatClick, playClick, setPlayClick, time, setTime, 
            quitYes, setQuitYes, OKClick, setOKClick, newMessages, setNewMessages,
            statsHover, setStatsHover, helpHover, setHelpHover, quitHover, setQuitHover,
            chatHover, setChatHover, p1, setP1, p2, setP2, playerTurnM, setPlayerTurnM,
            playerTurnUsernameM, setPlayerTurnUsernameM, playingM, setPlayingM }}>
        {children}
        </InfoContext.Provider>
    )
}

export { InfoProvider }

export const useInfo = () => {
    return useContext(InfoContext)
}