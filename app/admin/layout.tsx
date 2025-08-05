"use client"

import React from "react"
import { useUser } from "@/app/(payload)/_providers/UserProvider"
import UserProfile from "@/components/auth/UserProfile"
import { BarChart3, BookOpen, Code2, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AdminGuard from "./components/AdminGuard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout } = useUser()

  const sidebarItems = [
    {
      href: "/admin/exercises",
      label: "Exercises",
      icon: Code2,
      description: "Manage programming exercise",
    },
    {
      href: "/admin/tutorials",
      label: "Tutorials",
      icon: BookOpen,
      description: "Manage multi-lesson tutorials",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      description: "Coming soon",
      disabled: true,
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Coming soon",
      disabled: true,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      description: "Coming soon",
      disabled: true,
    },
  ]

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex">
          {/* Sidebar */}
          <div className="min-h-screen w-56 bg-white shadow-sm dark:bg-slate-800">
            <div className="border-b border-slate-200 p-4 dark:border-slate-700">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Codehub Dashboard
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Manage your platform
              </p>
            </div>

            <nav className="p-3">
              <ul className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")

                  return (
                    <li key={item.href}>
                      {item.disabled ? (
                        <div className="flex w-full cursor-not-allowed items-center gap-2 rounded-md px-3 py-2 text-slate-400 dark:text-slate-600">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">
                              {item.label}
                            </div>
                            <div className="text-xs opacity-75">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">
                              {item.label}
                            </div>
                            <div className="text-xs opacity-75">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* User Profile */}
            {user && (
              <UserProfile user={user} onLogout={logout} compact={true} />
            )}
          </div>
          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </AdminGuard>
  )
}
