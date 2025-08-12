import express from 'express'
import { destroyUser, loginUser, signoutUser, signupUser, userEntrance, verifyUser } from '../controllers/UserController.js'

const router = express.Router()

//route for the login of the user
router.post("/login", loginUser)

//route for signup of the user
router.post("/signup", signupUser)

//route for verification of the user
router.get("/verification", verifyUser)

//route for user entrance
router.get("/home", userEntrance)

//route for signout of the user
router.get("/signout", signoutUser)

//route for delete of the user
router.get("/delete", destroyUser)

export { router as UserRouter }