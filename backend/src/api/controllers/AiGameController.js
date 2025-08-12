import { addAiGame, removeAiGames, findAiGames, findTotalAiGames, getGameData, 
    setGameData, deleteGameData } from '../services/AiGameService.js'

//handles the addition of an ai game
export const addGame = async (req,res) => {
    const {level,datetime,winner,firstplayer} = req.query

    await addAiGame({level,datetime,winner,firstplayer},req.session.username)
    return res.json({success: true})

}

//handles the deletion of ai games for a user 
export const deleteGames = async (req,res) => {

    await removeAiGames(req.session.username)
    return res.json({success:true})
}

//finds all ai games for a user
export const findAllGames = async (req,res) => {

    if(req.session.username) {
        const games = await findAiGames(req.session.username)
        return res.json(games)
    }
}

//finds the stats about a player in ai mode
export const findTotalGames = async (req,res) => {

    const games = await findTotalAiGames(req.session.username)
    return res.json({games:games})
}

//handles/sets the state to be preserved after a refresh of the web page for ai mode
export const setBoardState = async (req,res) => {
    const {gameArray,firstPlayer, winning, playerTurn, level, OKClick, datetime, firstPlayerForThisGame} = req.query
    
    await setGameData({gameArray,firstPlayer, winning, playerTurn, level, OKClick, datetime, firstPlayerForThisGame},req.sessionID)
    return res.json({success:true})
}

//handles/gets the state to be preserved after a refresh of the web page for ai mode
export const getBoardState = async (req,res) => {

    const state = await getGameData(req.sessionID)
    return res.json({state: state})
}

//clear the state when the player exits from ai mode
export const clearData = async (req,res) => {

    await deleteGameData(req.sessionID)
    
    return res.json({success: true})
}