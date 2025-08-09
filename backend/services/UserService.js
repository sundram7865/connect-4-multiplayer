import { User, Session, GameData } from '../models/ConnectModels.js'
import { Op, literal } from 'sequelize'
import bcrypt from 'bcrypt'

// Adds a new user with hashed password and initial stats
export async function addUser(data, avatar, token, verified) {
    try {
        // Check if email or username already exists
        const existingEmail = await User.findOne({ where: { email: data.email } })
        if (existingEmail) throw new Error("EMAIL_EXISTS")

        const existingUsername = await User.findOne({ where: { username: data.username } })
        if (existingUsername) throw new Error("USERNAME_EXISTS")

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10)

        // Create user with initial bot/multiplayer stats
        const user = await User.create({
            username: data.username,
            firstname: data.firstname,
            lastname: data.lastname,
            avatar,
            email: data.email,
            password: hashedPassword,
            token,
            verified,
            botGames: {
                trivial: { total: 0, win: 0, defeat: 0, draw: 0 },
                medium: { total: 0, win: 0, defeat: 0, draw: 0 },
                hard: { total: 0, win: 0, defeat: 0, draw: 0 }
            },
            multiplayerGames: { total: 0, win: 0, defeat: 0, draw: 0 }
        })

        return user
    } catch (error) {
        throw error
    }
}

// Find a user by username
export async function findUser(username) {
    try {
        return await User.findOne({ where: { username } })
    } catch (error) {
        console.error(error)
    }
}

// Verify a user's account
export async function updateVerification(username) {
    try {
        const user = await User.findOne({ where: { username } })
        if (!user) throw new Error("USER_NOT_FOUND")

        await user.update({ verified: true })
        return user
    } catch (error) {
        console.error(error)
    }
}

// Authenticate a user
export async function checkUser(data) {
    try {
        const user = await User.findOne({ where: { username: data.username } })
        if (!user) return null

        const isMatch = await bcrypt.compare(data.password, user.password)
        return isMatch ? user : null
    } catch (error) {
        console.error(error)
    }
}

// Delete a user
export async function deleteUser(username) {
    try {
        await User.destroy({ where: { username } })
    } catch (error) {
        console.error(error)
    }
}

// Create an avatar from initials
export async function createAvatar(username) {
    try {
        const user = await User.findOne({ where: { username } })
        if (!user) throw new Error("USER_NOT_FOUND")

        return `${user.firstname.charAt(0).toUpperCase()}${user.lastname.charAt(0).toUpperCase()}`
    } catch (error) {
        console.error(error)
    }
}

// Delete expired or user-specific cookies
export async function deleteCookies(data) {
    try {
        if (!data.onDelete) {
            const now = new Date()
            const expiredSessions = await Session.findAll({
                where: { expire: { [Op.lt]: now } }
            })

            await GameData.destroy({ where: { SessionSid: null } })
            for (let session of expiredSessions) {
                await session.destroy()
            }
        } else {
            await Session.destroy({
                where: {
                    [Op.and]: [literal(`"sess"->>'username' = '${data.username}'`)]
                }
            })
        }
    } catch (error) {
        console.error(error)
    }
}
