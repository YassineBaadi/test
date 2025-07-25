import { createSlice } from "@reduxjs/toolkit";

// Price generator function - will generate consistent prices based on game ID
export const generatePrice = (gameId) => {
  // Use the game ID to generate a consistent price
  const seed = parseInt(gameId, 10);
  // Generate a price between $5.99 and $99.99
  const basePrice = ((seed % 95) + 5 + 0.99).toFixed(2);

  // Determine if game has discount (based on game ID for consistency)
  const hasDiscount = seed % 5 === 0;
  const discount = hasDiscount ? Math.floor(seed % 21) + 10 : 0;

  // Calculate discounted price if applicable
  const discountedPrice = hasDiscount
    ? (parseFloat(basePrice) * (1 - discount / 100)).toFixed(2)
    : basePrice;

  return {
    price: basePrice,
    discount,
    discountedPrice,
    hasDiscount,
  };
};

const GameSlice = createSlice({
  name: "game",
  initialState: {
    loading: false,
    error: null,
    allGames: [],
    mostPlayedGames: [],
    randomPriceOfAllGames: [],
    discountedGames: [],
    budgetGames: [], // Add budgetGames to state
  },
  reducers: {
    setAllGames: (state, action) => {
      state.allGames = action.payload;
    },
    setMostPlayedGames: (state, action) => {
      state.mostPlayedGames = action.payload;
    },
    setRandomPriceOfAllGames: (state, action) => {
      state.randomPriceOfAllGames = action.payload;
    },
    setDiscountedGames: (state, action) => {
      state.discountedGames = action.payload;
    },
    setBudgetGames: (state, action) => {
      state.budgetGames = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAllGames,
  setMostPlayedGames,
  setRandomPriceOfAllGames,
  setDiscountedGames,
  setBudgetGames,
  setLoading,
  setError,
  clearError,
} = GameSlice.actions;

export default GameSlice.reducer;
