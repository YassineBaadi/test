import { NextResponse } from "next/server";

// Route to handle API requests
export async function GET(request) {
  // Get the search parameters from the request
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const category = searchParams.get("category");
    const id = searchParams.get("id");

    // Build the URL based on the search parameters
    let url = "https://www.freetogame.com/api/games";

    if (id) {
      url = `https://www.freetogame.com/api/game?id=${id}`;
    } else if (platform) {
      url += `?platform=${platform}`;
    } else if (category) {
      url += `?category=${category}`;
    }

    // Fetch the data from the API
    const response = await fetch(url);
    const data = await response.json();

    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur API route:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
