import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

// Load cart data from storage
let cartItems = storageService.loadCart();

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json(
        { success: false, message: "Game ID is required" },
        { status: 400 }
      );
    }

    // Filter out the item with the matching ID
    const index = cartItems.findIndex((item) => item.id === parseInt(gameId));
    if (index !== -1) {
      cartItems.splice(index, 1);
      // Save cart to storage after removal
      storageService.saveCart(cartItems);
    }

    // Return success response with updated cart
    return NextResponse.json({
      success: true,
      cart: cartItems,
    });
  } catch (error) {
    console.error("Error in cart remove route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
