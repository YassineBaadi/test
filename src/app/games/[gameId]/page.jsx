import GameDetailsPage from "@/components/GameDetailsComponents/GameDetailsPage";

export default async function GameId({ params }) {
  const { gameId } = await params;

  return <GameDetailsPage gameId={gameId} />;
}
