import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, clearError } from "../features/gameSlice";
import { setBudgetGames } from "../features/gameSlice";
import { apiService } from "../services/apiService";
import { useEffect } from "react";

// Hook to load games under 10€
export const useBudgetGames = () => {
  const dispatch = useDispatch();
  const { budgetGames, loading, error } = useSelector((state) => state.game);

  // Load games under 10€
  const loadBudgetGames = async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const allGames = await apiService.getAllGames();

      // Filter for games under 10€
      const games = allGames
        .filter((game) => {
          // If has discount, check discounted price, otherwise check regular price
          const priceToCheck = game.hasDiscount
            ? game.discountedPrice
            : game.price;
          return priceToCheck < 10;
        })
        .slice(0, 37); // Limit to 12 games initially

      dispatch(setBudgetGames(games));
      dispatch(setLoading(false));
    } catch (error) {
      console.log(`Erreur lors du chargement des jeux à petit prix: ${error}`);
      dispatch(setError(error.message));
      // Keep the loading active in case of error
    }
  };

  // Load the data on component mount
  useEffect(() => {
    if (!budgetGames || budgetGames.length === 0) {
      loadBudgetGames();
    }
  }, [dispatch]);

  return { budgetGames, loading, error, loadBudgetGames };
};
