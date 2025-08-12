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

// Enhanced CORS setup
const corsOptions = {
    origin: ['https://connect-4-multiplayer.vercel.app'],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

// Session configuration with Postgres store
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    store: new PgSession({
        pool,
        tableName: 'Session',
        createTableIfMissing: true // Add this line
    }),
    resave: false,
    saveUninitialized: false,
    name: "Connect4-sid",
    rolling: true,
    cookie: {
        sameSite: "none",
        secure: true,
        httpOnly: true, // Add this for security
        maxAge: 1000 * 60 * 20 // 20 minutes
    }
}

// For local testing without HTTPS
if (process.env.NODE_ENV === 'development') {
    sessionConfig.cookie.secure = false
    sessionConfig.cookie.sameSite = 'lax'
}

app.use(session(sessionConfig))

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK')
})

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