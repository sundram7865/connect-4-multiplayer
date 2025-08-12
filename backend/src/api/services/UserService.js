import { User, Session, GameData } from '../models/ConnectModels.js'
import { Op, literal} from 'sequelize'
import bcrypt from 'bcrypt'

//adds a user in table User and check if exists someone with the same username or email.
//The password in the database inserts with hashing/encrypted. 
export async function addUser(data, avatar, token ,verified) {

    try {
        
        let user = await User.findOne( { 
        where: { 
            email: data.email
        }})

        if(user!==null) {
            throw new Error("Invalid email")
        }
        else {
            user = await User.findOne( { 
            where: { 
                username: data.username
            }})
            if(user!==null) {
                throw new Error("Invalid username")
            }
        }

        if(user===null) {
            const newPassword = await bcrypt.hash(data.password, 10)
            user = await User.create({ username: data.username, 
                firstname: data.firstname, lastname: data.lastname, avatar: avatar,
                email: data.email, password: newPassword, token: token ,verified: verified ,aiGames: {
                    trivial: {
                        total: 0,
                        win: 0,
                        defeat: 0,
                        draw: 0
                    },
                    medium: {
                        total: 0,
                        win: 0,
                        defeat: 0,
                        draw: 0
                    },
                    hard: {
                        total: 0,
                        win: 0,
                        defeat: 0,
                        draw: 0
                    }
                }, multiplayerGames: {
                    total: 0,
                    win: 0,
                    defeat: 0,
                    draw: 0
                }
            })
            return {user:user,username:0,email:0}
        }
    } catch(error) {
        throw error
    }
}

//finds a user according to username
export async function findUser(username) {
    try {
        
        let user = await User.findOne( { 
        where: { 
            username: username
        }})
        return user
    } catch(error) {
        console.log(error)
    }
}

//updates the variable verified and make it true when the user is verified
export async function updateVerification(username) {
    try {
        
        let user = await User.findOne( { 
        where: { 
            username: username
        }})

        await user.update({verified: true})

        return user
    } catch(error) {
        console.log(error)
    }
}

//checks if a user exists in the table User with this username 
//and the password is correct for this username in the database
export async function checkUser(data) {

    try {
        
        let user = await User.findOne( { 
        where: { 
            username: data.username
        }})

        if(user===null) {
            return null
        }

        const match = await bcrypt.compare(data.password,user.password)
        if(match) {
           return user
        }
        else {
            return null
        }
    } catch(error) {
        console.log(error)
    }
}

//deletes a user from the table User in the database
export async function deleteUser(user) {

    try{
        await User.destroy({
            where:{
            username: user
        }})
    }catch(error) {
        console.log(error)
    }
}

//creates the avatar and inserts into the table User, is the initials of the firstname and the lastname
export async function createAvatar(username) {

    try {
        let user = await User.findOne( { 
        where: { 
            username: username
        }})

        const avatar = await user.firstname.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase()
        return avatar
    } catch(error) {
        console.log(error)
    }
}

//deletes cookies if they are expired and if have multiple opening windows with this username 
//and the account is deleted the cookies destroy for all the windows
export async function deleteCookies(data) {

    if(!data.onDelete) {
        const date = new Date()
        try {
            const expiredCookies = await Session.findAll({
                where: {
                    expire: {
                        [Op.lt]: date, 
                    }
                }
            })
            await GameData.destroy({
                where: {
                    SessionSid: null
                }
            })
            for(let cookies of expiredCookies ) {
                await cookies.destroy()
            }
        }catch(error) {
            console.log(error)
        }
    }
    else {
        try {
            await Session.destroy({
                where: { 
                    [Op.and]: [
                        literal(`"sess"->>'username' = '${data.username}'`)
                    ]
                }
            })
        }catch(error) {
            console.log(error)
        }
    }
}