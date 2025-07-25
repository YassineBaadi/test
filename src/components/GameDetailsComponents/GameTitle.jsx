"use client";

import { useSelector } from "react-redux";

export default function GameTitle({ gameId, className = "" }) {
  const currentGame = useSelector((state) => state.gameDetails.currentGame);
  return (
    <h1 className={`text-4xl font-bold mb-4 ${className}`}>
      {currentGame?.title || "Game Title"}
    </h1>
  );
}
