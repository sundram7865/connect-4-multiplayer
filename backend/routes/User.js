import express from 'express';
import {
  destroyUser,
  loginUser,
  signoutUser,
  signupUser,
  userEntrance,
  verifyUser
} from '../controllers/UserController.js';

const router = express.Router();

// User login
router.post('/login', loginUser);

// User signup
router.post('/signup', signupUser);

// Email verification
router.patch('/verification', verifyUser);

// Check user authentication status / home route
router.get('/home', userEntrance);

// User signout
router.post('/signout', signoutUser);

// Delete user account
router.delete('/account', destroyUser);

export { router as UserRouter };
