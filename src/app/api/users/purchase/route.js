import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

export async function POST(request) {
  try {
    const { userId } = await request.json();
    const users = storageService.loadUsers();
    const cartItems = storageService.loadCart();

    // Find user index
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get current cart items
    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Add items to user's purchased games if not already owned
    const currentPurchasedGames = users[userIndex].purchasedGames || [];
    const newPurchases = cartItems.filter(
      (item) => !currentPurchasedGames.some((game) => game.id === item.id)
    );

    // Update user's purchased games
    users[userIndex].purchasedGames = [
      ...currentPurchasedGames,
      ...newPurchases,
    ];

    // Save users to storage
    storageService.saveUsers(users);

    // Clear cart
    storageService.saveCart([]);

    // Return updated user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in purchase route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
