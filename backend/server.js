import express from 'express';         
import cors from 'cors';                 
import 'dotenv/config';                  
import session from 'express-session';   
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';    
import pg from 'pg';                     
import http from 'http';                


const { Pool } = pg;


const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false }        
});

const app = express();
const PORT = process.env.PORT || 5000;


app.options('*', cors({ 
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET'],
    credentials: true,
    optionsSuccessStatus: 200 
}));

app.use(cors({ 
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET'],
    credentials: true,
    optionsSuccessStatus: 200 
}));

//  Middlewares
app.use(express.static('public'));              
app.use(express.urlencoded({ extended: false }));
app.use(express.json());                        
app.use(bodyParser.json());                      
app.use(cookieParser());                        


const server = http.createServer(app);

pool.connect()
    .then(() => {
        console.log(" Database connected successfully");
        server.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(" Database connection error:", err.stack);
        process.exit(1); 
    });