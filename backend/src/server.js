import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import pgSession from 'connect-pg-simple'
import pg from 'pg'
import { UserRouter } from './api/routes/User.js'
import { AiGameRouter } from './api/routes/AiGame.js'
import { MultiplayerGameRouter } from './api/routes/MultiplayerGame.js'
import http from 'http'
import { createSocket } from './api/socketListeners/socket.js'

const PgSession = pgSession(session)
const { Pool } = pg

// Neon DB connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Neon
    }
})

const app = express()
const PORT = process.env.PORT || 5000

// CORS setup
app.options("*", cors({
    origin: ['https://connect-4-multiplayer.vercel.app'],
    methods: ["POST", "GET"],
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(cors({
    origin: ['https://connect-4-multiplayer.vercel.app'],
    methods: ["POST", "GET"],
    credentials: true,
    optionsSuccessStatus: 200
}))

// Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

// Session configuration with Postgres store
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new PgSession({
        pool,
        tableName: 'Session'
    }),
    resave: false,
    saveUninitialized: false,
    name: "Connect4-sid",
    rolling: true,
    cookie: {
        sameSite: "none",
        secure: true, // set to true if using HTTPS in production
        maxAge: 1000 * 60 * 20 // 20 minutes
    }
}))

// Routes
app.use("/user", UserRouter)
app.use("/ai", AiGameRouter)
app.use("/multiplayer", MultiplayerGameRouter)

// Server & Socket setup
const server = http.createServer(app)
createSocket(server)

server.listen(PORT, () => {
    console.log(`Server is open at ${PORT}`)
})
pool.connect()
    .then(client => {
        console.log('✅ Database connected successfully.');
        client.release();
    })
    .catch(err => {
        console.error('❌ Database connection error:', err.stack);
    });
