import { useEffect, useState } from "react"
import { getLanguages, getTutorialsByLanguageId } from "@/lib/getData"
import { AdminLanguage, AdminTutorial } from "../types"

export const useLanguagesAndTutorials = (selectedLanguageId?: number) => {
  const [languages, setLanguages] = useState<AdminLanguage[]>([])
  const [tutorials, setTutorials] = useState<AdminTutorial[]>([])
  const [languagesLoading, setLanguagesLoading] = useState(true)
  const [tutorialsLoading, setTutorialsLoading] = useState(false)

  // Load languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesData = await getLanguages()
        setLanguages(languagesData)
      } catch (error) {
        console.error("Error loading languages:", error)
      } finally {
        setLanguagesLoading(false)
      }
    }
    fetchLanguages()
  }, [])

  // Load tutorials when language changes
  useEffect(() => {
    if (selectedLanguageId) {
      const fetchTutorials = async () => {
        setTutorialsLoading(true)
        try {
          const tutorialData =
            await getTutorialsByLanguageId(selectedLanguageId)
          setTutorials(tutorialData)
        } catch (error) {
          console.error("Error loading tutorials:", error)
          setTutorials([])
        } finally {
          setTutorialsLoading(false)
        }
      }
      fetchTutorials()
    } else {
      setTutorials([])
    }
  }, [selectedLanguageId])

  return {
    languages,
    tutorials,
    languagesLoading,
    tutorialsLoading,
  }
}
