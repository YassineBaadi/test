"use client";

import { useState } from "react";
import { TrendingUp, ShoppingCart, Trash2, Check } from "lucide-react";
import { useMostPlayedGames } from "@/lib/hooks/useMostPlayedGames";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/lib/features/gameDetailsSlice";
import { selectCartItems } from "@/lib/features/cartSlice";
import Link from "next/link";
import { isGamePurchased } from "@/lib/utils/gameUtils";
import GamePrice from "@/components/GamePrice";

export default function PopularGames() {
  const [showAll, setShowAll] = useState(false);
  const { loading, mostPlayedGames, error } = useMostPlayedGames();
  const dispatch = useDispatch();
  const { addingToCart } = useSelector((state) => state.gameDetails);
  const cartItems = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.auth);
  const [addingGameId, setAddingGameId] = useState(null);
  const [removingGameId, setRemovingGameId] = useState(null);

  // Number of games per row based on screen size
  const gamesPerRow = 4;
  // Number of games to display initially
  const initialGamesCount = 2 * gamesPerRow;
  // Games to display
  const displayedGames = showAll
    ? mostPlayedGames
    : mostPlayedGames.slice(0, initialGamesCount);
  // Check if there are more games to display
  const hasMoreGames = mostPlayedGames.length > initialGamesCount;

  // Check if a game is in cart
  const isInCart = (gameId) => {
    return cartItems.some((item) => item.id === gameId);
  };

  // Handle add to cart
  const handleAddToCart = async (game, e) => {
    try {
      e.stopPropagation();
      setAddingGameId(game.id);
      await dispatch(addToCart({ game, userEmail: user.email })).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingGameId(null);
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = async (gameId, e) => {
    try {
      e.stopPropagation();
      setRemovingGameId(gameId);
      await dispatch(removeFromCart(gameId)).unwrap();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    } finally {
      setRemovingGameId(null);
    }
  };

  return (
    <section className="bg-gradient-to-b from-midnight to-midnight/90 circuit-pattern text-ivory py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header of the section */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="bg-rosy/10 p-2 sm:p-3 rounded-full">
            <TrendingUp className="text-rosy" size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ivory">
            Les plus joués du moment
          </h2>
        </div>

        {/* Grid of games */}
        {loading || error ? (
          // Loading skeleton with responsive grid
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-midnight/60 backdrop-blur-sm rounded-xl h-36 sm:h-40 md:h-48 animate-pulse border border-plum/10">
                <div className="w-full h-24 sm:h-28 md:h-32 bg-midnight/80 rounded-t-xl"></div>
                <div className="p-2 sm:p-3 md:p-4">
                  <div className="h-3 sm:h-4 bg-midnight/80 rounded mb-1 sm:mb-2"></div>
                  <div className="h-2 sm:h-3 bg-midnight/80 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              {displayedGames.map((game) => (
                <div
                  key={game.id}
                  className="relative bg-midnight/60 backdrop-blur-sm overflow-hidden rounded-xl border border-plum/20 hover:bg-slate-700 hover:scale-[1.03] transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-rosy/20 hover:border-rosy/40">
                  {/* Game image wrapper with consistent aspect ratio */}
                  <div className="relative w-full pt-[56.25%]">
                    {" "}
                    {/* 16:9 aspect ratio */}
                    <div className="absolute inset-0">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Video overlay - appears on hover (desktop only) */}
                      <div className="absolute inset-0 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                        <video
                          src={`https://www.freetogame.com//g/${game.id}/videoplayback.webm`}
                          className="w-full h-full object-cover rounded-lg"
                          autoPlay
                          muted
                          loop
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>

                      {/* Overlay with game information - only visible on hover (desktop only) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/50 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-3 sm:p-4 sm:flex">
                        <h3 className="font-bold text-sm sm:text-base md:text-lg text-ivory mb-1 sm:mb-2 truncate transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                          {game.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-ivory/70 mb-2 sm:mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 delay-75">
                          <span className="bg-plum/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium text-ivory truncate max-w-[60%]">
                            {game.genre}
                          </span>
                          <span className="text-ivory/70 text-xs truncate">
                            {game.platform}
                          </span>
                        </div>
                        <div className="mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 delay-50">
                          <GamePrice
                            game={game}
                            gameId={game.id}
                            size="small"
                            showDiscountBadge={true}
                            className="text-ivory"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 delay-100">
                          <Link href={`/games/${game.id}`} className="w-1/2">
                            <button className="w-full bg-rosy hover:bg-rosy/90 text-midnight font-bold py-1.5 sm:py-2 px-2 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:text-ivory shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                              <span>Découvrir</span>
                            </button>
                          </Link>

                          {/* Add to Cart Button */}
                          {isGamePurchased(game.id, user) ? (
                            <div className="w-1/2 bg-green-500 text-white font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                              <Check size={14} className="hidden sm:inline" />
                              Acheté
                            </div>
                          ) : !isInCart(game.id) ? (
                            <button
                              onClick={(e) => handleAddToCart(game, e)}
                              disabled={
                                addingToCart || addingGameId === game.id
                              }
                              className="w-1/2 bg-rosy hover:bg-rosy/90 text-midnight font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:text-ivory shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                              <ShoppingCart
                                size={14}
                                className="hidden sm:inline"
                              />
                              {addingGameId === game.id ? "..." : "Acheter"}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleRemoveFromCart(game.id, e)}
                              disabled={removingGameId === game.id}
                              className="w-1/2 bg-red-400 hover:bg-red-500 text-slate font-bold py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:text-ivory shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                              <Trash2 size={14} className="hidden sm:inline" />
                              {removingGameId === game.id ? "..." : "Retirer"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Action Buttons - Always visible on mobile */}
                  <div className="sm:hidden p-3 bg-midnight/80">
                    <h3 className="font-bold text-sm text-ivory mb-2 truncate">
                      {game.title}
                    </h3>
                    <div className="mb-3">
                      <GamePrice
                        game={game}
                        gameId={game.id}
                        size="small"
                        showDiscountBadge={true}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/games/${game.id}`} className="w-1/2">
                        <button className="w-full bg-rosy hover:bg-rosy/90 text-midnight font-bold py-2 px-2 rounded-lg transition-all duration-200 text-xs">
                          Découvrir
                        </button>
                      </Link>

                      {/* Add to Cart Button */}
                      {isGamePurchased(game.id, user) ? (
                        <div className="w-1/2 bg-green-500 text-white font-bold py-2 px-2 rounded-lg flex items-center justify-center text-xs">
                          Acheté
                        </div>
                      ) : !isInCart(game.id) ? (
                        <button
                          onClick={(e) => handleAddToCart(game, e)}
                          disabled={addingToCart || addingGameId === game.id}
                          className="w-1/2 bg-rosy hover:bg-rosy/90 text-midnight font-bold py-2 px-2 rounded-lg transition-all duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                          {addingGameId === game.id ? "..." : "Acheter"}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleRemoveFromCart(game.id, e)}
                          disabled={removingGameId === game.id}
                          className="w-1/2 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-2 rounded-lg transition-all duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                          {removingGameId === game.id ? "..." : "Retirer"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* "Show more" button */}
            {hasMoreGames && (
              <div className="text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={
                    showAll
                      ? "bg-rosy hover:bg-plum text-ivory font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 hover:scale-[1.03] hover:rounded-t-3xl cursor-pointer shadow-lg text-sm sm:text-base"
                      : "bg-rosy hover:bg-plum text-ivory font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 hover:scale-[1.03] hover:rounded-b-3xl cursor-pointer shadow-lg text-sm sm:text-base"
                  }>
                  {showAll
                    ? "Afficher moins"
                    : `Afficher plus (${
                        mostPlayedGames.length - initialGamesCount
                      })`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
