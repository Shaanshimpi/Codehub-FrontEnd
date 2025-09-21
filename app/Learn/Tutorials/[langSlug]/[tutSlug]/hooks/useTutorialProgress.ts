"use client"

import { useEffect, useState } from "react"

export interface LessonProgress {
  lessonId: string
  completed: boolean
  timeSpent: number
  lastAccessed: number
  answers?: { [key: string]: any }
  score?: number
}

export interface TutorialProgress {
  tutorialId: string
  currentLessonIndex: number
  completedLessons: LessonProgress[]
  totalTimeSpent: number
  lastAccessed: number
  bookmarked: boolean
  notes: string
}

export const useTutorialProgress = (
  tutorialId: string,
  totalLessons: number
) => {
  const [progress, setProgress] = useState<TutorialProgress>({
    tutorialId,
    currentLessonIndex: 0,
    completedLessons: [],
    totalTimeSpent: 0,
    lastAccessed: Date.now(),
    bookmarked: false,
    notes: "",
  })

  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now())

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(
      `tutorial-progress-${tutorialId}`
    )
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setProgress(parsed)
      } catch (error) {
        console.error("Error loading tutorial progress:", error)
      }
    }
  }, [tutorialId])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      `tutorial-progress-${tutorialId}`,
      JSON.stringify(progress)
    )
  }, [progress, tutorialId])

  // Update session time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const sessionTime = Date.now() - sessionStartTime
      setProgress((prev) => ({
        ...prev,
        totalTimeSpent: prev.totalTimeSpent + 60000, // Add 1 minute
        lastAccessed: Date.now(),
      }))
    }, 60000)

    return () => clearInterval(interval)
  }, [sessionStartTime])

  const updateCurrentLesson = (lessonIndex: number) => {
    setProgress((prev) => ({
      ...prev,
      currentLessonIndex: lessonIndex,
      lastAccessed: Date.now(),
    }))
  }

  const markLessonCompleted = (
    lessonId: string,
    score?: number,
    answers?: any
  ) => {
    setProgress((prev) => {
      const existingLessonIndex = prev.completedLessons.findIndex(
        (lesson) => lesson.lessonId === lessonId
      )

      const lessonProgress: LessonProgress = {
        lessonId,
        completed: true,
        timeSpent: Date.now() - sessionStartTime,
        lastAccessed: Date.now(),
        score,
        answers,
      }

      let newCompletedLessons
      if (existingLessonIndex >= 0) {
        // Update existing lesson progress
        newCompletedLessons = [...prev.completedLessons]
        newCompletedLessons[existingLessonIndex] = lessonProgress
      } else {
        // Add new lesson progress
        newCompletedLessons = [...prev.completedLessons, lessonProgress]
      }

      return {
        ...prev,
        completedLessons: newCompletedLessons,
        lastAccessed: Date.now(),
      }
    })
  }

  const toggleBookmark = () => {
    setProgress((prev) => ({
      ...prev,
      bookmarked: !prev.bookmarked,
      lastAccessed: Date.now(),
    }))
  }

  const updateNotes = (notes: string) => {
    setProgress((prev) => ({
      ...prev,
      notes,
      lastAccessed: Date.now(),
    }))
  }

  const resetProgress = () => {
    setProgress({
      tutorialId,
      currentLessonIndex: 0,
      completedLessons: [],
      totalTimeSpent: 0,
      lastAccessed: Date.now(),
      bookmarked: false,
      notes: "",
    })
    setSessionStartTime(Date.now())
  }

  // Calculate progress statistics
  const getProgressStats = () => {
    const completedCount = progress.completedLessons.length
    const progressPercentage = Math.round((completedCount / totalLessons) * 100)
    const averageScore =
      progress.completedLessons.length > 0
        ? progress.completedLessons
            .filter((lesson) => lesson.score !== undefined)
            .reduce((acc, lesson) => acc + (lesson.score || 0), 0) /
          progress.completedLessons.filter(
            (lesson) => lesson.score !== undefined
          ).length
        : 0

    return {
      completedCount,
      totalLessons,
      progressPercentage,
      averageScore: Math.round(averageScore),
      totalTimeSpent: progress.totalTimeSpent,
      isBookmarked: progress.bookmarked,
      hasNotes: progress.notes.length > 0,
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.some(
      (lesson) => lesson.lessonId === lessonId
    )
  }

  const getLessonScore = (lessonId: string) => {
    const lesson = progress.completedLessons.find(
      (lesson) => lesson.lessonId === lessonId
    )
    return lesson?.score
  }

  return {
    progress,
    updateCurrentLesson,
    markLessonCompleted,
    toggleBookmark,
    updateNotes,
    resetProgress,
    getProgressStats,
    isLessonCompleted,
    getLessonScore,
    sessionStartTime: sessionStartTime,
  }
}
