import { User, UserRole } from "./types";

// Role permission configuration
export const PERMISSIONS = {
  user: {
    canAccessAdmin: false,
    canEditExercises: false,
    canDeleteExercises: false,
    canManageUsers: false,
    canViewAnalytics: false,
  },
  editor: {
    canAccessAdmin: true,
    canEditExercises: true,
    canDeleteExercises: true,
    canManageUsers: false,
    canViewAnalytics: true,
  },
  admin: {
    canAccessAdmin: true,
    canEditExercises: true,
    canDeleteExercises: true,
    canManageUsers: true,
    canViewAnalytics: true,
  },
} as const;

export type Permission = keyof typeof PERMISSIONS.admin;

/**
 * Check if a user role has a specific permission
 */
export const hasPermission = (
  role: UserRole,
  permission: Permission,
): boolean => {
  return PERMISSIONS[role][permission];
};

/**
 * Check if user can access admin panel
 */
export const canAccessAdmin = (user: User | null): boolean => {
  if (!user?.isActive) return false;
  return hasPermission(user.role, "canAccessAdmin");
};

/**
 * Check if user can edit exercises
 */
export const canEditExercises = (user: User | null): boolean => {
  if (!user?.isActive) return false;
  return hasPermission(user.role, "canEditExercises");
};

/**
 * Check if user can delete exercises
 */
export const canDeleteExercises = (user: User | null): boolean => {
  if (!user?.isActive) return false;
  return hasPermission(user.role, "canDeleteExercises");
};

/**
 * Check if user can manage other users
 */
export const canManageUsers = (user: User | null): boolean => {
  if (!user?.isActive) return false;
  return hasPermission(user.role, "canManageUsers");
};

/**
 * Check if user can view analytics
 */
export const canViewAnalytics = (user: User | null): boolean => {
  if (!user?.isActive) return false;
  return hasPermission(user.role, "canViewAnalytics");
};

/**
 * Get user's display name
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return "Guest";
  return user.firstName || user.email.split("@")[0] || "User";
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    user: "User",
    editor: "Editor",
    admin: "Administrator",
  };
  return roleNames[role] || role;
};
