import Movie from '../models/Movie.js';
import Actor from '../models/Actror.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filmsPath = path.join(__dirname, '../scripts/films_with_cast.json');
const actorsPath = path.join(__dirname, '../scripts/actors_with_movies.json');

export default async function importDataIfEmpty() {
  try {
    const movieCount = await Movie.countDocuments();
    const actorCount = await Actor.countDocuments();

    if (movieCount > 0) {
      console.log(`ℹ️ ${movieCount} films déjà présents, import ignoré`);
    } else {
      const filmData = JSON.parse(fs.readFileSync(filmsPath, 'utf-8'));
      await Movie.insertMany(filmData);
      console.log(`✅ ${filmData.length} films importés automatiquement`);
    }

    if (actorCount > 0) {
      console.log(`ℹ️ ${actorCount} acteurs déjà présents, import ignoré`);
    } else {
      const actorData = JSON.parse(fs.readFileSync(actorsPath, 'utf-8'));
      await Actor.insertMany(actorData);
      console.log(`✅ ${actorData.length} acteurs importés automatiquement`);
    }

  } catch (err) {
    console.error("❌ Erreur import auto :", err.message);
  }
}
