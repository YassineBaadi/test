import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  filterCategory: "",
  filteredGames: [],
  isSearchActive: false,
  activeFilters: [],
};

const SearchSlice = createSlice({
  name: "search",
  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.isSearchActive =
        action.payload.length > 0 || state.activeFilters.length > 0;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    setFilteredGames: (state, action) => {
      state.filteredGames = action.payload;
      state.isSearchActive =
        action.payload.length > 0 ||
        state.activeFilters.length > 0 ||
        state.searchQuery.length > 0;
    },
    addActiveFilter: (state, action) => {
      // Check if filter already exists
      const filterExists = state.activeFilters.some(
        (filter) =>
          filter.type === action.payload.type &&
          filter.value === action.payload.value
      );

      if (!filterExists) {
        state.activeFilters.push(action.payload);
        state.isSearchActive = true;
      }
    },
    removeActiveFilter: (state, action) => {
      state.activeFilters = state.activeFilters.filter(
        (filter) =>
          !(
            filter.type === action.payload.type &&
            filter.value === action.payload.value
          )
      );
      state.isSearchActive =
        state.activeFilters.length > 0 || state.searchQuery.length > 0;
    },
    clearSearch: (state) => {
      state.searchQuery = "";
      state.filterCategory = "";
      state.filteredGames = [];
      state.activeFilters = [];
      state.isSearchActive = false;
    },
  },
});

export const {
  setSearchQuery,
  setFilterCategory,
  setFilteredGames,
  addActiveFilter,
  removeActiveFilter,
  clearSearch,
} = SearchSlice.actions;

export default SearchSlice.reducer;
