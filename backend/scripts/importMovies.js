import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from '../models/Movie.js';

// 🔧 Détermination du chemin du fichier (équivalent __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'tmdb_films.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// ✅ Connexion Mongo
mongoose.connect('mongodb://db:27017/mern_movies', {
  // Ces options sont obsolètes mais inoffensives si tu les laisses
});

mongoose.connection.once('open', async () => {
  console.log('📦 Connexion à MongoDB établie.');
  try {
    await Movie.deleteMany(); // (optionnel) nettoie la collection
    await Movie.insertMany(data);
    console.log('✅ Films importés avec succès !');
  } catch (err) {
    console.error('❌ Erreur pendant l’import :', err.message);
  } finally {
    mongoose.connection.close();
  }
});
