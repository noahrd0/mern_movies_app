import express from 'express';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies.js';
import importMoviesIfEmpty from './scripts/autoImport.js';

const app = express();
const PORT = 5000;

// 🔌 Connexion MongoDB
mongoose.connect('mongodb://db:27017/mern_movies', {
})
.then(async () => {
  console.log("✅ Connexion MongoDB OK");

  await importMoviesIfEmpty();

  app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB error :", err);
});

// 🌐 Middleware & routes
app.use(express.json());
app.use('/api/movies', movieRoutes);

// 🔧 Route racine
app.get('/', (req, res) => {
  res.send('Backend running');
});
