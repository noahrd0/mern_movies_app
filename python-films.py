import requests
import json
import time

API_KEY = "47a69afd"  # 🔐 Remplace par ta clé OMDb valide
PREFIXES = ["art", "ame", "bat", "spi", "hom", "dea", "rom", "thr", "com", "war", "zon", "zon"]  # mots-clés ou préfixes de 3 lettres
MAX_PAGES = 10
OUTPUT_FILE = "films_prefixes.json"

base_url = "http://www.omdbapi.com/"
all_films = {}

for prefix in PREFIXES:
    print(f"\n🔍 Recherche avec le préfixe : '{prefix}'")
    for page in range(1, MAX_PAGES + 1):
        params = {
            "apikey": API_KEY,
            "s": prefix,
            "page": page
        }

        response = requests.get(base_url, params=params)
        data = response.json()

        if data.get("Response") == "True":
            for film in data["Search"]:
                imdb_id = film["imdbID"]
                all_films[imdb_id] = film  # évite les doublons
            print(f"✅ Page {page} : {len(data['Search'])} films trouvés")
            time.sleep(0.2)  # anti-spam
        else:
            print(f"❌ Fin des résultats pour '{prefix}' à la page {page} : {data.get('Error')}")
            break

# Sauvegarde JSON
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(list(all_films.values()), f, ensure_ascii=False, indent=4)

print(f"\n🎉 Total unique de films collectés : {len(all_films)}")
print(f"📁 Données sauvegardées dans : {OUTPUT_FILE}")
