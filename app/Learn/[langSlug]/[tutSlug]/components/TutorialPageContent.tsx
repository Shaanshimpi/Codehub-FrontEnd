import React from "react"
import CodeReviewModalButton from "@/app/Learn/Interactives/CodeReviewDirectory/CodeReviewModalButton"
import { TutorialPageContentProps } from "@/app/Learn/types/TutorialTypes"
import TryYourSelfSection from "../../../Interactives/TryYourSelfDirectory/TryYourSelfSection"
import TutorialBreadcrumb from "./TutorialBreadcrumb"
import TutorialContent from "./TutorialContent"
import TutorialHeader from "./TutorialHeader"
import TutorialNavigation from "./TutorialNavigation"
import TutorialSidebar from "./TutorialSidebar"

const TutorialPageContent: React.FC<TutorialPageContentProps> = ({
  tutorial,
  language,
  allTutorials,
  previousTutorial,
  nextTutorial,
}) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <TutorialSidebar
        tutorials={allTutorials}
        language={language}
        currentTutorial={tutorial}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-2 py-[10vh]">
        <TutorialBreadcrumb language={language} tutorial={tutorial} />

        <TutorialHeader
          tutorial={tutorial}
          language={language}
          allTutorials={allTutorials}
          previousTutorial={previousTutorial}
          nextTutorial={nextTutorial}
        />

        <TutorialContent content={tutorial.content} />

        <TryYourSelfSection language={language} />

        <TutorialNavigation
          language={language}
          previousTutorial={previousTutorial}
          nextTutorial={nextTutorial}
        />
      </div>

      {/* Floating Code Review Section */}
      <CodeReviewModalButton
        language={language.title}
        content={tutorial.content}
      />
    </div>
  )
}

export default TutorialPageContent
