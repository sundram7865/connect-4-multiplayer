import { User, AiGame, GameData } from '../models/ConnectModels.js';
import { Op } from 'sequelize';

/**
 * Update a user's total AI games stats based on game result.
 */
export async function updateTotalGames(data, aiGames) {
    try {
        const games = aiGames.getDataValue('aiGames');
        const levelKey = data.level.toLowerCase(); // trivial, medium, hard

        if (!games[levelKey]) {
            console.error(`Invalid game level: ${data.level}`);
            return;
        }

        let gamesLevel = games[levelKey];
        let total = gamesLevel.total;

        const updates = { total: ++total };

        if (data.winner === 'You') {
            updates.win = ++gamesLevel.win;
        } else if (data.winner === 'Ai') {
            updates.defeat = ++gamesLevel.defeat;
        } else if (data.winner === 'Draw') {
            updates.draw = ++gamesLevel.draw;
        }

        await aiGames.update({
            aiGames: {
                ...games,
                [levelKey]: { ...gamesLevel, ...updates }
            }
        });
    } catch (error) {
        console.error('Error updating total AI games:', error);
    }
}

/**
 * Add a new AI game to history and update player stats.
 */
export async function addAiGame(data, username) {
    try {
        await AiGame.create({
            level: data.level,
            firstplayer: data.firstplayer,
            winner: data.winner,
            datetime: data.datetime,
            UserUsername: username
        });

        const aiGames = await User.findOne({ where: { username } });
        if (aiGames) {
            await updateTotalGames(data, aiGames);
        }
    } catch (error) {
        console.error('Error adding AI game:', error);
    }
}

/**
 * Remove all AI games for a user (or orphaned games).
 */
export async function removeAiGames(username) {
    try {
        await AiGame.destroy({
            where: {
                [Op.or]: [
                    { UserUsername: username },
                    { UserUsername: null }
                ]
            }
        });
    } catch (error) {
        console.error('Error removing AI games:', error);
    }
}

/**
 * Get all AI games for a user.
 */
export async function findAiGames(username) {
    try {
        return await AiGame.findAll({
            where: { UserUsername: username },
            order: [['datetime', 'DESC']],
            raw: true
        });
    } catch (error) {
        console.error('Error finding AI games:', error);
    }
}

/**
 * Get total AI game stats for a user.
 */
export async function findTotalAiGames(username) {
    try {
        const aiGames = await User.findOne({ where: { username } });
        return aiGames?.getDataValue('aiGames') || null;
    } catch (error) {
        console.error('Error finding total AI games:', error);
    }
}

/**
 * Get saved AI game state for a session.
 */
export async function getGameData(sid) {
    try {
        return await GameData.findOne({
            where: {
                [Op.and]: [
                    { SessionSid: sid },
                    { datetime: { [Op.not]: null } },
                    { firstPlayerForThisGame: { [Op.not]: null } }
                ]
            },
            raw: true
        });
    } catch (error) {
        console.error('Error getting AI game data:', error);
    }
}

/**
 * Save or update AI game state for a session.
 */
export async function setGameData(data, sid) {
    try {
        const existing = await GameData.findOne({ where: { SessionSid: sid } });

        const gameData = {
            gameArray: data.gameArray,
            firstPlayer: data.firstPlayer,
            winning: data.winning ?? null,
            playerTurn: data.playerTurn,
            level: data.level,
            OKClick: data.OKClick,
            datetime: data.datetime,
            firstPlayerForThisGame: data.firstPlayerForThisGame
        };

        if (!existing) {
            await GameData.create({ ...gameData, SessionSid: sid });
        } else {
            await GameData.update(gameData, {
                omitNull: false,
                where: { SessionSid: sid }
            });
        }
    } catch (error) {
        console.error('Error setting AI game data:', error);
    }
}

/**
 * Delete AI game state for a session.
 */
export async function deleteGameData(sid) {
    try {
        const count = await GameData.count();
        if (count > 0) {
            await GameData.destroy({
                where: {
                    [Op.or]: [
                        { SessionSid: sid },
                        { SessionSid: null }
                    ]
                }
            });
        }
    } catch (error) {
        console.error('Error deleting AI game data:', error);
    }
}
