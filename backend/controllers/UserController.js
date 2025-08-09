import { 
    addUser, findUser, updateVerification, checkUser, deleteUser, 
    createAvatar, deleteCookies 
} from '../services/UserService.js';
import { removeAiGames, deleteGameData } from '../services/AiGameService.js';
import { removeMultiplayerGames, deleteGameDataM } from '../services/MultiplayerGameService.js';
import { v4 } from 'uuid';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.connect4.game@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

// Login
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await checkUser({ username, password });

    if (user) {
        if (user.getDataValue('verified')) {
            req.session.username = username;
            req.session.avatar = await createAvatar(username);
            return res.json({ success: true, redirectUrl: '/home' });
        }
        return res.json({ success: false, message: "You haven't verified your email!" });
    }
    res.json({ success: false, message: 'Invalid credentials' });
};

// Signup
export const signupUser = async (req, res) => {
    const data = req.body;

    try {
        const avatar = data.firstname.charAt(0).toUpperCase() + data.lastname.charAt(0).toUpperCase();
        const token = v4();
        await addUser(data, avatar, token, false);

        const mailOptions = {
            from: 'noreply.connect4.game@gmail.com',
            to: data.email,
            subject: 'Verify your email!',
            html: `<p>Click the following link to verify your email: <a href="${data.protocol}//${data.hostname}:${data.port}/verify/${data.username}/${token}">Click here!</a></p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error);
            else console.log('Email sent: ' + info.response);
        });

        res.json({ success: true });
    } catch (error) {
        if (error.message === "Invalid username") {
            res.json({ success: false, message: 'Invalid username' });
        } else if (error.message === "Invalid email") {
            res.json({ success: false, message: 'Invalid email' });
        }
    }
};

// Email verification
export const verifyUser = async (req, res) => {
    try {
        const user = await findUser(req.query.username);
        if (!user) return res.json({ success: false });

        if (user.getDataValue('token') === req.query.token) {
            await updateVerification(req.query.username);
            return res.json({ success: true });
        }
        res.json({ success: false });
    } catch (error) {
        console.log(error);
    }
};

// Home entrance
export const userEntrance = async (req, res) => {
    await deleteCookies({ onDelete: false, username: null });
    if (req.session.username) {
        req.session.touch();
        return res.json({ authenticated: true, username: req.session.username, avatar: req.session.avatar });
    }
    res.json({ authenticated: false });
};

// Sign out
export const signoutUser = async (req, res) => {
    await deleteGameData(req.sessionID);
    await deleteGameDataM(req.sessionID);
    req.session.username = undefined;
    req.session.avatar = undefined;

    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.json({ logout: false });
        }
        res.clearCookie('Connect4-sid');
        res.json({ logout: true });
    });
};

// Delete account
export const destroyUser = async (req, res) => {
    await deleteGameData(req.sessionID);
    await deleteGameDataM(req.sessionID);
    await removeAiGames(req.session.username);
    await removeMultiplayerGames(req.session.username);
    await deleteUser(req.session.username);
    await deleteCookies({ onDelete: true, username: req.session.username });

    req.session.username = undefined;
    req.session.avatar = undefined;

    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.json({ logout: false });
        }
        res.clearCookie('Connect4-sid');
        res.json({ logout: true });
    });
};
