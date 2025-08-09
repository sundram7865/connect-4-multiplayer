import { 
    addBotGame, 
    removeBotGames, 
    findBotGames, 
    findTotalBotGames, 
    getGameData, 
    setGameData, 
    deleteGameData 
} from '../services/BotGameService.js'

// Add a bot game for the logged-in user
export const addGame = async (req, res) => {
    try {
        const { level, datetime, winner, firstPlayer } = req.query
        await addBotGame({ level, datetime, winner, firstPlayer }, req.session.username)
        return res.status(201).json({ success: true, message: 'Bot game added successfully.' })
    } catch (error) {
        console.error('Error adding bot game:', error)
        return res.status(500).json({ success: false, message: 'Failed to add bot game.' })
    }
}

// Delete all bot games for the logged-in user
export const deleteGames = async (req, res) => {
    try {
        await removeBotGames(req.session.username)
        return res.json({ success: true, message: 'All bot games deleted successfully.' })
    } catch (error) {
        console.error('Error deleting bot games:', error)
        return res.status(500).json({ success: false, message: 'Failed to delete bot games.' })
    }
}

// Get all bot games for the logged-in user
export const findAllGames = async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' })
        }
        const games = await findBotGames(req.session.username)
        return res.json({ success: true, games })
    } catch (error) {
        console.error('Error fetching bot games:', error)
        return res.status(500).json({ success: false, message: 'Failed to fetch bot games.' })
    }
}

// Get total bot game stats for the logged-in user
export const findTotalGames = async (req, res) => {
    try {
        const games = await findTotalBotGames(req.session.username)
        return res.json({ success: true, games })
    } catch (error) {
        console.error('Error fetching bot game stats:', error)
        return res.status(500).json({ success: false, message: 'Failed to fetch bot game stats.' })
    }
}

// Save current bot game state (for refresh persistence)
export const setBoardState = async (req, res) => {
    try {
        const { gameArray, firstPlayer, winning, playerTurn, level, OKClick, datetime, firstPlayerForThisGame } = req.query
        await setGameData(
            { gameArray, firstPlayer, winning, playerTurn, level, OKClick, datetime, firstPlayerForThisGame },
            req.sessionID
        )
        return res.json({ success: true, message: 'Bot game state saved.' })
    } catch (error) {
        console.error('Error saving bot game state:', error)
        return res.status(500).json({ success: false, message: 'Failed to save bot game state.' })
    }
}

// Retrieve saved bot game state
export const getBoardState = async (req, res) => {
    try {
        const state = await getGameData(req.sessionID)
        return res.json({ success: true, state })
    } catch (error) {
        console.error('Error fetching bot game state:', error)
        return res.status(500).json({ success: false, message: 'Failed to fetch bot game state.' })
    }
}

// Clear bot game state when exiting bot mode
export const clearData = async (req, res) => {
    try {
        await deleteGameData(req.sessionID)
        return res.json({ success: true, message: 'Bot game state cleared.' })
    } catch (error) {
        console.error('Error clearing bot game state:', error)
        return res.status(500).json({ success: false, message: 'Failed to clear bot game state.' })
    }
}
