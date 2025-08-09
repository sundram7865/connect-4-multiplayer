import { 
    addMultiplayerGame, 
    findMultiplayerGames, 
    removeMultiplayerGames, 
    findTotalMultiplayerGames, 
    getGameDataM, 
    setGameDataM, 
    deleteGameDataM 
} from '../services/MultiplayerGameService.js'

// Add a multiplayer game
export const addMultiGame = async (req, res) => {
    try {
        const { datetime, firstPlayer, opponent, winner } = req.query
        await addMultiplayerGame({ datetime, firstPlayer, opponent, winner }, req.session.username)
        return res.status(201).json({ success: true, message: 'Multiplayer game added successfully.' })
    } catch (error) {
        console.error('Error adding multiplayer game:', error)
        return res.status(500).json({ success: false, message: 'Failed to add multiplayer game.' })
    }
}

// Get all multiplayer games for the logged-in user
export const findAllMultiGames = async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' })
        }
        const games = await findMultiplayerGames(req.session.username)
        return res.json({ success: true, games })
    } catch (error) {
        console.error('Error fetching multiplayer games:', error)
        return res.status(500).json({ success: false, message: 'Failed to fetch multiplayer games.' })
    }
}

// Delete all multiplayer games for the logged-in user
export const deleteMultiGames = async (req, res) => {
    try {
        await removeMultiplayerGames(req.session.username)
        return res.json({ success: true, message: 'All multiplayer games deleted successfully.' })
    } catch (error) {
        console.error('Error deleting multiplayer games:', error)
        return res.status(500).json({ success: false, message: 'Failed to delete multiplayer games.' })
    }
}

// Get multiplayer game stats for a player and optionally an opponent
export const findTotalMultiGames = async (req, res) => {
    try {
        const { opponent } = req.query
        const games = await findTotalMultiplayerGames(req.session.username)

        let opponentGames = null
        if (opponent) {
            opponentGames = await findTotalMultiplayerGames(opponent)
        }

        return res.json({ success: true, games, opponentGames })
    } catch (error) {
        console.error('Error fetching multiplayer stats:', error)
        return res.status(500).json({ success: false, message: 'Failed to fetch multiplayer stats.' })
    }
}

// Save current multiplayer game state
export const setMultiBoardState = async (req, res) => {
    try {
        const {
            gameArray, winningM, playerTurn, playerTurnUsername, OKClickM, datetime, 
            firstPlayerForThisGame, winner, opponent, playAgainText, noPlayAgain, 
            time, chatMessages, playing, p1, p2, playClick
        } = req.query

        await setGameDataM({
            gameArray, winningM, playerTurn, playerTurnUsername, OKClickM, datetime, 
            firstPlayerForThisGame, winner, opponent, playAgainText, noPlayAgain, 
            time, chatMessages, playing, p1, p2, playClick
        }, req.sessionID)

        return res.json({ success: true, message: 'Multiplayer game state saved.' })
    } catch (error) {
        console.error('Error saving multiplayer game state:', error)
        return res.status(500).json({ success: false, message: 'Failed to save multiplayer game state.' })
    }
}

// Retrieve saved multiplayer game state
export const getMultiBoardState = async (req, res) => {
    try {
        const state = await getGameDataM(req.sessionID)
        return res.json({ success: true, state })
    } catch (error) {
        console.error('Error fetching multiplayer game state:', error)
        return res.status(500).json({ success: false, message: 'Failed to fetch multiplayer game state.' })
    }
}

// Clear multiplayer game state
export const clearMultiData = async (req, res) => {
    try {
        await deleteGameDataM(req.sessionID)
        return res.json({ success: true, message: 'Multiplayer game state cleared.' })
    } catch (error) {
        console.error('Error clearing multiplayer game state:', error)
        return res.status(500).json({ success: false, message: 'Failed to clear multiplayer game state.' })
    }
}
