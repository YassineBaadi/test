import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/checkout", "/library"];

export async function middleware(request) {
  // Get the pathname from the request
  const path = request.nextUrl.pathname;

  // Check if the route is protected
  if (protectedRoutes.includes(path)) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If not authenticated with NextAuth, we'll let the client-side handle the check
    // for Redux authentication or show the login form within the page
    if (!session) {
      // Instead of redirecting here, we'll continue and let the page
      // component handle showing the login form if needed
      console.log("No NextAuth session found for protected route:", path);
      // We no longer redirect here
    }
  }

  return NextResponse.next();
}

// Configure the routes that trigger this middleware
export const config = {
  matcher: ["/profile", "/checkout", "/library"],
};
