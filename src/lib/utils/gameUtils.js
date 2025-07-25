// Utility function to check if a game is purchased by the current user
export const isGamePurchased = (gameId, user) => {
  if (!user || !user.purchasedGames || !Array.isArray(user.purchasedGames)) {
    return false;
  }

  return user.purchasedGames.some((game) => game.id === gameId);
};

// Utility function to get purchased games count
export const getPurchasedGamesCount = (user) => {
  if (!user || !user.purchasedGames || !Array.isArray(user.purchasedGames)) {
    return 0;
  }

  return user.purchasedGames.length;
};
