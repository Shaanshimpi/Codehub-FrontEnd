"use client"

import React from "react"
import { Language, Tutorial } from "../../../types/TutorialTypes"
import TutorialCard from "./TutorialCard"

interface TutorialGridProps {
  tutorials: Tutorial[]
  language: Language
}

const TutorialGrid = ({ tutorials, language }: TutorialGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tutorials.map((tutorial, index) => (
        <TutorialCard
          key={tutorial.id}
          tutorial={tutorial}
          index={index + 1}
          language={language}
        />
      ))}
    </div>
  )
}

export default TutorialGrid
