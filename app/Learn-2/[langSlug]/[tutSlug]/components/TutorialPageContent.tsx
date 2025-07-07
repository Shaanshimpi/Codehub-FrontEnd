import React from "react"
import { TutorialPageContentProps } from "@/app/Learn-2/types/TutorialTypes"
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
    <div className="grid min-h-screen place-items-center bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <TutorialSidebar
        tutorials={allTutorials}
        language={language}
        currentTutorial={tutorial}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-[10vh]">
        <TutorialBreadcrumb language={language} tutorial={tutorial} />

        <TutorialHeader
          tutorial={tutorial}
          language={language}
          allTutorials={allTutorials}
        />

        <TutorialContent content={tutorial.content} />

        <TutorialNavigation
          language={language}
          previousTutorial={previousTutorial}
          nextTutorial={nextTutorial}
        />
      </div>
    </div>
  )
}

export default TutorialPageContent
