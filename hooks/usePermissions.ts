"use client";

import { useMemo } from "react";
import { User } from "@/lib/auth/types";
import {
  canAccessAdmin,
  canEditExercises,
  canDeleteExercises,
  canManageUsers,
  canViewAnalytics,
  hasPermission,
  Permission,
} from "@/lib/auth/permissions";

export function usePermissions(user: User | null) {
  return useMemo(
    () => ({
      canAccessAdmin: canAccessAdmin(user),
      canEditExercises: canEditExercises(user),
      canDeleteExercises: canDeleteExercises(user),
      canManageUsers: canManageUsers(user),
      canViewAnalytics: canViewAnalytics(user),
      hasPermission: (permission: Permission) =>
        user?.isActive ? hasPermission(user.role, permission) : false,
    }),
    [user],
  );
}
