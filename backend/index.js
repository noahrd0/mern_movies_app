import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/database.js';
import userRoutes from './routes/UserRoutes.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('backend running');
});

app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`backend running at http://localhost:${PORT}`);
    connectDB();
});