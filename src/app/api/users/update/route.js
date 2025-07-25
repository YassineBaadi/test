import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

// Load users data from storage
let users = storageService.loadUsers();

// Initialize with default admin user if no users exist
if (users.length === 0) {
  users = [
    {
      id: "1",
      name: "admin",
      email: "a@a.a",
      password: "123",
      description: "Administrator account",
      purchasedGames: [],
      isConnected: false,
      creditBalance: 0,
    },
  ];
  storageService.saveUsers(users);
}

export async function POST(request) {
  try {
    const userData = await request.json();
    const { email } = userData;

    // Check if user exists
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex >= 0) {
      // Update existing user
      users[userIndex] = { ...users[userIndex], ...userData };
      console.log("User updated:", users[userIndex]);
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        purchasedGames: [],
        creditBalance: 0, // Initialize with 0 credits
      };
      users.push(newUser);
      console.log("New user added:", newUser);
    }

    // Save users to storage
    storageService.saveUsers(users);

    // Return success response with updated user
    return NextResponse.json({
      success: true,
      user: userIndex >= 0 ? users[userIndex] : users[users.length - 1],
    });
  } catch (error) {
    console.error("Error in users update route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
