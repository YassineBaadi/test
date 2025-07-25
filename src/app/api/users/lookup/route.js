import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

export async function GET(request) {
  try {
    // Get email from query params
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const users = storageService.loadUsers();

    if (!email) {
      console.error("Lookup error: No email provided");
      return NextResponse.json(
        { success: false, message: "Email parameter is required" },
        { status: 400 }
      );
    }

    console.log("Looking up user with email:", email);

    // Find user by email (case insensitive) and provider
    // First try to find a Google OAuth user
    let user = users.find(
      (user) =>
        user.email &&
        user.email.toLowerCase() === email.toLowerCase() &&
        user.oauthProvider === "google"
    );

    // If not found, try to find any user with this email
    if (!user) {
      user = users.find(
        (user) => user.email && user.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!user) {
      console.error("Lookup error: No user found with email:", email);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    console.log("Found user:", { id: user.id, email: user.email });

    // Return user data without password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in user lookup route:", error);
    return NextResponse.json(
      { success: false, message: "Failed to look up user" },
      { status: 500 }
    );
  }
}
