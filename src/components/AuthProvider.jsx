"use client";

import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { syncOAuthUser } from "@/lib/features/authSlice";

/**
 * AuthProvider component that handles OAuth synchronization
 * This component should be placed high in the component tree
 * to ensure OAuth sync happens only once globally
 */
export default function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { user, oauthSyncAttempted, isLoading } = useSelector(
    (state) => state.auth
  );
  const syncAttemptedRef = useRef(false);

  // Centralized OAuth sync logic - runs once globally
  useEffect(() => {
    // Skip if already attempted during this component lifecycle
    if (syncAttemptedRef.current) {
      return;
    }

    // Skip if loading, not ready yet, or no session
    if (isLoading || status === "loading" || !session?.user) {
      return;
    }

    // Skip if already authenticated in Redux or OAuth sync already attempted globally
    if (user.isConnected || oauthSyncAttempted) {
      return;
    }

    // Mark as attempted for this component instance
    syncAttemptedRef.current = true;

    console.log("AuthProvider initiating OAuth sync for:", session.user.email);

    // Add provider info to session user and dispatch
    const userWithProvider = {
      ...session.user,
      provider: determineProvider(session.user),
    };

    dispatch(syncOAuthUser(userWithProvider));
  }, [
    dispatch,
    session,
    user.isConnected,
    oauthSyncAttempted,
    status,
    isLoading,
  ]);

  // Helper to determine provider from email
  function determineProvider(user) {
    if (user.provider) return user.provider;
    if (!user.email) return "oauth";

    if (user.email.includes("google") || user.picture) return "google";
    return "oauth";
  }

  // Simply render children
  return children;
}
