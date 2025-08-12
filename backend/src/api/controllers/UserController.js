import { addUser, findUser , updateVerification, checkUser, deleteUser, 
    createAvatar, deleteCookies } from '../services/UserService.js'
import { removeAiGames, deleteGameData } from '../services/AiGameService.js'
import { removeMultiplayerGames, deleteGameDataM } from '../services/MultiplayerGameService.js'
import { v4 } from 'uuid'
import nodemailer from 'nodemailer'



//handles the submission of the login form and checks if the user exists and sends a response to the client
export const loginUser = async (req,res) => {
    const {username,password} = req.body

    const user = await checkUser({username,password})
    if(user!==null) {
        if(user) {
            req.session.username = username
            req.session.avatar = await createAvatar(username)
            return res.json({ success: true, redirectUrl: '/home'})
        }
        else {
            res.json({success: false, message: "You haven't verified your email!"})
        }
    }
    else {
        res.json({ success: false, message: 'Invalid credentials' })
    }
}

//handles the submission of the signup form and checks if the user does not exist already and sends a response to the client
export const signupUser = async (req,res) => {
    const data = req.body
    
    try {
        const avatar = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase()
        const token = v4()
        const result = await addUser(data,avatar,token,false)

        res.json({ success: true })
    } catch(error) {
        if(error.message==="Invalid username") {
            res.json({ success: false, message: 'Invalid username' })
        } else if(error.message==="Invalid email") {
            res.json({ success: false, message: 'Invalid email' })
        }
    }
}

//handles the verification of the email
export const verifyUser = async (req,res) => {
    try {
        const user = await findUser(req.query.username)
        if(user===null) {
            res.json({success:false})
        }
        else {
            if(user.getDataValue('token')===req.query.token) {
                await updateVerification(req.query.username)
                res.json({success:true})
            }
            else {
                res.json({success:false})
            }
        }
    }catch(error) {
        console.log(error)
    }
}

//handles the path home and deletes the expired cookies and checks if the user is authenticated
export const userEntrance = async (req,res) => {
    await deleteCookies({onDelete: false, username: null})
    if(req.session.username) {
        req.session.touch()
        return res.json({ authenticated : true, username: req.session.username, avatar: req.session.avatar})
    }
    else {
        return res.json({ authenticated : false})
    }
}

//handles the signout and destroy the cookies about this session
export const signoutUser = async (req,res) => {
    await deleteGameData(req.sessionID)
    await deleteGameDataM(req.sessionID)
    req.session.username=undefined
    req.session.avatar=undefined
    req.session.destroy((err) => {
        if (err) {
          console.error('Logout error:', err)
          res.json({logout:false})
        } else {
          res.clearCookie('Connect4-sid')
          res.json({logout:true})
        }
    })
}

//handles the deletion of the account and delete all the cookies about this username
export const destroyUser = async (req,res) => {
    await deleteGameData(req.sessionID)
    await deleteGameDataM(req.sessionID)
    await removeAiGames(req.session.username)
    await removeMultiplayerGames(req.session.username)
    await deleteUser(req.session.username)
    await deleteCookies({onDelete: true, username: req.session.username})
    req.session.username=undefined
    req.session.avatar=undefined
    req.session.destroy((err) => {
        if (err) {
          console.error('Logout error:', err)
          res.json({logout:false})
        } else {
          res.clearCookie('Connect4-sid')
          res.json({logout:true})
        }
    })
}