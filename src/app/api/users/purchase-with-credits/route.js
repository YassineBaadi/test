import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

export async function POST(request) {
  try {
    const { userId, total } = await request.json();

    if (!userId || !total) {
      return NextResponse.json(
        { success: false, message: "User ID and total are required" },
        { status: 400 }
      );
    }

    const users = storageService.loadUsers();
    const cartItems = storageService.loadCart();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = users[userIndex];
    const currentBalance = user.creditBalance || 0;

    // Check if user has sufficient credits
    if (currentBalance < total) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient credit balance",
          currentBalance,
          required: total,
        },
        { status: 400 }
      );
    }

    // Check if cart is empty
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

    // Deduct credits and add games to purchased list
    users[userIndex].creditBalance = currentBalance - parseFloat(total);
    users[userIndex].purchasedGames = [
      ...currentPurchasedGames,
      ...newPurchases,
    ];

    storageService.saveUsers(users);
    storageService.saveCart([]);

    return NextResponse.json({
      success: true,
      message: "Purchase completed successfully with credits",
      user: users[userIndex],
    });
  } catch (error) {
    console.error("Error processing credit purchase:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
