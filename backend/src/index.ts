import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
    res.send('Ziksir Notes App Backend');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
