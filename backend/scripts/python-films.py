import requests
import json
import time

API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzJkYmViOTQ3ZmU2NDVkNmIwMDgyMDQwNzQyOTVjNiIsIm5iZiI6MTcwMDA1MjkzMC4xMjcsInN1YiI6IjY1NTRiZmMyZWE4NGM3MTA5NmRjZTBlZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nGw-hZrE-y9wKSocbMGplF4wK690YLKOGBXGED0xaZA"  # 🔐 Remets ta clé API ici
BASE_URL = "https://api.themoviedb.org/3"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "accept": "application/json"
}

params = {
    "language": "fr-FR",
    "page": 1
}

films_with_cast = []
actors_with_movies = {}

for page in range(1, 201):  # 🔁 5 pages, ajuste selon besoin
    print(f"📥 Récupération page {page}")
    params["page"] = page
    res = requests.get(f"{BASE_URL}/movie/popular", headers=headers, params=params)

    if res.status_code != 200:
        print(f"❌ Erreur lors de la récupération des films page {page} (status {res.status_code})")
        continue

    data = res.json()
    if not data.get("results"):
        print(f"⚠️ Pas de résultats pour la page {page}")
        continue

    for movie in data["results"]:
        movie_id = movie["id"]

        # 🔎 Détails du film
        details_res = requests.get(f"{BASE_URL}/movie/{movie_id}", headers=headers, params={"language": "fr-FR"})
        if details_res.status_code != 200:
            print(f"❌ Erreur détails film {movie_id} (status {details_res.status_code})")
            continue
        details = details_res.json()

        # 👥 Casting
        credits_res = requests.get(f"{BASE_URL}/movie/{movie_id}/credits", headers=headers)
        if credits_res.status_code != 200:
            print(f"❌ Erreur crédits film {movie_id} (status {credits_res.status_code})")
            continue
        credits = credits_res.json()

        cast = credits.get("cast", [])[:10]

        movie_info = {
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
            "popularity": details.get("popularity"),
            "cast": []
        }

        for actor in cast:
            actor_info = {
                "id": actor.get("id"),
                "name": actor.get("name"),
                "character": actor.get("character"),
                "profile_path": f"https://image.tmdb.org/t/p/w500{actor.get('profile_path')}" if actor.get("profile_path") else None
            }

            movie_info["cast"].append(actor_info)

            actor_id = actor["id"]
            if actor_id not in actors_with_movies:
                actors_with_movies[actor_id] = {
                    "id": actor_id,
                    "name": actor["name"],
                    "profile_path": actor_info["profile_path"],
                    "movies": []
                }

            actors_with_movies[actor_id]["movies"].append({
                "id_tmdb": movie_info["id_tmdb"],
                "title": movie_info["title"],
                "release_date": movie_info["release_date"],
                "character": actor.get("character")
            })

        films_with_cast.append(movie_info)
        time.sleep(0.3)  # pour respecter les limites API

# 💾 Sauvegarde
with open("films_with_cast.json", "w", encoding="utf-8") as f:
    json.dump(films_with_cast, f, ensure_ascii=False, indent=4)

with open("actors_with_movies.json", "w", encoding="utf-8") as f:
    json.dump(list(actors_with_movies.values()), f, ensure_ascii=False, indent=4)

print(f"\n✅ {len(films_with_cast)} films enregistrés dans 'films_with_cast.json'")
print(f"✅ {len(actors_with_movies)} acteurs enregistrés dans 'actors_with_movies.json'")