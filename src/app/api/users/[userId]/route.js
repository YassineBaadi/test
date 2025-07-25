import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

export async function GET(request, { params }) {
  try {
    const userId = params.userId;
    const users = storageService.loadUsers();

    // Find user by ID
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in get user route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const userId = params.userId;
    const updates = await request.json();
    const users = storageService.loadUsers();

    // Find user index
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check for email uniqueness if email is being updated
    if (updates.email) {
      const existingUser = users.find(
        (u) => u.email === updates.email && u.id !== userId
      );
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Cette adresse email est déjà utilisée" },
          { status: 400 }
        );
      }
    }

    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };

    // Save users to storage
    storageService.saveUsers(users);

    // Return updated user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in update user route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
