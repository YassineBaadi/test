"use client";

import { useSelector } from "react-redux";
import GamePrice from "@/components/GamePrice";

export default function PriceDisplay({ gameId, className = "" }) {
  const currentGame = useSelector((state) => state.gameDetails.currentGame);

  return (
    <GamePrice
      game={currentGame}
      gameId={gameId}
      className={className}
      size="large"
    />
  );
}
