import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMostPlayedGames,
  setLoading,
  setError,
  clearError,
} from "@/lib/features/gameSlice";
import { apiService } from "@/lib/services/apiService";

// Hook to load the most played games (16 games)
export const useMostPlayedGames = () => {
  const dispatch = useDispatch();
  const { loading, mostPlayedGames, error } = useSelector(
    (state) => state.game
  );

  // Load the most played games (16 games)
  const loadMostPlayedGames = async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const games = await apiService.getPopularGames(16);
      dispatch(setMostPlayedGames(games));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Erreur lors du chargement des jeux populaires:", error);
      dispatch(setError(error.message));
      // Keep the loading active in case of error
    }
  };

  // Load the data on component mount
  useEffect(() => {
    if (mostPlayedGames.length === 0) {
      loadMostPlayedGames();
    }
  }, [dispatch]);

  return {
    mostPlayedGames,
    loading,
    error,
    loadMostPlayedGames,
  };
};
