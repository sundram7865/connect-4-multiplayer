import { addMultiplayerGame, findMultiplayerGames, removeMultiplayerGames, 
    findTotalMultiplayerGames, getGameDataM, setGameDataM, deleteGameDataM } from '../services/MultiplayerGameService.js'

//handles the addition of a multiplayer game
export const addMultiGame = async (req,res) => {
    const { datetime, firstplayer, opponent, winner} = req.query

    await addMultiplayerGame({ datetime, firstplayer, opponent, winner},req.session.username)
    return res.json({success: true})
}

//finds all multiplayer games for a user
export const findAllMultiGames = async (req,res) => {

    if(req.session.username) {
        const games = await findMultiplayerGames(req.session.username)
        return res.json(games)
    }
}

//handles the deletion of multiplayer games about a user
export const deleteMultiGames = async (req,res) => {

    await removeMultiplayerGames(req.session.username)
    return res.json({success:true})
}

//finds the stats about a player in multiplayer mode
export const findTotalMultiGames = async (req,res) => {
    const { opponent } = req.query

    const games = await findTotalMultiplayerGames(req.session.username)
    let opponentGames = null
    if(opponent!==undefined) {
        opponentGames = await findTotalMultiplayerGames(opponent)
    }
    return res.json({games:games, opponentGames: opponentGames})
}

//handles/sets the state to be preserved after a refresh of the web page for multiplayer mode
export const setMultiBoardState = async (req,res) => {
    const {gameArray,winningM,playerTurn,playerTurnUsername,OKClickM,datetime,firstPlayerForThisGame,
        winner,opponent,playAgainText,noPlayAgain,time,chatMessages,playing,p1,p2,playClick} = req.query
    
    await setGameDataM({gameArray,winningM,playerTurn,playerTurnUsername,OKClickM,datetime,firstPlayerForThisGame,
        winner,opponent,playAgainText,noPlayAgain,time,chatMessages,playing,p1,p2,playClick},req.sessionID)
    return res.json({success:true})
}

//handles/gets the state to be preserved after a refresh of the web page for multiplayer mode
export const getMultiBoardState = async (req,res) => {

    const state = await getGameDataM(req.sessionID)
    return res.json({state: state})
}

//clear the state when the player exits from multiplayer mode
export const clearMultiData = async (req,res) => {

    await deleteGameDataM(req.sessionID)
    
    return res.json({success: true})
}