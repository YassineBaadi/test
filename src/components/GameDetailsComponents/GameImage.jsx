"use client";

import { useSelector } from "react-redux";

export default function GameImage({ gameId, className = "" }) {
  const currentGame = useSelector((state) => state.gameDetails.currentGame);
  return (
    <img
      src={currentGame?.thumbnail || ""}
      alt={currentGame?.title}
      className={`w-full h-auto rounded-lg shadow-xl object-cover ${className}`}
    />
  );
}
