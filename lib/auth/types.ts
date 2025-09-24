// User role types
export type UserRole = "user" | "gold" | "editor" | "admin";

// User interface matching the server-side Users collection
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication context type
export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
  hasAdminAccess: () => boolean;
  logout: () => Promise<void>;
}

// Auth states
export type AuthState =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "unauthorized";
