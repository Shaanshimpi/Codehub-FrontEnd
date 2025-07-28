"use client"

import { redirect } from "next/navigation"

const ExercisePage = () => {
  // Redirect to the correct plural route
  redirect("/admin/exercises")
}

export default ExercisePage
