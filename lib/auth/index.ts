// Re-export all auth-related modules for clean imports
export * from "./types";
export * from "./permissions";
export * from "./api";

// Default exports
export { default as AuthGuard } from "@/components/auth/AuthGuard";
export { default as UserProfile } from "@/components/auth/UserProfile";
export { default as LoadingSpinner } from "@/components/auth/LoadingSpinner";
