import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const users = storageService.loadUsers();

    // Find user with matching email and password
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Update user connected status
      const userIndex = users.findIndex((u) => u.email === email);
      users[userIndex].isConnected = true;
      storageService.saveUsers(users);

      // Return user data (excluding password)
      const { password, ...userWithoutPassword } = users[userIndex];
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in user auth route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
