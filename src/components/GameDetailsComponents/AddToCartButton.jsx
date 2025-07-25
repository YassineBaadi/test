"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addAction,
  removeFromCart as removeAction,
} from "@/lib/features/gameDetailsSlice";
import { selectCartItems } from "@/lib/features/cartSlice";
import { isGamePurchased } from "@/lib/utils/gameUtils";

export default function AddToCartButton({ gameId, className = "" }) {
  const dispatch = useDispatch();
  const { currentGame, addingToCart, hasAlreadyBoughtGame, error } =
    useSelector((state) => state.gameDetails);
  const cartItems = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if game is already owned using the utility function
  const isOwned = isGamePurchased(gameId, user);

  const handleClick = async () => {
    try {
      setShowError(false);
      setIsLoading(true);

      if (hasAlreadyBoughtGame) {
        await dispatch(removeAction(currentGame.id)).unwrap();
      } else {
        await dispatch(
          addAction({ game: currentGame, userEmail: user.email })
        ).unwrap();
      }
    } catch (error) {
      console.error("Cart operation failed:", error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentGame) return null;

  // If game is owned, show Owned badge instead of button
  if (isOwned) {
    return (
      <div
        className={`${className} inline-flex items-center justify-center px-4 py-2 bg-pine text-white rounded-md`}>
        Acheté
      </div>
    );
  }

  const inCart = cartItems.some((item) => item.id === currentGame.id);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isOwned}
      className={`${className} ${
        inCart ? "bg-red-500 hover:bg-red-600" : "bg-pine hover:bg-pine/90"
      } text-white px-4 py-2 rounded-md transition-colors ${
        isLoading ? "opacity-75 cursor-not-allowed" : ""
      }`}>
      {isLoading
        ? "Loading..."
        : inCart
        ? "Retirer du panier"
        : "Ajouter au panier"}
    </button>
  );
}
