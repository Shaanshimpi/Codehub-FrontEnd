"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/auth/types";
import { getUserDisplayName, getRoleDisplayName } from "@/lib/auth/permissions";
import LoadingSpinner from "./LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
  user: User | null;
  isLoading: boolean;
  hasAccess: boolean;
  redirectTo?: string;
  loadingMessage?: string;
  accessDeniedMessage?: string;
}

export default function AuthGuard({
  children,
  user,
  isLoading,
  hasAccess,
  redirectTo = "/",
  loadingMessage = "Checking permissions...",
  accessDeniedMessage = "You don't have permission to access this page.",
}: AuthGuardProps) {
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            {loadingMessage}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please wait while we verify your access.
          </p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-md text-center">
          <div className="rounded-xl border bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              Authentication Required
            </h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
              You need to be logged in to access this page.
            </p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              Sign In
            </Link>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have required permissions
  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-md text-center">
          <div className="rounded-xl border bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              Access Denied
            </h2>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {accessDeniedMessage}
            </p>
            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2" />
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  Admin access requires Editor or Admin role
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">User:</span>{" "}
                {getUserDisplayName(user)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">Role:</span>{" "}
                {getRoleDisplayName(user.role)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">Status:</span>{" "}
                {user.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <button
              onClick={() => router.push(redirectTo)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User has required access, render the protected content
  return <>{children}</>;
}
