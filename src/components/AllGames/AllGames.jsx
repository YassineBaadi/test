"use client";

import { useAllGames } from "@/lib/hooks/useAllGames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/lib/features/gameDetailsSlice";
import { selectCartItems } from "@/lib/features/cartSlice";
import { ShoppingCart, Trash2, User, Check } from "lucide-react";
import Link from "next/link";
import GamePrice from "@/components/GamePrice";
import { isGamePurchased } from "@/lib/utils/gameUtils";

export default function AllGames() {
  const [displayCount, setDisplayCount] = useState(12);
  const { loading, error, randomPriceOfAllGames } = useAllGames();
  const dispatch = useDispatch();
  const { addingToCart } = useSelector((state) => state.gameDetails);
  const cartItems = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.auth);
  const { isSearchActive, filteredGames } = useSelector(
    (state) => state.search
  );
  const [addingGameId, setAddingGameId] = useState(null);
  const [removingGameId, setRemovingGameId] = useState(null);
  const [imageLoadStates, setImageLoadStates] = useState({});

  const initialGamesCount = 12;
  const batchSize = 12;

  // Use filtered games when search is active, otherwise use all games
  const gamesToDisplay = isSearchActive
    ? filteredGames?.slice(0, displayCount)
    : randomPriceOfAllGames?.slice(0, displayCount) || [];

  // Check if a game is in the cart
  const isInCart = (gameId) => {
    return cartItems.some((item) => item.id === gameId);
  };

  // Handle image loading states
  const handleImageLoad = (gameId) => {
    setImageLoadStates((prev) => ({ ...prev, [gameId]: "loaded" }));
  };

  const handleImageError = (gameId) => {
    setImageLoadStates((prev) => ({ ...prev, [gameId]: "error" }));
  };

  // Handle adding item to cart
  const handleAddToCart = async (game, e) => {
    if (e) {
      e.preventDefault(); // Prevent link navigation
    }

    try {
      setAddingGameId(game.id);
      // Use game as is (prices are now consistently handled)
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
      e.preventDefault();
      setRemovingGameId(gameId);
      await dispatch(removeFromCart(gameId)).unwrap();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    } finally {
      setRemovingGameId(null);
    }
  };

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + batchSize);
  };

  const handleShowLess = () => {
    setDisplayCount(initialGamesCount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex flex-col items-center space-y-8">
          <div className="h-10 w-80 bg-midnight/50 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-midnight/30 rounded-2xl h-96 w-full animate-pulse">
                <div className="h-48 bg-midnight/50 rounded-t-2xl"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-midnight/50 rounded w-3/4"></div>
                  <div className="h-3 bg-midnight/50 rounded w-1/2"></div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-6 bg-midnight/50 rounded w-16"></div>
                    <div className="h-8 bg-midnight/50 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 font-medium">
            Erreur lors du chargement des jeux
          </p>
          <p className="text-red-300/80 text-sm mt-2">
            Veuillez réessayer plus tard
          </p>
        </div>
      </div>
    );
  }

  if (gamesToDisplay.length === 0 && isSearchActive) {
    return (
      <div className="text-center py-12">
        <div className="bg-midnight/30 border border-ivory/10 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-ivory/70 text-lg mb-2">Aucun jeu trouvé</p>
          <p className="text-ivory/50 text-sm">
            Essayez avec d'autres termes de recherche
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isSearchActive && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-ivory border-b border-ivory/20 pb-4">
            Résultats de la recherche
            <span className="text-lg font-normal text-ivory/60 ml-3">
              ({filteredGames.length} jeu{filteredGames.length !== 1 ? "x" : ""}
              )
            </span>
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {gamesToDisplay.map((game) => {
          const imageState = imageLoadStates[game.id] || "loading";

          return (
            <Link href={`/games/${game.id}`} key={game.id} className="group">
              <article className="bg-midnight/60 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 sm:hover:shadow-2xl sm:hover:shadow-rosy/20 border border-ivory/10 sm:hover:border-rosy/40 flex flex-col h-full sm:hover-lift">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  {imageState === "loading" && (
                    <div className="absolute inset-0 bg-midnight/50 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-rosy/30 border-t-rosy rounded-full animate-spin"></div>
                    </div>
                  )}

                  <img
                    src={game.thumbnail}
                    alt={`${game.title} - ${game.genre} game cover`}
                    onLoad={() => handleImageLoad(game.id)}
                    onError={() => handleImageError(game.id)}
                    className={`w-full aspect-video object-cover object-center sm:group-hover:scale-110 transition-transform duration-500 ${
                      imageState === "loaded" ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent"></div>

                  {/* Cart Status Indicator */}
                  {isInCart(game.id) && (
                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-pine/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-pine/30">
                      <div className="flex items-center gap-1">
                        <ShoppingCart
                          size={10}
                          className="text-white sm:w-3 sm:h-3"
                        />
                        <span className="text-white text-xs font-medium">
                          Dans le panier
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Purchased Status Indicator */}
                  {isGamePurchased(game.id, user) && (
                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-green-500/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-green-500/30">
                      <div className="flex items-center gap-1">
                        <Check size={10} className="text-white sm:w-3 sm:h-3" />
                        <span className="text-white text-xs font-medium">
                          Acheté
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 lg:p-6 flex-grow flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-lg sm:text-xl text-ivory sm:group-hover:text-rosy transition-colors duration-300 line-clamp-2 mb-2 sm:mb-3">
                    {game.title}
                  </h3>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      <User
                        size={12}
                        className="text-ivory/60 sm:w-3.5 sm:h-3.5"
                      />
                      <span className="text-ivory/60 text-xs sm:text-sm">
                        {game.publisher || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Genre Tag */}
                  <div className="mb-4 sm:mb-6">
                    <span className="inline-block bg-plum/20 text-plum px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-plum/30">
                      {game.genre}
                    </span>
                  </div>

                  {/* Price and Action */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mt-auto pt-3 sm:pt-4 border-t border-ivory/10 text-ivory">
                    <div className="flex flex-col">
                      <GamePrice
                        game={game}
                        gameId={game.id}
                        size="default"
                        showDiscountBadge={true}
                      />
                      <span className="text-ivory/60 text-xs sm:text-sm">
                        Prix TTC
                      </span>
                    </div>

                    {isGamePurchased(game.id, user) ? (
                      <div className="w-full sm:w-auto bg-green-500/90 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 min-w-[100px] sm:min-w-[120px]">
                        <Check size={14} className="sm:w-4 sm:h-4" />
                        <span className="font-medium text-sm sm:text-base">
                          Acheté
                        </span>
                      </div>
                    ) : isInCart(game.id) ? (
                      <button
                        onClick={(e) => handleRemoveFromCart(game.id, e)}
                        disabled={removingGameId === game.id}
                        className="w-full sm:w-auto bg-red-500/90 hover:bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-red-500/25 min-w-[100px] sm:min-w-[120px]">
                        {removingGameId === game.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                            <span className="font-medium text-sm sm:text-base">
                              Retirer
                            </span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(game, e)}
                        disabled={addingToCart || addingGameId === game.id}
                        className="w-full sm:w-auto bg-pine hover:bg-moss text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-pine/25 min-w-[100px] sm:min-w-[120px]">
                        {addingGameId === game.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                            <span className="font-medium text-sm sm:text-base">
                              Ajouter
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-12 flex justify-center gap-4">
        {(isSearchActive ? filteredGames : randomPriceOfAllGames)?.length >
          displayCount && (
          <button
            onClick={handleShowMore}
            className="bg-rosy hover:bg-plum text-ivory px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-rosy/25 hover-lift">
            <span className="font-medium">Voir Plus</span>
          </button>
        )}

        {displayCount > initialGamesCount && (
          <button
            onClick={handleShowLess}
            className="bg-midnight/80 hover:bg-midnight text-ivory border border-ivory/20 hover:border-ivory/40 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover-lift">
            <span className="font-medium">Voir Moins</span>
          </button>
        )}
      </div>
    </div>
  );
}
