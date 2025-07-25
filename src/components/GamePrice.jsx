"use client";

import { useSelector } from "react-redux";
import { generatePrice } from "@/lib/features/gameSlice";

export default function GamePrice({
  gameId,
  game,
  className = "",
  showDiscountBadge = true,
  size = "default",
}) {
  // If a game object is provided, use its price data
  // Otherwise, generate price from gameId
  let priceData = game
    ? {
        price: game.price,
        discount: game.discount,
        discountedPrice: game.discountedPrice,
      }
    : null;

  // If no price data is available and we have gameId, generate it
  if (!priceData && gameId) {
    priceData = generatePrice(gameId);
  }

  // If we still don't have price data, we can't display anything
  if (!priceData) {
    return null;
  }

  const { price, discount, discountedPrice } = priceData;

  const sizeClasses = {
    small: "text-sm",
    default: "text-lg",
    large: "text-2xl",
  };

  const textSize = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={`font-bold ${className} ${textSize}`}>
      {discount > 0 ? (
        <>
          <span className="line-through text-ivory/50 mr-2">{price}€</span>
          <span className="text-green-500">{discountedPrice}€</span>
          {showDiscountBadge && (
            <span className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </>
      ) : (
        <span>{price}€</span>
      )}
    </div>
  );
}
