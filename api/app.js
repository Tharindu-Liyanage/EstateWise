import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postRoutes from './routes/post.route.js';
import authRoutes from './routes/auth.route.js';
import testRoutes from  './routes/test.route.js';
import userRoutes from './routes/user.route.js';
import dotenv from 'dotenv';
dotenv.config();



const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/users', userRoutes);


app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});