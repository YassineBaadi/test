import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

export async function GET() {
  try {
    const users = storageService.loadUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in users get route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
