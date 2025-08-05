"use client";

import React from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { User } from "@/lib/auth/types";
import { getUserDisplayName, getRoleDisplayName } from "@/lib/auth/permissions";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  compact?: boolean;
}

export default function UserProfile({
  user,
  onLogout,
  compact = false,
}: UserProfileProps) {
  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-700">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {getUserDisplayName(user)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {getRoleDisplayName(user.role)}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="ml-2 rounded p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/20">
            <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {getUserDisplayName(user)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {getRoleDisplayName(user.role)} •{" "}
            {user.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
