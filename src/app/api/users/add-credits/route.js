import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

export async function POST(request) {
  try {
    const { userId, amount } = await request.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, message: "User ID and amount are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const users = storageService.loadUsers();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Add credits to user's balance
    const currentBalance = users[userIndex].creditBalance || 0;
    users[userIndex].creditBalance = currentBalance + parseFloat(amount);

    storageService.saveUsers(users);

    return NextResponse.json({
      success: true,
      message: "Credits added successfully",
      user: users[userIndex],
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
