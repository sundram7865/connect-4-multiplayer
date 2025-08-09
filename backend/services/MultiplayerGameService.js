import { User, MultiplayerGame, GameDataM } from '../models/ConnectModels.js';
import { Op } from 'sequelize';

/**
 * Updates multiplayer statistics for a player.
 * @param {string} winner - The result of the game ("You", "Draw", or opponent's name).
 * @param {Object} multiplayerGames - The Sequelize instance of the player's stats.
 */
async function updateTotalGamesM(winner, multiplayerGames) {
    const games = multiplayerGames.getDataValue('multiplayerGames');
    let { total, win, defeat, draw } = games;

    if (winner === "Draw") {
        await multiplayerGames.update({
            multiplayerGames: {
                ...games,
                total: ++total,
                draw: ++draw
            }
        });
    } else if (winner === "You") {
        await multiplayerGames.update({
            multiplayerGames: {
                ...games,
                total: ++total,
                win: ++win
            }
        });
    } else {
        await multiplayerGames.update({
            multiplayerGames: {
                ...games,
                total: ++total,
                defeat: ++defeat
            }
        });
    }
}

/**
 * Adds a multiplayer game to the user's history and updates stats.
 */
export async function addMultiplayerGame(data, username) {
    try {
        await MultiplayerGame.create({
            datetime: data.datetime,
            firstplayer: data.firstplayer,
            opponent: data.opponent,
            winner: data.winner,
            UserUsername: username
        });

        const multiplayerGames = await User.findOne({
            where: { username }
        });

        if (multiplayerGames) {
            await updateTotalGamesM(data.winner, multiplayerGames);
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Fetches all multiplayer games of a user in descending order of datetime.
 */
export async function findMultiplayerGames(username) {
    try {
        return await MultiplayerGame.findAll({
            where: { UserUsername: username },
            order: [['datetime', 'DESC']],
            raw: true
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Deletes all multiplayer games of a specific user.
 */
export async function removeMultiplayerGames(username) {
    try {
        await MultiplayerGame.destroy({
            where: {
                [Op.or]: [
                    { UserUsername: username },
                    { UserUsername: null }
                ]
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Gets multiplayer stats of a player.
 */
export async function findTotalMultiplayerGames(username) {
    try {
        const multiplayerGames = await User.findOne({
            where: { username }
        });
        return multiplayerGames?.getDataValue('multiplayerGames') || null;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Saves multiplayer game state after page refresh.
 */
export async function setGameDataM(data, sid) {
    try {
        const existingGame = await GameDataM.findOne({ where: { SessionSid: sid } });

        const gameData = {
            gameArray: data.gameArray,
            winningM: data.winningM ?? null,
            playerTurn: data.playerTurn ?? null,
            playerTurnUsername: data.playerTurnUsername ?? null,
            OKClickM: data.OKClickM,
            datetime: data.datetime ?? data.beginDatetime ?? null,
            firstPlayerForThisGame: data.firstPlayerForThisGame ?? null,
            winner: data.winner ?? null,
            opponent: data.opponent,
            playAgainText: data.playAgainText ?? null,
            noPlayAgain: data.noPlayAgain,
            time: data.time,
            chatMessages: data.chatMessages ?? data.messages,
            playing: data.playing,
            p1: data.p1,
            p2: data.p2,
            playClick: data.playClick
        };

        if (!existingGame) {
            await GameDataM.create({ ...gameData, SessionSid: sid });
        } else {
            await GameDataM.update(gameData, {
                omitNull: false,
                where: { SessionSid: sid }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Retrieves multiplayer game state for a session.
 */
export async function getGameDataM(sid) {
    try {
        return await GameDataM.findOne({
            where: { SessionSid: sid },
            raw: true
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Deletes multiplayer game state when the user leaves the game.
 */
export async function deleteGameDataM(sid) {
    try {
        const count = await GameDataM.count();
        if (count > 0) {
            await GameDataM.destroy({
                where: {
                    [Op.or]: [
                        { SessionSid: sid },
                        { SessionSid: null }
                    ]
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}
