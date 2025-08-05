// User role types
export type UserRole = "user" | "editor" | "admin";

// User interface matching the server-side Users collection
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Role permission helpers
export const USER_PERMISSIONS = {
  user: {
    canAccessAdmin: false,
    canEditExercises: false,
    canDeleteExercises: false,
    canManageUsers: false,
  },
  editor: {
    canAccessAdmin: true,
    canEditExercises: true,
    canDeleteExercises: true,
    canManageUsers: false,
  },
  admin: {
    canAccessAdmin: true,
    canEditExercises: true,
    canDeleteExercises: true,
    canManageUsers: true,
  },
} as const;

// Helper functions for role checking
export const hasPermission = (
  userRole: UserRole,
  permission: keyof typeof USER_PERMISSIONS.admin,
): boolean => {
  return USER_PERMISSIONS[userRole][permission];
};

export const canAccessAdmin = (user: User | null): boolean => {
  return (
    (user?.isActive &&
      user?.role &&
      hasPermission(user.role, "canAccessAdmin")) ||
    false
  );
};

export const canEditExercises = (user: User | null): boolean => {
  return (
    (user?.isActive &&
      user?.role &&
      hasPermission(user.role, "canEditExercises")) ||
    false
  );
};

export const canDeleteExercises = (user: User | null): boolean => {
  return (
    (user?.isActive &&
      user?.role &&
      hasPermission(user.role, "canDeleteExercises")) ||
    false
  );
};

export const canManageUsers = (user: User | null): boolean => {
  return (
    (user?.isActive &&
      user?.role &&
      hasPermission(user.role, "canManageUsers")) ||
    false
  );
};
