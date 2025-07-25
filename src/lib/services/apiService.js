import axios from "axios";
import { generatePrice } from "../features/gameSlice";

// Configuration Axios
const api = axios.create({
  baseURL: "/api", // Prepend "/api" to all requests, which then get handled by Next.js built-in API routes system
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get all games
  async getAllGames() {
    try {
      const response = await api.get("/games");
      // Add consistent pricing to each game
      const games = response.data.map((game) => {
        const priceData = generatePrice(game.id);
        return {
          ...game,
          price: priceData.price,
          discount: priceData.discount,
          discountedPrice: priceData.discountedPrice,
          hasDiscount: priceData.hasDiscount,
        };
      });
      return games;
    } catch (error) {
      console.error("Error while fetching games:", error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Get a game by ID
  async getGameById(id) {
    try {
      const response = await api.get(`/games/game?id=${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error while fetching game ${id}:`, error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Get games by platform
  async getGamesByPlatform(platform) {
    try {
      const response = await api.get(`/games?platform=${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Error while fetching games ${platform}:`, error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Get games by genre
  async getGamesByGenre(genre) {
    try {
      const response = await api.get(`/games?category=${genre}`);
      return response.data;
    } catch (error) {
      console.error(`Error while fetching games ${genre}:`, error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Get popular games (random selection)
  async getPopularGames(limit = 16) {
    try {
      const response = await api.get("/games");
      const allGames = response.data;

      // Shuffle the array and take the first games
      const shuffled = allGames.sort(() => 0.5 - Math.random());
      const games = shuffled.slice(0, limit);

      // Add consistent pricing to each game
      return games.map((game) => {
        const priceData = generatePrice(game.id);
        return {
          ...game,
          price: priceData.price,
          discount: priceData.discount,
          discountedPrice: priceData.discountedPrice,
          hasDiscount: priceData.hasDiscount,
        };
      });
    } catch (error) {
      console.error("Error while fetching popular games:", error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Get random price of all games
  async getRandomPriceOfAllGames() {
    try {
      const response = await api.get("/games");
      const games = response.data;

      return games.map((game) => {
        const priceData = generatePrice(game.id);
        return {
          ...game,
          price: priceData.price,
          discount: priceData.discount,
          discountedPrice: priceData.discountedPrice,
          hasDiscount: priceData.hasDiscount,
        };
      });
    } catch (error) {
      console.error("Error while fetching games prices:", error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Get discounted games (random selection)
  async getDiscountedGames(limit = 6) {
    try {
      const response = await api.get("/games");
      const allGames = response.data;

      // Shuffle the array and take the first games
      const shuffled = allGames.sort(() => 0.5 - Math.random());
      // Filter for games with 30% discount only
      const games = shuffled
        .map((game) => {
          const priceData = generatePrice(game.id);
          return {
            ...game,
            price: priceData.price,
            discount: priceData.discount,
            discountedPrice: priceData.discountedPrice,
            hasDiscount: priceData.hasDiscount,
          };
        })
        .filter((game) => game.discount === 30)
        .slice(0, limit);

      return games;
    } catch (error) {
      console.error("Error while fetching discounted games:", error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Add to cart
  async addToCart(game, userEmail) {
    try {
      const response = await api.post("/cart/add", { game, userEmail });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Remove from cart
  async removeFromCart(gameId) {
    try {
      const response = await api.delete(`/cart/remove?gameId=${gameId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },

  // Get cart
  async getCart() {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);

      // In case of error, throw the error to keep the loading active
      throw error;
    }
  },
};
