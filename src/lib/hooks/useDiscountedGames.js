import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, clearError } from "../features/gameSlice";
import { setDiscountedGames } from "../features/gameSlice";
import { apiService } from "../services/apiService";
import { useEffect } from "react";

// Hook to load the discounted games (6 games)
export const useDiscountedGames = () => {
  const dispatch = useDispatch();
  const { discountedGames, loading, error } = useSelector(
    (state) => state.game
  );

  // Load the discounted games (6 games)
  const loadDiscountedGames = async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const games = await apiService.getDiscountedGames(6);
      dispatch(setDiscountedGames(games));
      dispatch(setLoading(false));
    } catch (error) {
      console.log(`Erreur lors de chargement des jeux en promotion: ${error}`);
      dispatch(setError(error.message));
      // Keep the loading active in case of error
    }
  };

  // Load the data on component mount
  useEffect(() => {
    if (discountedGames.length === 0) {
      loadDiscountedGames();
    }
  }, [dispatch]);

  return { discountedGames, loading, error, loadDiscountedGames };
};
