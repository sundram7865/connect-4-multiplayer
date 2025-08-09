import { User, BotGame, GameData } from '../models/ConnectModels.js'
import { Op } from 'sequelize'

// updates the stats of a player in bot mode
export async function updateTotalGames(data, botGames) {

    const games = botGames.getDataValue('botGames')
    let gamesLevel
    let level
    if (data.level === "Trivial") {
        gamesLevel = games.trivial
        level = "trivial"
    } else if (data.level === "Medium") {
        gamesLevel = games.medium
        level = "medium"
    } else if (data.level === "Hard") {
        gamesLevel = games.hard
        level = "hard"
    }
    let total = gamesLevel.total
    if (data.winner === "You") {
        let win = gamesLevel.win
        await botGames.update({
            botGames: {
                ...games,
                [level]: {
                    ...gamesLevel,
                    total: ++total,
                    win: ++win
                }
            }
        })
    } else if (data.winner === "Bot") {
        let defeat = gamesLevel.defeat
        await botGames.update({
            botGames: {
                ...games,
                [level]: {
                    ...gamesLevel,
                    total: ++total,
                    defeat: ++defeat
                }
            }
        })
    } else if (data.winner === "Draw") {
        let draw = gamesLevel.draw
        await botGames.update({
            botGames: {
                ...games,
                [level]: {
                    ...gamesLevel,
                    total: ++total,
                    draw: ++draw
                }
            }
        })
    }
}

// adds a game with bot in history of a user
export async function addBotGame(data, username) {
    try {
        await BotGame.create({
            level: data.level,
            firstplayer: data.firstplayer,
            winner: data.winner,
            datetime: data.datetime,
            UserUsername: username
        })
        const botGames = await User.findOne({
            where: { username: username }
        })
        await updateTotalGames(data, botGames)
    } catch (error) {
        console.log(error)
    }
}

// removes all games with bot for a specific username
export async function removeBotGames(username) {
    try {
        await BotGame.destroy({
            where: {
                [Op.or]: [
                    { UserUsername: username },
                    { UserUsername: null }
                ]
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// finds bot games of a user
export async function findBotGames(username) {
    try {
        const userGames = await BotGame.findAll({
            where: { UserUsername: username },
            order: [['datetime', 'DESC']],
            raw: true
        })
        return userGames
    } catch (error) {
        console.log(error)
    }
}

// finds the stats of a user for bot games
export async function findTotalBotGames(username) {
    try {
        const botGames = await User.findOne({
            where: { username: username }
        })
        const games = botGames.getDataValue('botGames')
        return games
    } catch (error) {
        console.log(error)
    }
}

// gets the state of the game for bot
export async function getGameData(sid) {
    try {
        const state = await GameData.findOne({
            where: {
                [Op.and]: [
                    { SessionSid: sid },
                    { datetime: { [Op.not]: null } },
                    { firstPlayerForThisGame: { [Op.not]: null } }
                ]
            },
            raw: true
        })
        return state
    } catch (error) {
        console.log(error)
    }
}

// sets the state of the game after page refresh for bot
export async function setGameData(data, sid) {
    try {
        const res = await GameData.findOne({
            where: { SessionSid: sid }
        })
        if (!res) {
            await GameData.create({
                gameArray: data.gameArray,
                firstPlayer: data.firstPlayer,
                winning: data.winning,
                playerTurn: data.playerTurn,
                level: data.level,
                OKClick: data.OKClick,
                datetime: data.datetime,
                firstPlayerForThisGame: data.firstPlayerForThisGame,
                SessionSid: sid
            })
        } else {
            if (data.winning === undefined) {
                data.winning = null
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
            }, {
                omitNull: false,
                where: { SessionSid: sid }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

// deletes the state of the game when user leaves game entrance
export async function deleteGameData(sid) {
    try {
        const res = await GameData.count()
        if (res !== 0) {
            await GameData.destroy({
                where: {
                    [Op.or]: [
                        { SessionSid: sid },
                        { SessionSid: null }
                    ]
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}
