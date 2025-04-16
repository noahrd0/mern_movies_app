const API_URL = 'http://localhost:5001/api';

// Service pour les films
export const MovieService = {
  // Récupérer tous les films avec pagination
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_URL}/movies?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des films');
      }
      
      const data = await response.json();
      const moviesData = data.movies;
      
      // Transformer les données pour correspondre à notre structure
      const formattedMovies = moviesData.map(movie => ({
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
      
      return {
        movies: formattedMovies,
        pagination: data.pagination
      };
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },
  
  // Rechercher des films par titre avec pagination
  searchByTitle: async (title, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_URL}/movies/search/${title}?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche des films');
      }
      
      const data = await response.json();
      const moviesData = data.movies;
      
      // Transformer les données
      const formattedMovies = moviesData.map(movie => ({
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
        movies: formattedMovies,
        pagination: data.pagination
      };
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },
  
  // Filtrer les films par genre avec pagination
  getByGenre: async (genre, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_URL}/movies/genre/${genre}?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du filtrage des films par genre');
      }
      
      const data = await response.json();
      const moviesData = data.movies;
      
      // Transformer les données
      const formattedMovies = moviesData.map(movie => ({
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
        movies: formattedMovies,
        pagination: data.pagination
      };
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },
  
  // Récupérer un film par son ID (inchangé)
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
  
  // Ajouter un commentaire à un film (inchangé)
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

// Les autres services restent inchangés
export const AuthService = { /* ... */ };
export const WishlistService = { /* ... */ };