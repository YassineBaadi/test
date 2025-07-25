import { NextResponse } from "next/server";
import { storageService } from "@/lib/services/storageService";

export async function GET() {
  try {
    const cartItems = storageService.loadCart();
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error in cart get route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
