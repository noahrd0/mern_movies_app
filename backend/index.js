import express from 'express';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies.js';

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://db:27017/mern_movies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connexion MongoDB OK"))
.catch((err) => console.error("❌ MongoDB error :", err));

app.use(express.json());
app.use('/api/movies', movieRoutes);

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
