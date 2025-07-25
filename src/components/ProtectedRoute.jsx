"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal";

export default function ProtectedRoute({ children, redirectTo }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { data: session, status } = useSession();

  // Check if user is authenticated with either Redux or NextAuth
  const isAuthenticated = user.isConnected || !!session;
  const isLoading = status === "loading";

  useEffect(() => {
    // Show auth modal if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [isAuthenticated, isLoading]);

  // Handlers for the AuthModal
  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If loading, show a minimal loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="animate-spin w-12 h-12 border-4 border-ivory/20 border-t-pine rounded-full"></div>
      </div>
    );
  }

  // If not authenticated and not loading, render a minimal container with the auth modal
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Blurred background content */}
      <div className="filter blur-md pointer-events-none">{children}</div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseModal}
        redirectPath={redirectTo}
      />
    </div>
  );
}
