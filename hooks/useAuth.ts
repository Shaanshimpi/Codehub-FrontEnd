"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, AuthState } from "@/lib/auth/types";
import { fetchCurrentUser, logoutUser } from "@/lib/auth/api";
import { canAccessAdmin } from "@/lib/auth/permissions";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setAuthState("loading");

    try {
      const userData = await fetchCurrentUser();
      setUser(userData);
      setAuthState(userData ? "authenticated" : "unauthenticated");
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      setAuthState("unauthenticated");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setUser(null);
      setAuthState("unauthenticated");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout locally even if API call fails
      setUser(null);
      setAuthState("unauthenticated");
      router.push("/login");
    }
  }, [router]);

  const hasAdminAccess = useCallback(() => {
    return canAccessAdmin(user);
  }, [user]);

  const refetchUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    setUser,
    isLoading,
    authState,
    hasAdminAccess,
    logout,
    refetchUser,
  };
}
