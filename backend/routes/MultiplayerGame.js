import express from 'express';
import {
  addMultiGame,
  findAllMultiGames,
  deleteMultiGames,
  findTotalMultiGames,
  setMultiBoardState,
  getMultiBoardState,
  clearMultiData
} from '../controllers/MultiplayerGameController.js';

const router = express.Router();

// Create a multiplayer game
router.post('/games', addMultiGame);

// Get all multiplayer games for the current user
router.get('/games', findAllMultiGames);

// Delete all multiplayer games for the current user
router.delete('/games', deleteMultiGames);

// Get multiplayer game stats
router.get('/games/total', findTotalMultiGames);

// Save multiplayer board state (before refresh)
router.post('/games/board-state', setMultiBoardState);

// Get multiplayer board state (after refresh)
router.get('/games/board-state', getMultiBoardState);

// Clear saved multiplayer game state
router.delete('/games/board-data', clearMultiData);

export { router as MultiplayerGameRouter };
