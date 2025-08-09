import express from 'express';
import {
  addGame,
  deleteGames,
  findAllGames,
  findTotalGames,
  setBoardState,
  getBoardState,
  clearData
} from '../controllers/BotGameController.js';

const router = express.Router();

// create a bot game
router.post('/game', addGame);

// delete all bot games for the user
router.delete('/games', deleteGames);

// get bot game history for the user
router.get('/games', findAllGames);

// get aggregated bot stats for the user
router.get('/games/total', findTotalGames);

// save bot board state (before refresh)
router.post('/games/board-state', setBoardState);

// get bot board state (after refresh)
router.get('/games/board-state', getBoardState);

// clear saved bot game data
router.delete('/games/board-data', clearData);

export { router as BotGameRouter };
