"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ProfileOrders() {
  const { user } = useSelector((state) => state.auth);
  const { data: session } = useSession();

  const purchasedGames = user.purchasedGames || [];

  if (!user.isConnected && !session) {
    return null;
  }

  if (purchasedGames.length === 0) {
    return (
      <section className="profile-orders-section bg-neutral-900 rounded-lg p-6 shadow-inner">
        <h3 className="profile-orders-title text-lg font-semibold mb-3 text-neutral-100">
          Jeux achetés
        </h3>
        <div className="text-neutral-400 p-4 bg-neutral-800 rounded">
          Vous n'avez pas encore acheté de jeux.
        </div>
      </section>
    );
  }

  return (
    <section className="profile-orders-section bg-neutral-900 rounded-lg p-6 shadow-inner">
      <h3 className="profile-orders-title text-lg font-semibold mb-4 text-neutral-100">
        Jeux achetés
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {purchasedGames.map((game) => (
          <Link
            href={`/games/${game.id}`}
            key={game.id}
            className="game-card bg-neutral-800 rounded overflow-hidden shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px]">
            <div className="relative h-40 w-full">
              <img
                src={
                  game.thumbnail ||
                  "https://via.placeholder.com/300x180?text=Game+Image"
                }
                alt={game.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h4 className="font-medium text-white">{game.title}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-neutral-400">Acheté</span>
                <span className="text-sm font-medium text-pine">
                  {game.price} €
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
