"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setFilterCategory,
  setFilteredGames,
  addActiveFilter,
  removeActiveFilter,
} from "@/lib/features/searchSlice";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, X, Filter, Check } from "lucide-react";
import { useAllGames } from "@/lib/hooks/useAllGames";

export default function FilterSideBar() {
  const dispatch = useDispatch();
  const {
    searchQuery,
    filterCategory,
    filteredGames,
    isSearchActive,
    activeFilters,
  } = useSelector((state) => state.search);
  const { randomPriceOfAllGames } = useAllGames();

  const [expandedSections, setExpandedSections] = useState({
    genres: false,
    publishers: false,
  });
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availablePublishers, setAvailablePublishers] = useState([]);

  useEffect(() => {
    if (randomPriceOfAllGames && randomPriceOfAllGames.length > 0) {
      // Extract unique genres
      const genreSet = new Set();
      randomPriceOfAllGames.forEach((game) => {
        if (game.genre) genreSet.add(game.genre);
      });
      setAvailableGenres(Array.from(genreSet).sort());

      // Extract unique publishers
      const publisherSet = new Set();
      randomPriceOfAllGames.forEach((game) => {
        if (game.publisher) publisherSet.add(game.publisher);
      });
      setAvailablePublishers(Array.from(publisherSet).sort());
    }
  }, [randomPriceOfAllGames]);

  const handleFilterCategory = (category) => {
    dispatch(setFilterCategory(category));
  };

  const handleAddFilter = (type, value) => {
    dispatch(addActiveFilter({ type, value }));
    filterGamesByActiveFilters();
  };

  const handleRemoveFilter = (type, value) => {
    dispatch(removeActiveFilter({ type, value }));
    filterGamesByActiveFilters();
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isFilterActive = (type, value) => {
    return activeFilters.some(
      (filter) => filter.type === type && filter.value === value
    );
  };

  const getActiveFiltersCount = (type) => {
    return activeFilters.filter((filter) => filter.type === type).length;
  };

  // Filter games based on active filters and search query
  const filterGamesByActiveFilters = () => {
    if (!randomPriceOfAllGames) return;

    let filteredResults = [...randomPriceOfAllGames];

    // Apply genre filters
    const genreFilters = activeFilters
      .filter((f) => f.type === "genre")
      .map((f) => f.value);
    if (genreFilters.length > 0) {
      filteredResults = filteredResults.filter(
        (game) => game.genre && genreFilters.includes(game.genre)
      );
    }

    // Apply publisher filters
    const publisherFilters = activeFilters
      .filter((f) => f.type === "publisher")
      .map((f) => f.value);
    if (publisherFilters.length > 0) {
      filteredResults = filteredResults.filter(
        (game) => game.publisher && publisherFilters.includes(game.publisher)
      );
    }

    // Apply search query if exists
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filteredResults = filteredResults.filter((game) =>
        game.title.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Add match type for display grouping
    filteredResults = filteredResults.map((game) => ({
      ...game,
      matchType: "title", // Default to title for filter results
    }));

    dispatch(setFilteredGames(filteredResults));
  };

  return (
    <div className="text-ivory space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rosy">
          <Filter size={20} />
          <h2 className="text-xl font-bold">Filtres</h2>
        </div>
        {activeFilters.length > 0 && (
          <div className="text-xs text-ivory/60 bg-rosy/10 px-2 py-1 rounded-full">
            {activeFilters.length} actif{activeFilters.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Search Category Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-ivory/80 uppercase tracking-wider">
          Rechercher par
        </h3>
        <div className="space-y-2">
          {[
            { key: "title", label: "Titre" },
            { key: "genre", label: "Genre" },
            { key: "publisher", label: "Éditeur" },
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => handleFilterCategory(category.key)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterCategory === category.key
                  ? "bg-rosy text-white shadow-lg"
                  : "bg-midnight/30 text-ivory/90 hover:bg-midnight/50 hover:text-ivory"
              }`}>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Filters */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("genres")}
          className="w-full flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-ivory/80 uppercase tracking-wider">
              Genres
            </h3>
            {getActiveFiltersCount("genre") > 0 && (
              <span className="text-xs bg-moss/20 text-moss px-2 py-0.5 rounded-full">
                {getActiveFiltersCount("genre")}
              </span>
            )}
          </div>
          {expandedSections.genres ? (
            <ChevronDown size={16} className="text-ivory/60" />
          ) : (
            <ChevronRight size={16} className="text-ivory/60" />
          )}
        </button>

        {expandedSections.genres && (
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {availableGenres.map((genre) => (
              <button
                key={genre}
                onClick={() =>
                  isFilterActive("genre", genre)
                    ? handleRemoveFilter("genre", genre)
                    : handleAddFilter("genre", genre)
                }
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-between group ${
                  isFilterActive("genre", genre)
                    ? "bg-moss/20 text-moss border border-moss/30"
                    : "bg-midnight/20 text-ivory/80 hover:bg-midnight/40 hover:text-ivory"
                }`}>
                <span className="truncate">{genre}</span>
                {isFilterActive("genre", genre) && (
                  <Check size={14} className="text-moss" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Publisher Filters */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("publishers")}
          className="w-full flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-ivory/80 uppercase tracking-wider">
              Éditeurs
            </h3>
            {getActiveFiltersCount("publisher") > 0 && (
              <span className="text-xs bg-plum/20 text-plum px-2 py-0.5 rounded-full">
                {getActiveFiltersCount("publisher")}
              </span>
            )}
          </div>
          {expandedSections.publishers ? (
            <ChevronDown size={16} className="text-ivory/60" />
          ) : (
            <ChevronRight size={16} className="text-ivory/60" />
          )}
        </button>

        {expandedSections.publishers && (
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {availablePublishers.map((publisher) => (
              <button
                key={publisher}
                onClick={() =>
                  isFilterActive("publisher", publisher)
                    ? handleRemoveFilter("publisher", publisher)
                    : handleAddFilter("publisher", publisher)
                }
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-between group ${
                  isFilterActive("publisher", publisher)
                    ? "bg-plum/20 text-plum border border-plum/30"
                    : "bg-midnight/20 text-ivory/80 hover:bg-midnight/40 hover:text-ivory"
                }`}>
                <span className="truncate">{publisher}</span>
                {isFilterActive("publisher", publisher) && (
                  <Check size={14} className="text-plum" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-ivory/10">
          <h3 className="text-sm font-semibold text-ivory/80 uppercase tracking-wider">
            Filtres actifs
          </h3>
          <div className="space-y-2">
            {activeFilters.map((filter, index) => (
              <div
                key={`${filter.type}-${filter.value}-${index}`}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs ${
                  filter.type === "genre"
                    ? "bg-moss/10 text-moss border border-moss/20"
                    : "bg-plum/10 text-plum border border-plum/20"
                }`}>
                <span className="truncate">
                  <span className="font-medium capitalize">{filter.type}:</span>{" "}
                  {filter.value}
                </span>
                <button
                  onClick={() => handleRemoveFilter(filter.type, filter.value)}
                  className="hover:bg-red-500/20 hover:text-red-400 p-1 rounded transition-colors">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {isSearchActive && (
        <div className="pt-4 border-t border-ivory/10">
          <div className="bg-midnight/30 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 text-ivory">
              Résultats de la recherche
            </h3>
            <p className="text-xs text-ivory/70">
              {filteredGames.length} jeu{filteredGames.length !== 1 ? "x" : ""}{" "}
              trouvé{filteredGames.length !== 1 ? "s" : ""}
              {searchQuery && ` pour "${searchQuery}"`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
