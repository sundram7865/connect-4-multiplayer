import { User, AiGame, GameData } from '../models/ConnectModels.js'
import { Op } from 'sequelize'

//updates the stats of a player in ai mode
export async function updateTotalGames(data,aiGames) {

    const games = aiGames.getDataValue('aiGames')
    let gamesLevel
    let level
    if(data.level==="Trivial") {
        gamesLevel = games.trivial
        level = "trivial"
    } else if(data.level==="Medium") {
        gamesLevel = games.medium
        level = "medium"
    } else if(data.level==="Hard") {
        gamesLevel = games.hard
        level = "hard"
    }
    let total = gamesLevel.total
    if(data.winner==="You") {
        let win = gamesLevel.win
        await aiGames.update({aiGames: {
            ...games,
            [level]: { 
                ...gamesLevel,
                total: ++total,
                win: ++win
            }
        }})
    } else if(data.winner==="Ai") {
        let defeat = gamesLevel.defeat
        await aiGames.update({aiGames: {
            ...games,
            [level]: {
                ...gamesLevel,
                total: ++total,
                defeat: ++defeat
            }
        }})
    } else if(data.winner==="Draw") {
        let draw = gamesLevel.draw
        await aiGames.update({aiGames: {
            ...games,
            [level]: {
                ...gamesLevel,
                total: ++total,
                draw: ++draw
            }
        }})
    }
}

//adds a game with ai in history of a user
export async function addAiGame(data,username) {
    try {

        await AiGame.create({level: data.level, firstplayer: data.firstplayer, 
            winner: data.winner, datetime: data.datetime, UserUsername: username
        })
        const aiGames = await User.findOne({
            where: {
                username: username
            }
        })
        await updateTotalGames(data,aiGames)
    }catch(error) {
        console.log(error)
    }
}

//removes all games with ai with a specific username
export async function removeAiGames(username) {

    try {
        await AiGame.destroy({
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

//finds games with ai of a user
export async function findAiGames(username) {

    try {
        const userGames = await AiGame.findAll({
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

//finds the stats of a user for ai games
export async function findTotalAiGames(username) {

    try {

        const aiGames = await User.findOne({
            where: {
                username: username
            }
        })
        const games = aiGames.getDataValue('aiGames')
        return games
    }catch(error) {
        console.log(error)
    }
}

//gets the state of the game for ai
export async function getGameData(sid) {

    try {

        const state = await GameData.findOne({
            where: {
                [Op.and] : [{SessionSid: sid},{datetime:{ [Op.not]:null}},{firstPlayerForThisGame:{[Op.not]:null}}]
            },
            raw:true
        })
        return state
    }catch(error) {
        console.log(error)
    }
}

//sets the state of the game after refresh of the page for ai
export async function setGameData(data, sid) {

    try {
        const res = await GameData.findOne({
            where: {
                SessionSid: sid
            }
        })
        if(!res) {
            await GameData.create({gameArray: data.gameArray,
                firstPlayer: data.firstPlayer,
                winning: data.winning,
                playerTurn: data.playerTurn,
                level: data.level,
                OKClick: data.OKClick,
                datetime: data.datetime,
                firstPlayerForThisGame: data.firstPlayerForThisGame,
                SessionSid: sid
            })
        } 
        else {
            if(data.winning===undefined) {
                data.winning=null
            }
            await GameData.update({
                gameArray: data.gameArray,
                firstPlayer: data.firstPlayer,
                winning: data.winning,
                playerTurn: data.playerTurn,
                level: data.level,
                OKClick: data.OKClick,
                datetime: data.datetime,
                firstPlayerForThisGame: data.firstPlayerForThisGame
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

//deletes the state of the game when the user go back in gameEntrance path
export async function deleteGameData(sid) {

    try {

        const res = await GameData.count()
        if(res!==0) {
            await GameData.destroy({
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