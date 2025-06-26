import dotenv from 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connection from './canfig/connection.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

// Database Connection
connection();

const app = express();
const PORT = process.env.PORT || 8080;

const allowOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowOrigins, credentials: true}));


app.get('/', (req, res) => {
    res.send('Server is running smoothly!');
});

// Api endpoints
app.use('/api/auth', authRoutes)
app.use('/api/user', userRouter )



app.listen(PORT, ( ) => console.log(`Server PORT ${PORT} par Bahut Tej Chal Raha Hai`));