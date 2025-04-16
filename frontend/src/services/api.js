const API_URL = 'http://localhost:5000/api';

// Service pour les films
export const MovieService = {
  // Récupérer tous les films
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/movies`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des films');
      }

      const moviesData = await response.json();

      // Transformer les données pour correspondre à notre structure
      return moviesData.map(movie => ({
        id: movie._id,
        id_tmdb: movie.id_tmdb,
        title: movie.title,
        original_title: movie.original_title,
        director: movie.director || "Réalisateur inconnu",
        year: new Date(movie.release_date).getFullYear(),
        poster: movie.poster_path || "https://via.placeholder.com/250x370",
        description: movie.overview,
        rating: movie.vote_average / 2, // Convertir la note sur 10 à une note sur 5
        runtime: movie.runtime,
        genres: movie.genres,
        popularity: movie.popularity,
        comments: movie.comments || []
      }));
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },

  // Récupérer les films filtrés par recherche et genre
  filter: async (search = '', genre = '', page = 1) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      params.append('page', page);

      const response = await fetch(`${API_URL}/movies/filter?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erreur lors du filtrage des films");
      }

      const data = await response.json();

      const formatted = data.movies.map(movie => ({
        id: movie._id,
        id_tmdb: movie.id_tmdb,
        title: movie.title,
        original_title: movie.original_title,
        director: movie.director || "Réalisateur inconnu",
        year: new Date(movie.release_date).getFullYear(),
        poster: movie.poster_path || "https://via.placeholder.com/250x370",
        description: movie.overview,
        rating: movie.vote_average / 2,
        runtime: movie.runtime,
        genres: movie.genres,
        popularity: movie.popularity,
        comments: movie.comments || []
      }));

      return {
        movies: formatted,
        total: data.total,
        page: data.page,
        pages: data.pages
      };
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },



  // Récupérer un film par son ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/movies/${id}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des détails du film');
      }

      const movieData = await response.json();

      // Formatter les données
      return {
        id: movieData._id,
        id_tmdb: movieData.id_tmdb,
        title: movieData.title,
        original_title: movieData.original_title,
        director: movieData.director || "Réalisateur inconnu",
        year: new Date(movieData.release_date).getFullYear(),
        poster: movieData.poster_path || "https://via.placeholder.com/250x370",
        description: movieData.overview,
        rating: movieData.vote_average / 2,
        runtime: movieData.runtime,
        genres: movieData.genres,
        popularity: movieData.popularity,
        comments: movieData.comments || []
      };
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },

  // Ajouter un commentaire à un film
  addComment: async (movieId, commentText, rating) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Vous devez être connecté pour ajouter un commentaire');
      }

      const response = await fetch(`${API_URL}/movies/${movieId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: commentText,
          rating: rating
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du commentaire');
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  }
};

// Service pour l'authentification
export const AuthService = {
  // Connexion
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.name);

      return data;
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },

  // Inscription
  register: async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur d\'inscription');
      }

      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.name);

      return data;
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  // Vérifier si l'utilisateur est connecté
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Récupérer le nom d'utilisateur
  getUsername: () => {
    return localStorage.getItem('username');
  }
};

// Service pour la wishlist (utilisation du localStorage)
export const WishlistService = {
  // Récupérer la wishlist de l'utilisateur
  getUserWishlist: (username) => {
    try {
      const savedWishlist = localStorage.getItem(`wishlist_${username}`);
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération de la wishlist:", error);
      return [];
    }
  },

  // Sauvegarder la wishlist
  saveWishlist: (username, wishlist) => {
    try {
      localStorage.setItem(`wishlist_${username}`, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la wishlist:", error);
    }
  },

  // Ajouter un film à la wishlist
  addToWishlist: (username, movie) => {
    try {
      const currentWishlist = WishlistService.getUserWishlist(username);

      if (!currentWishlist.some(m => m.id === movie.id)) {
        const updatedWishlist = [...currentWishlist, movie];
        WishlistService.saveWishlist(username, updatedWishlist);
        return updatedWishlist;
      }

      return currentWishlist;
    } catch (error) {
      console.error("Erreur lors de l'ajout à la wishlist:", error);
      return [];
    }
  },

  // Retirer un film de la wishlist
  removeFromWishlist: (username, movieId) => {
    try {
      const currentWishlist = WishlistService.getUserWishlist(username);
      const updatedWishlist = currentWishlist.filter(movie => movie.id !== movieId);
      WishlistService.saveWishlist(username, updatedWishlist);
      return updatedWishlist;
    } catch (error) {
      console.error("Erreur lors du retrait de la wishlist:", error);
      return [];
    }
  }
};