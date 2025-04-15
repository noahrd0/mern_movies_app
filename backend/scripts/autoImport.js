import Movie from '../models/Movie.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../tmdb_films.json');

export default async function importMoviesIfEmpty() {
  try {
    const count = await Movie.countDocuments();
    if (count > 0) {
      console.log(`ℹ️ ${count} films déjà présents, import ignoré`);
      return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await Movie.insertMany(data);
    console.log(`✅ ${data.length} films importés automatiquement`);
  } catch (err) {
    console.error("❌ Erreur import auto :", err.message);
  }
}
