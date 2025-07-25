"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameDetails } from "@/lib/features/gameDetailsSlice";
import GameTitle from "./GameTitle";
import GameImage from "./GameImage";
import VideoPlayer from "./VideoPlayer";
import GameDescription from "./GameDescription";
import PriceDisplay from "./PriceDisplay";
import AddToCartButton from "./AddToCartButton";

export default function GameDetailsPage({ gameId }) {
  const dispatch = useDispatch();
  const { currentGame, loading, error } = useSelector(
    (state) => state.gameDetails
  );

  useEffect(() => {
    // Only fetch game details initially
    dispatch(fetchGameDetails(gameId));
  }, [dispatch, gameId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight text-ivory flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-spin w-12 h-12 border-4 border-ivory/20 border-t-pine rounded-full mx-auto"></div>
          <p className="text-center mt-4 text-ivory/70">Chargement du jeu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-midnight text-ivory flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Erreur de chargement
            </h2>
            <p className="text-red-300 mb-4">{error}</p>
            <p className="text-red-300/80 text-sm">
              Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-midnight text-ivory flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-midnight/30 border border-ivory/10 rounded-lg p-6 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-ivory">
              Jeu introuvable
            </h2>
            <p className="text-ivory/70">
              Le jeu demandé n'existe pas ou a été supprimé.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight text-ivory pt-16 sm:pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Game Title */}
        <div className="mb-6 sm:mb-8">
          <GameTitle gameId={gameId} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Game Image */}
          <div className="order-1 lg:order-1">
            <GameImage gameId={gameId} />
          </div>

          {/* Video Player */}
          <div className="order-2 lg:order-2">
            <VideoPlayer gameId={gameId} />
          </div>
        </div>

        {/* Game Description */}
        <div className="mb-8 sm:mb-12">
          <GameDescription gameId={gameId} />
        </div>

        {/* Price and Add to Cart - Responsive Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-midnight/50 rounded-xl border border-ivory/10">
          <div className="w-full sm:w-auto">
            <PriceDisplay gameId={gameId} />
          </div>
          <div className="w-full sm:w-auto">
            <AddToCartButton gameId={gameId} />
          </div>
        </div>
      </div>
    </div>
  );
}
