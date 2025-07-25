"use client";

import { useAllGames } from "@/lib/hooks/useAllGames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchQuery,
  setFilteredGames,
  clearSearch,
  removeActiveFilter,
} from "@/lib/features/searchSlice";
import { Search, X, Filter, Sparkles } from "lucide-react";

export default function SearchBar() {
  const dispatch = useDispatch();
  const { searchQuery, filterCategory, activeFilters } = useSelector(
    (state) => state.search
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { randomPriceOfAllGames } = useAllGames();

  // Keep the input focused as long as there's at least 1 char
  useEffect(() => {
    searchQuery === "" ? setIsFocused(false) : setIsFocused(true);
  }, [searchQuery]);

  useEffect(() => {
    if (activeFilters.length > 0 || searchQuery) {
      setIsSearching(true);
      const debounceTimer = setTimeout(() => {
        filterGames();
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setIsSearching(false);
    }
  }, [activeFilters, searchQuery]);

  const handleChange = (e) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));

    if (value.trim() === "" && activeFilters.length === 0) {
      dispatch(clearSearch());
      return;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      filterGames();
    }
    if (e.key === "Escape") {
      dispatch(clearSearch());
    }
  };

  const filterGames = () => {
    if (!randomPriceOfAllGames) return;

    let results = [...randomPriceOfAllGames];

    // Apply active filters
    if (activeFilters.length > 0) {
      // Apply genre filters
      const genreFilters = activeFilters
        .filter((f) => f.type === "genre")
        .map((f) => f.value);
      if (genreFilters.length > 0) {
        results = results.filter(
          (game) => game.genre && genreFilters.includes(game.genre)
        );
      }

      // Apply publisher filters
      const publisherFilters = activeFilters
        .filter((f) => f.type === "publisher")
        .map((f) => f.value);
      if (publisherFilters.length > 0) {
        results = results.filter(
          (game) => game.publisher && publisherFilters.includes(game.publisher)
        );
      }
    }

    // Apply search query if exists
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();

      // If specific filter category is selected
      if (filterCategory === "title") {
        results = results.filter((game) =>
          game.title.toLowerCase().includes(lowercaseQuery)
        );
      } else if (filterCategory === "genre") {
        results = results.filter(
          (game) =>
            game.genre && game.genre.toLowerCase().includes(lowercaseQuery)
        );
      } else if (filterCategory === "publisher") {
        results = results.filter(
          (game) =>
            game.publisher &&
            game.publisher.toLowerCase().includes(lowercaseQuery)
        );
      } else {
        // Search in all fields
        const titleMatches = results
          .filter((game) => game.title.toLowerCase().includes(lowercaseQuery))
          .map((game) => ({ ...game, matchType: "title" }));

        const genreMatches = results
          .filter(
            (game) =>
              game.genre && game.genre.toLowerCase().includes(lowercaseQuery)
          )
          .map((game) => ({ ...game, matchType: "genre" }));

        const publisherMatches = results
          .filter(
            (game) =>
              game.publisher &&
              game.publisher.toLowerCase().includes(lowercaseQuery)
          )
          .map((game) => ({ ...game, matchType: "publisher" }));

        results = [...titleMatches, ...genreMatches, ...publisherMatches];
        return dispatch(setFilteredGames(results));
      }
    }

    // Add match type for display grouping when there's no specific search
    results = results.map((game) => ({
      ...game,
      matchType: "title", // Default to title for filter results
    }));

    dispatch(setFilteredGames(results));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
    setIsFocused(false);
  };

  const handleRemoveFilter = (type, value) => {
    dispatch(removeActiveFilter({ type, value }));
  };

  const getFilterColor = (type) => {
    switch (type) {
      case "genre":
        return "bg-moss/20 text-moss border border-moss/30 hover:bg-moss/30";
      case "publisher":
        return "bg-plum/20 text-plum border border-plum/30 hover:bg-plum/30";
      default:
        return "bg-rosy/20 text-rosy border border-rosy/30 hover:bg-rosy/30";
    }
  };

  const getSearchPlaceholder = () => {
    switch (filterCategory) {
      case "title":
        return "Rechercher par titre...";
      case "genre":
        return "Rechercher par genre...";
      case "publisher":
        return "Rechercher par éditeur...";
      default:
        return "Rechercher des jeux, genres, éditeurs...";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div
          className={`relative flex items-center rounded-xl overflow-hidden transition-all duration-300 ${
            isFocused
              ? "ring-2 ring-rosy/50 shadow-lg shadow-rosy/10"
              : "hover:shadow-md hover:shadow-midnight/20"
          }`}>
          <div className="absolute left-4 z-10">
            {isSearching ? (
              <div className="animate-spin">
                <Sparkles size={20} className="text-rosy" />
              </div>
            ) : (
              <Search size={20} className="text-ivory/60" />
            )}
          </div>

          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(searchQuery.length > 0)}
            placeholder={getSearchPlaceholder()}
            className={`w-full bg-midnight/80 text-ivory pl-12 pr-20 sm:pr-24 py-3 sm:py-4 text-base sm:text-lg placeholder-ivory/50 focus:outline-none transition-all duration-300 ${
              isFocused ? "bg-midnight/90" : ""
            }`}
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-12 sm:right-16 top-1/2 transform -translate-y-1/2 text-ivory/60 hover:text-ivory transition-colors duration-200 p-1.5 sm:p-2 hover:bg-midnight/50 rounded-full"
              aria-label="Effacer la recherche">
              <X size={16} className="sm:w-4.5 sm:h-4.5" />
            </button>
          )}

          {/* Search button */}
          <button
            onClick={filterGames}
            disabled={isSearching}
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-rosy hover:bg-pine transition-colors duration-300 text-ivory px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center disabled:opacity-50 shadow-lg">
            {isSearching ? (
              <div className="animate-pulse">
                <Search size={16} className="sm:w-4.5 sm:h-4.5" />
              </div>
            ) : (
              <Search size={16} className="sm:w-4.5 sm:h-4.5" />
            )}
          </button>
        </div>

        {/* Search category indicator */}
        {filterCategory !== "title" && (
          <div className="absolute -top-2 left-4 bg-midnight px-2 py-1 rounded-md text-xs text-ivory/80">
            Recherche par {filterCategory === "genre" ? "genre" : "éditeur"}
          </div>
        )}
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-ivory/70">
              <Filter size={16} className="mr-2" />
              <span className="text-sm font-medium">Filtres actifs</span>
              <span className="ml-2 text-xs bg-rosy/10 text-rosy px-2 py-1 rounded-full">
                {activeFilters.length}
              </span>
            </div>

            {activeFilters.length > 1 && (
              <button
                onClick={handleClearSearch}
                className="text-xs text-ivory/60 hover:text-ivory underline transition-colors">
                Effacer tout
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <div
                key={`${filter.type}-${filter.value}-${index}`}
                className={`${getFilterColor(
                  filter.type
                )} px-3 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all duration-200`}>
                <span className="font-medium capitalize">{filter.type}:</span>
                <span className="truncate max-w-32">{filter.value}</span>
                <button
                  onClick={() => handleRemoveFilter(filter.type, filter.value)}
                  className="hover:bg-red-500/20 hover:text-red-400 p-1 rounded-full transition-colors ml-1"
                  aria-label={`Supprimer le filtre ${filter.type}: ${filter.value}`}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search tips */}
      {isFocused && !searchQuery && activeFilters.length === 0 && (
        <div className="bg-midnight/30 p-4 rounded-lg border border-ivory/10 text-ivory/70 text-sm">
          <p className="mb-2 font-medium">💡 Astuces de recherche:</p>
          <ul className="space-y-1 text-xs">
            <li>• Tapez le nom d'un jeu, genre ou éditeur</li>
            <li>• Utilisez les filtres pour affiner votre recherche</li>
            <li>• Appuyez sur Entrée pour rechercher ou Échap pour effacer</li>
          </ul>
        </div>
      )}
    </div>
  );
}
