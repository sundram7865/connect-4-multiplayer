import { User, MultiplayerGame, GameDataM } from '../models/ConnectModels.js'
import { Op } from 'sequelize'

//updates the stats of a player in multiplayer mode
async function updateTotalGamesM(winner,multiplayerGames) {

    const games = multiplayerGames.getDataValue('multiplayerGames')
    let total = games.total
    let win = games.win
    let defeat = games.defeat
    let draw = games.draw
    if(winner==="Draw") {
        await multiplayerGames.update({multiplayerGames: {
            ...games,
            total: ++total,
            draw: ++draw
        }})
    }
    else if(winner==="You") {
        await multiplayerGames.update({multiplayerGames: {
            ...games,
            total: ++total,
            win: ++win
        }})
    }
    else {
        await multiplayerGames.update({multiplayerGames: {
            ...games,
            total: ++total,
            defeat: ++defeat
        }})
    }
}

//adds a multiplayer game in a specific user's history
export async function addMultiplayerGame(data,username) {

    try {
        await MultiplayerGame.create({datetime: data.datetime, firstplayer: data.firstplayer,
            opponent: data.opponent, winner: data.winner, UserUsername: username
        })
        const multiplayerGames = await User.findOne({
            where: {
                username: username
            }
        })
        await updateTotalGamesM(data.winner,multiplayerGames)
    }catch(error) {
        console.log(error)
    }
}

//finds all multiplayer games of a user
export async function findMultiplayerGames(username) {

    try {
        const userGames = await MultiplayerGame.findAll({
            where: {
                UserUsername: username
            },
            order: [['datetime','DESC']],
            raw: true
        })
        return userGames
    }catch(error) {
        console.log(error)
    }
}

//removes all multiplayer games from a user
export async function removeMultiplayerGames(username) {

    try {
        await MultiplayerGame.destroy({
            where: {
                [Op.or]: [
                    { UserUsername: username },
                    { UserUsername: null }
                ]
            }
        })
    }catch(error) {
        console.log(error)
    }
}

//finds the stats in multiplayer mode of a player
export async function findTotalMultiplayerGames(username) {
    
    try {
        const multiplayerGames = await User.findOne({
            where: {
                username: username
            }
        })
        const games = multiplayerGames.getDataValue('multiplayerGames')
        return games
    }catch(error) {
        console.log(error)
    }
}

//sets the state of the game after refresh of the page for multiplayer
export async function setGameDataM(data, sid) {

    try {
        const res = await GameDataM.findOne({
            where: {
                SessionSid: sid
            }
        })
        if(!res) {
            await GameDataM.create({gameArray: data.gameArray,
                winningM: data.winningM,
                playerTurn: data.playerTurn,
                playerTurnUsername: data.playerTurnUsername,
                OKClickM: data.OKClickM,
                datetime: data.beginDatetime,
                firstPlayerForThisGame: data.firstPlayerForThisGame,
                winner: data.winner,
                opponent: data.opponent,
                playAgainText: data.playAgainText,
                noPlayAgain: data.noPlayAgain,
                time: data.time,
                chatMessages: data.messages,
                playing: data.playing,
                p1: data.p1,
                p2: data.p2,
                playClick: data.playClick,
                SessionSid: sid
            })
        } 
        else {
            if(data.winningM===undefined) {
                data.winningM=null
            }
            if(data.playAgainText===undefined) {
                data.playAgainText=null
            }
            if(data.playerTurn===undefined) {
                data.playerTurn=null
            }
            if(data.playerTurnUsername===undefined) {
                data.playerTurnUsername=null
            }
            if(data.datetime===undefined) {
                data.datetime=null
            }
            if(data.firstPlayerForThisGame===undefined) {
                data.firstPlayerForThisGame=null
            }
            if(data.winner===undefined) {
                data.winner=null
            }
            await GameDataM.update({
                gameArray: data.gameArray,
                winningM: data.winningM,
                playerTurn: data.playerTurn,
                playerTurnUsername: data.playerTurnUsername,
                OKClickM: data.OKClickM,
                datetime: data.datetime,
                firstPlayerForThisGame: data.firstPlayerForThisGame,
                winner: data.winner,
                opponent: data.opponent,
                playAgainText: data.playAgainText,
                noPlayAgain: data.noPlayAgain,
                time: data.time,
                chatMessages: data.chatMessages,
                playing: data.playing,
                p1: data.p1,
                p2: data.p2,
                playClick: data.playClick
            },{
                omitNull: false,
                where: {
                    SessionSid: sid
                }
            })
        }
    }catch(error) {
        console.log(error)
    }
}

//gets the state of the game for multiplayer
export async function getGameDataM(sid) {

    try {

        const state = await GameDataM.findOne({
            where: {
                SessionSid: sid
            },
            raw:true
        })
        return state
    }catch(error) {
        console.log(error)
    }
}

//deletes the state of the game when the user go back in gameEntrance path
export async function deleteGameDataM(sid) {

    try {

        const res = await GameDataM.count()
        if(res!==0) {
            await GameDataM.destroy({
                where: {
                    [Op.or]: [
                        { SessionSid: sid },
                        { SessionSid: null }
                    ]
                }
            })
        }
    } catch(error) {
        console.log(error)
    }
}