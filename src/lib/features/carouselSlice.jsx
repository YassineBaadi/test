import { createSlice } from "@reduxjs/toolkit";

{
  /* --------------------------------------------------------------------|
    --------------------------- Initial State ---------------------------|
  */
}
const initialState = {
  currentHighlight: 0,
  highlights: [],
  loading: false,
  autoSlideInterval: null,
  error: null,
};

{
  /* --------------------------------------------------------------------|
    --------------------------- Carousel Slice ---------------------------|
  */
}
const CarouselSlice = createSlice({
  name: "carousel",
  initialState,
  reducers: {
    // --------------------------------------------------------------------|
    // --------------------------- Setters ---------------------------|
    // --------------------------------------------------------------------|
    setCurrentHighlight: (state, action) => {
      state.currentHighlight = action.payload;
    },
    setHighlights: (state, action) => {
      state.highlights = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAutoSlideInterval: (state, action) => {
      state.autoSlideInterval = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // --------------------------------------------------------------------|
    // --------------------------- Actions ---------------------------|
    // --------------------------------------------------------------------|
    nextHighlight: (state) => {
      if (state.loading || state.highlights.length === 0) return;
      state.currentHighlight =
        (state.currentHighlight + 1) % state.highlights.length;
    },
    prevHighlight: (state) => {
      if (state.loading || state.highlights.length === 0) return;
      state.currentHighlight =
        (state.currentHighlight - 1 + state.highlights.length) %
        state.highlights.length;
    },
    goToHighlight: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.highlights.length) {
        state.currentHighlight = index;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

{
  /* --------------------------------------------------------------------|
    --------------------------- Exports ---------------------------|
  */
}
export const {
  setCurrentHighlight,
  setHighlights,
  setLoading,
  nextHighlight,
  prevHighlight,
  goToHighlight,
  setAutoSlideInterval,
  setDiscountedGames,
  setError,
  clearError,
} = CarouselSlice.actions;

export default CarouselSlice.reducer;
