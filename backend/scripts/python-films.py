import requests
import json
import time

API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzJkYmViOTQ3ZmU2NDVkNmIwMDgyMDQwNzQyOTVjNiIsIm5iZiI6MTcwMDA1MjkzMC4xMjcsInN1YiI6IjY1NTRiZmMyZWE4NGM3MTA5NmRjZTBlZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nGw-hZrE-y9wKSocbMGplF4wK690YLKOGBXGED0xaZA"  # 🔐 Mets ici ta clé API TMDb
OUTPUT_FILE = "tmdb_films.json"
BASE_URL = "https://api.themoviedb.org/3"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "accept": "application/json"
}

params = {
    "language": "fr-FR",  # ou "en-US"
    "page": 1
}

all_movies = []

# 🔁 On récupère les 5 premières pages de films populaires
for page in range(1, 101):
    print(f"📥 Récupération page {page}")
    params["page"] = page
    res = requests.get(f"{BASE_URL}/movie/popular", headers=headers, params=params)
    data = res.json()

    for movie in data.get("results", []):
        movie_id = movie["id"]

        # 🎯 Appel secondaire pour les détails du film
        details = requests.get(f"{BASE_URL}/movie/{movie_id}", headers=headers, params={"language": "fr-FR"}).json()

        # 🔧 Simplification des données à stocker
        film_data = {
            "id_tmdb": details.get("id"),
            "title": details.get("title"),
            "original_title": details.get("original_title"),
            "overview": details.get("overview"),
            "release_date": details.get("release_date"),
            "vote_average": details.get("vote_average"),
            "poster_path": f"https://image.tmdb.org/t/p/w500{details.get('poster_path')}" if details.get("poster_path") else None,
            "genres": [genre["name"] for genre in details.get("genres", [])],
            "language": details.get("original_language"),
            "runtime": details.get("runtime"),
            "popularity": details.get("popularity")
        }

        all_movies.append(film_data)
        time.sleep(0.2)  # pour respecter les limites d'API

# 💾 Sauvegarde JSON
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_movies, f, ensure_ascii=False, indent=4)

print(f"\n✅ {len(all_movies)} films sauvegardés dans '{OUTPUT_FILE}'")
