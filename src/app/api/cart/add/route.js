import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

// Load cart data from storage
let cartItems = storageService.loadCart();

export async function POST(request) {
  try {
    const { game, userEmail } = await request.json();

    // Check if user is provided and if the game is already purchased
    if (userEmail) {
      const users = storageService.loadUsers();
      const user = users.find(u => u.email === userEmail);
      
      if (user && user.purchasedGames && user.purchasedGames.some(purchasedGame => purchasedGame.id === game.id)) {
        return NextResponse.json(
          { success: false, message: "This game is already purchased" },
          { status: 400 }
        );
      }
    }

    // Find existing item in cart
    const existingIndex = cartItems.findIndex((item) => item.id === game.id);

    if (existingIndex >= 0) {
      // Do nothing, you can't add more than one quantity of the same game to the cart
      console.log("You already have this game in your cart");
    } else {
      // Determine the price to use for calculations (discounted price if available, otherwise regular price)
      const priceToUse =
        game.hasDiscount && game.discountedPrice
          ? game.discountedPrice
          : game.price;

      // Add new item to cart with the correct price structure
      cartItems.push({
        ...game,
        // Keep the original price in the price field for display purposes
        price: game.price, // Original price (for crossed-out display)
        // Add a separate field for the actual price to pay
        priceToPay: priceToUse, // Price after discount (for calculations)
        quantity: 1,
      });
      console.log(
        "Game added to cart with original price:",
        game.price,
        "and price to pay:",
        priceToUse
      );
    }

    // Save cart to storage
    storageService.saveCart(cartItems);

    // Return success response with updated cart
    return NextResponse.json({
      success: true,
      cart: cartItems,
    });
  } catch (error) {
    console.error("Error in cart add route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
