import express from 'express';
import cookieParser from 'cookie-parser';
import postRoutes from './routes/post.route.js';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
dotenv.config();



const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);


app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});