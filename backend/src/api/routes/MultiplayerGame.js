import express from 'express'
import { addMultiGame, clearMultiData, deleteMultiGames, findAllMultiGames, 
    findTotalMultiGames, getMultiBoardState, setMultiBoardState } from '../controllers/MultiplayerGameController.js'

const router = express.Router()

//route for adding a multiplayer game
router.get("/add-game", addMultiGame)

//route for finding all multiplayer games for history
router.get("/find-all-games", findAllMultiGames)

//route for deletion of multiplayer games
router.get("/delete-games", deleteMultiGames)

//route for finding total multiplayer games for stats
router.get("/find-total-games", findTotalMultiGames)

//route for setting the multiplayer board state before refresh
router.get("/set-board-state", setMultiBoardState)

//route for getting the multiplayer board state after refresh
router.get("/get-board-state", getMultiBoardState)

//route for clearing the multiplayer state
router.get("/clear-data", clearMultiData)

export { router as MultiplayerGameRouter }