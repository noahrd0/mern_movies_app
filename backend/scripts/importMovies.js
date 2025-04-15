const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Movie = require("../models/Movie"); // adapte selon ton modèle

const filePath = path.join(__dirname, "../tmdb_films.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

mongoose
  .connect("mongodb://127.0.0.1:27017/mern_movies", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("📦 Connexion à MongoDB établie.");
    await Movie.deleteMany(); // optionnel : vide la collection avant
    await Movie.insertMany(data);
    console.log("✅ Films importés !");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB:", err);
    process.exit(1);
  });
