import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import Actor from '../models/Actor.js';
import connectDB from '../config/database.js'; // ✅ On réutilise ta connexion
import importDataIfEmpty from './importDataIfEmpty.js';

await connectDB(); // ✅ Utilise ta méthode maison

await Movie.deleteMany({});
console.log('🗑️ Tous les films supprimés');

await Actor.deleteMany({});
console.log('🗑️ Tous les acteurs supprimés');

await importDataIfEmpty(); // 📥 Réimport
await mongoose.disconnect();

console.log('✅ Base réinitialisée et données importées');
