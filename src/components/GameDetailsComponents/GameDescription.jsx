"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

export default function GameDescription({ gameId, className = "" }) {
  const currentGame = useSelector((state) => state.gameDetails.currentGame);
  const [showMore, setShowMore] = useState(false);
  const description = currentGame?.description || "";
  const shortDesc =
    description.length > 200 ? description.slice(0, 200) + "..." : description;

  return (
    <div className={`mt-6 ${className}`}>
      <h2 className="text-2xl font-semibold mb-2">Description</h2>
      <p className="text-ivory/75">{showMore ? description : shortDesc}</p>
      {description.length > 200 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-moss hover:text-pine mt-2">
          {showMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
