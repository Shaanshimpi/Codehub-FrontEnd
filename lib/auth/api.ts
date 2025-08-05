import { User } from "./types";

/**
 * API endpoints for authentication
 */
export const AUTH_ENDPOINTS = {
  ME: "/api/payload/me",
  LOGIN: "/api/payload/login",
  LOGOUT: "/api/payload/logout",
  SIGNUP: "/api/payload/signup",
} as const;

/**
 * Fetch current user from API
 */
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.ME);
    if (response.ok) {
      const userData = await response.json();
      return userData.user;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
};

/**
 * Login user
 */
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Login failed");
  }

  const data = await response.json();
  return data.user;
};

/**
 * Signup user
 */
export const signupUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const response = await fetch(AUTH_ENDPOINTS.SIGNUP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Signup failed");
  }

  const data = await response.json();
  return data.user;
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
};
