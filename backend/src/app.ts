import express from 'express';
import userRoutes from './routes/user';
import connectDB from './config/db';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

connectDB();

app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
