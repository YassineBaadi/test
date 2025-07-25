"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBudgetGames } from "@/lib/hooks/useBudgetGames";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/gameDetailsSlice";
import { selectCartItems } from "@/lib/features/cartSlice";
import { ShoppingCart, Eye, Tags, Check } from "lucide-react";
import GamePrice from "@/components/GamePrice";
import { useRouter } from "next/navigation";
import { isGamePurchased } from "@/lib/utils/gameUtils";

export default function BudgetGames() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { budgetGames, loading, error, loadBudgetGames } = useBudgetGames();
  const cartItems = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.auth);
  const [addingGameId, setAddingGameId] = useState(null);

  // Check if a game is in the cart
  const isInCart = (gameId) => {
    return cartItems.some((item) => item.id === gameId);
  };

  // Handle add to cart
  const handleAddToCart = async (e, game) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingGameId(game.id);
      await dispatch(addToCart({ game, userEmail: user.email })).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingGameId(null);
    }
  };

  // Render game cards
  const renderGameCards = () => {
    if (loading) {
      return Array(8)
        .fill(0)
        .map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-midnight/60 backdrop-blur-sm rounded-xl p-4 shadow-md animate-pulse h-[320px] border border-plum/10"
            aria-hidden="true">
            <div className="w-full h-40 bg-midnight rounded-lg mb-4"></div>
            <div className="h-6 bg-midnight rounded w-3/4 mb-4"></div>
            <div className="h-5 bg-midnight rounded w-1/4 mb-4"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-10 bg-midnight rounded w-1/2"></div>
              <div className="h-10 bg-midnight rounded w-1/2"></div>
            </div>
          </div>
        ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8 text-red-400">
          <p>Erreur lors du chargement des jeux. Veuillez réessayer.</p>
          <button
            onClick={() => loadBudgetGames()}
            className="mt-4 px-4 py-2 bg-plum text-ivory rounded-lg hover:bg-plum/80 transition-colors focus:outline-none focus:ring-2 focus:ring-rosy">
            Réessayer
          </button>
        </div>
      );
    }

    if (!budgetGames || budgetGames.length === 0) {
      return (
        <div className="col-span-full text-center py-8 text-ivory/70">
          <p>Aucun jeu trouvé.</p>
        </div>
      );
    }

    return budgetGames.map((game) => (
      <div
        key={game.id}
        className="bg-midnight/60 rounded-xl overflow-hidden shadow-lg border border-plum/20 sm:hover:shadow-rosy/20 sm:hover:border-rosy/40 "
        role="article">
        {/* Game thumbnail */}
        <Link
          href={`/games/${game.id}`}
          className="block relative h-40 w-full overflow-hidden">
          <Image
            src={game.thumbnail}
            alt={`${game.title} thumbnail`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 sm:group-hover:scale-110"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />

          {/* Special price tag */}
          <div className="absolute top-3 left-0 bg-pine/90 text-ivory px-3 py-1 rounded-r-full text-xs font-medium shadow-md flex items-center gap-1">
            <Tags size={12} />
            <span>Petit prix</span>
          </div>

          {/* Genre tag */}
          {game.genre && (
            <div className="absolute bottom-3 right-3 bg-plum/80 text-ivory px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
              {game.genre}
            </div>
          )}
        </Link>

        {/* Game info */}
        <div className="p-4">
          <Link href={`/games/${game.id}`}>
            <h3 className="font-bold text-lg text-ivory mb-2 line-clamp-1 sm:group-hover:text-rosy transition-colors">
              {game.title}
            </h3>
          </Link>

          {/* Price display */}
          <div className="mb-4">
            <GamePrice
              game={game}
              showDiscountBadge={true}
              className="text-ivory"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {isGamePurchased(game.id, user) ? (
              <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg">
                <Check size={18} />
                <span className="text-sm">Acheté</span>
              </div>
            ) : (
              <button
                onClick={(e) => handleAddToCart(e, game)}
                disabled={addingGameId === game.id || isInCart(game.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rosy ${
                  isInCart(game.id)
                    ? "bg-pine text-ivory cursor-default"
                    : "bg-rosy hover:bg-rosy/90 text-midnight font-medium animate-pulse-once"
                }`}
                aria-label={
                  isInCart(game.id)
                    ? "Déjà dans le panier"
                    : "Ajouter au panier"
                }>
                <ShoppingCart
                  size={18}
                  className={isInCart(game.id) ? "animate-pulse" : ""}
                />
                <span className="text-sm">
                  {isInCart(game.id) ? "Dans le panier" : "Ajouter"}
                </span>
              </button>
            )}

            <Link
              href={`/games/${game.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-midnight hover:bg-plum/80 text-ivory rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rosy"
              aria-label={`Voir les détails de ${game.title}`}>
              <Eye size={18} />
              <span className="text-sm">Détails</span>
            </Link>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-rosy/10 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    ));
  };

  return (
    <section className="py-12 bg-gradient-to-b from-midnight to-midnight/90 circuit-pattern">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tags size={18} className="text-pine" />
              <span className="text-sm uppercase tracking-wider text-pine">
                Économies
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rosy to-copper bg-clip-text text-transparent">
              Moins de 10€
            </h2>
            <p className="mt-2 text-ivory/60 text-sm max-w-md">
              Découvrez notre sélection de jeux à petits prix pour tous les
              goûts
            </p>
          </div>

          <div className="hidden md:block">
            <Link
              href="/games"
              className="text-rosy hover:text-ivory hover:underline transition-colors text-sm">
              Voir tous les jeux
            </Link>
          </div>
        </div>

        {/* Games grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 custom-scrollbar"
          role="region"
          aria-label="Jeux à moins de 10€">
          {renderGameCards()}
        </div>

        {/* Mobile view all button */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/games"
            className="px-4 py-2 bg-midnight text-rosy border border-rosy/30 rounded-lg hover:bg-rosy/10 transition-colors inline-block">
            Voir tous les jeux
          </Link>
        </div>
      </div>
    </section>
  );
}
