import express from 'express'
import { addGame, deleteGames, findAllGames, findTotalGames, 
    setBoardState, getBoardState, clearData } from '../controllers/AiGameController.js'

const router = express.Router()

//route for adding an ai game
router.get("/add-game", addGame)

//route for deletion of ai games
router.get("/delete-games", deleteGames)

//route for finding all ai games for history
router.get("/find-all-games", findAllGames)

//route for finding total ai games for stats
router.get("/find-total-games", findTotalGames)

//route for setting the ai board state before refresh
router.get("/set-board-state", setBoardState)

//route for getting the ai board state after refresh
router.get("/get-board-state", getBoardState)

//route for clearing the ai state
router.get("/clear-data", clearData)

export { router as AiGameRouter }