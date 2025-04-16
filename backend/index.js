import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from './config/database.js';
import userRoutes from './routes/UserRoutes.js';
import movieRoutes from './routes/movies.js';
import importMoviesIfEmpty from './scripts/autoImport.js';

dotenv.config();

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);

app.listen(PORT, async () => {
    console.log(`backend running at http://localhost:${PORT}`);
    connectDB();
    await importMoviesIfEmpty();
});


app.get('/', (req, res) => {
  res.send('Backend running');
});

