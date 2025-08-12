import { 
    addUser, findUser, checkUser, deleteUser, 
    createAvatar, deleteCookies 
} from '../services/UserService.js'
import { removeAiGames, deleteGameData } from '../services/AiGameService.js'
import { removeMultiplayerGames, deleteGameDataM } from '../services/MultiplayerGameService.js'

// Helper for consistent error responses
const errorResponse = (res, status, message) => {
    return res.status(status).json({ success: false, message })
}

// Login without email verification check
export const loginUser = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await checkUser({ username, password })
        
        if (!user) {
            return errorResponse(res, 401, 'Invalid credentials')
        }

        // Regenerate session to prevent fixation
        req.session.regenerate(async (err) => {
            if (err) {
                console.error('Session regeneration error:', err)
                return errorResponse(res, 500, 'Login failed')
            }

            req.session.username = username
            req.session.avatar = await createAvatar(username)
            req.session.userId = user.id 
            
            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Session save error:', saveErr)
                    return errorResponse(res, 500, 'Login failed')
                }

                res.cookie('connect4_sid', req.sessionID, {
                    sameSite: 'none',
                    secure: true,
                    httpOnly: true,
                    maxAge: 30 * 60 * 1000,
                    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
                })

                return res.json({ 
                    success: true, 
                    redirectUrl: '/home',
                    sessionId: req.sessionID 
                })
            })
        })
    } catch (error) {
        console.error('Login error:', error)
        errorResponse(res, 500, 'Internal server error')
    }
}

// Signup without email verification token
export const signupUser = async (req, res) => {
    const data = req.body
    
    try {
        if (!data.firstname || !data.lastname) {
            return errorResponse(res, 400, 'First and last name are required')
        }

        const avatar = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase()
        await addUser(data, avatar, null, true) // no token, set verified true immediately

        return res.json({ success: true })
    } catch(error) {
        console.error('Signup error:', error)
        if (error.message === "Invalid username") {
            errorResponse(res, 400, 'Invalid username')
        } else if (error.message === "Invalid email") {
            errorResponse(res, 400, 'Invalid email')
        } else {
            errorResponse(res, 500, 'Registration failed')
        }
    }
}

// Removed verifyUser logic
export const verifyUser = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Verification not required' })
}

// Session check
export const userEntrance = async (req, res) => {
    try {
        await deleteCookies({ onDelete: false, username: null })
        
        if (!req.session.username) {
            return res.json({ authenticated: false })
        }

        req.session.reload(async (err) => {
            if (err) {
                console.error('Session reload error:', err)
                return res.json({ authenticated: false })
            }

            req.session.touch()
            
            const userExists = await findUser(req.session.username)
            if (!userExists) {
                req.session.destroy()
                return res.json({ authenticated: false })
            }

            res.json({ 
                authenticated: true,
                username: req.session.username,
                avatar: req.session.avatar
            })
        })
    } catch (error) {
        console.error('Entrance check error:', error)
        res.json({ authenticated: false })
    }
}

// Logout
export const signoutUser = async (req, res) => {
    try {
        await deleteGameData(req.sessionID)
        await deleteGameDataM(req.sessionID)
        
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err)
                return errorResponse(res, 500, 'Logout failed')
            }
            
            res.clearCookie('connect4_sid', {
                domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
            })
            return res.json({ success: true })
        })
    } catch (error) {
        console.error('Signout error:', error)
        errorResponse(res, 500, 'Logout failed')
    }
}

// Delete account
export const destroyUser = async (req, res) => {
    try {
        if (!req.session.username) {
            return errorResponse(res, 401, 'Not authenticated')
        }

        await Promise.all([
            deleteGameData(req.sessionID),
            deleteGameDataM(req.sessionID),
            removeAiGames(req.session.username),
            removeMultiplayerGames(req.session.username),
            deleteUser(req.session.username),
            deleteCookies({ onDelete: true, username: req.session.username })
        ])

        req.session.destroy((err) => {
            if (err) {
                console.error('Destroy error:', err)
                return errorResponse(res, 500, 'Account deletion failed')
            }
            
            res.clearCookie('connect4_sid', {
                domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
            })
            return res.json({ success: true })
        })
    } catch (error) {
        console.error('Destroy error:', error)
        errorResponse(res, 500, 'Account deletion failed')
    }
}
