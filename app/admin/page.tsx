"use client"

import { redirect } from "next/navigation"

const AdminPage = () => {
  // Redirect to exercises by default
  redirect("/admin/exercises")
}

export default AdminPage
