import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  setAllGames,
  setError,
  setLoading,
  setRandomPriceOfAllGames,
} from "../features/gameSlice";
import { apiService } from "../services/apiService";
import { useEffect } from "react";

export const useAllGames = () => {
  const dispatch = useDispatch();
  const { loading, allGames, error, randomPriceOfAllGames } = useSelector(
    (state) => state.game
  );

  const loadAllGames = async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const games = await apiService.getAllGames();
      dispatch(setAllGames(games));

      const randomPrice = await apiService.getRandomPriceOfAllGames();
      dispatch(setRandomPriceOfAllGames(randomPrice));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(`Erreur lors du chargement de tous les jeux: ${error}`);
      dispatch(setError(error.message));
    }
  };

  useEffect(() => {
    if (allGames.length === 0) {
      loadAllGames();
    }
  }, [dispatch]);

  return {
    allGames,
    loading,
    error,
    loadAllGames,
    randomPriceOfAllGames,
  };
};
