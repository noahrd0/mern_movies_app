import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from '../models/Movie.js';
import connectDB from '../config/database.js'; // Import de connectDB

// 🔧 Détermination du chemin du fichier (équivalent __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'tmdb_films.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// ✅ Connexion à MongoDB
connectDB().then(async () => {
  console.log('📦 Connexion à MongoDB établie.');
  try {
    await Movie.deleteMany(); // (optionnel) nettoie la collection
    await Movie.insertMany(data);
    console.log('✅ Films importés avec succès !');
  } catch (err) {
    console.error('❌ Erreur pendant l’import :', err.message);
  } finally {
    mongoose.connection.close(); // Ferme la connexion à MongoDB
  }
}).catch((err) => {
  console.error('❌ Erreur de connexion à MongoDB :', err.message);
});