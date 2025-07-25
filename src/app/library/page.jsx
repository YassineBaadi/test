"use client";

import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Download, Play } from "lucide-react";

export default function Library() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const { data: session } = useSession();
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingGames, setDownloadingGames] = useState(new Set());

  const purchasedGames = user.purchasedGames || [];

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGames(purchasedGames);
    } else {
      setFilteredGames(
        purchasedGames.filter((game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, purchasedGames]);

  // Function to handle fake download
  const handlePlayGame = async (game, e) => {
    e.preventDefault(); // Prevent navigation to game details
    e.stopPropagation();

    const gameId = game.id;

    // Add game to downloading set
    setDownloadingGames((prev) => new Set(prev).add(gameId));

    try {
      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create fake download
      const fileName = `${game.title.replace(/[^a-zA-Z0-9]/g, "")}.exe`;
      const fakeContent = `This is a fake executable file for ${
        game.title
      }.\n\nThis is just a demo - no actual game will be downloaded.\n\nGame ID: ${
        game.id
      }\nTitle: ${game.title}\nGenre: ${game.genre || "Unknown"}\nPlatform: ${
        game.platform || "PC"
      }`;

      // Create blob and download
      const blob = new Blob([fakeContent], {
        type: "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      // Remove game from downloading set
      setDownloadingGames((prev) => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    }
  };

  // Show loading state if data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center pt-16">
        <div className="animate-spin w-12 h-12 border-4 border-ivory/20 border-t-pine rounded-full"></div>
        <p className="mt-4 text-xl text-neutral-300">
          Chargement de la bibliothèque...
        </p>
      </div>
    );
  }

  return (
    <ProtectedRoute redirectTo="/library">
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
            Votre Bibliothèque de Jeux
          </h1>

          {/* Search and filters */}
          <div className="mb-6 sm:mb-8">
            <input
              type="text"
              placeholder="Rechercher dans vos jeux..."
              className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pine text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Game library grid */}
          {purchasedGames.length === 0 ? (
            <div className="bg-neutral-800 p-6 sm:p-8 rounded-lg text-center">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
                Votre bibliothèque est vide
              </h2>
              <p className="text-neutral-400 mb-4 text-sm sm:text-base">
                Vous n'avez pas encore acheté de jeux.
              </p>
              <Link
                href="/games"
                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-pine text-white rounded-md hover:bg-pine/90 transition text-sm sm:text-base">
                Parcourir les jeux
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredGames.map((game) => {
                const isDownloading = downloadingGames.has(game.id);

                return (
                  <div
                    key={game.id}
                    className="game-card bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1">
                    <Link href={`/games/${game.id}`} className="block">
                      <div className="relative h-40 sm:h-48 w-full">
                        <img
                          src={
                            game.thumbnail ||
                            "https://via.placeholder.com/300x180?text=Game+Image"
                          }
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h2 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2">
                          {game.title}
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm bg-pine/90 text-white px-2 py-1 rounded">
                            Acheté
                          </span>
                          <button
                            onClick={(e) => handlePlayGame(game, e)}
                            disabled={isDownloading}
                            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm transition-colors ${
                              isDownloading
                                ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                                : "bg-neutral-700 hover:bg-neutral-600 text-white"
                            }`}>
                            {isDownloading ? (
                              <>
                                <Download className="w-3 h-3 animate-spin" />
                                <span>Téléchargement...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" />
                                <span>Jouer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* No search results */}
          {purchasedGames.length > 0 &&
            filteredGames.length === 0 &&
            searchTerm && (
              <div className="bg-neutral-800 p-6 sm:p-8 rounded-lg text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
                  Aucun jeu trouvé
                </h2>
                <p className="text-neutral-400 mb-4 text-sm sm:text-base">
                  Aucun jeu ne correspond à votre recherche "{searchTerm}".
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition text-sm sm:text-base">
                  Effacer la recherche
                </button>
              </div>
            )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
