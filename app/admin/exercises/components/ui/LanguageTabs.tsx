import React from "react"
import { LANGUAGE_TABS } from "../../constants"
import { LanguageTab } from "../../types"

interface LanguageTabsProps {
  activeTab: LanguageTab
  onTabChange: (tab: LanguageTab) => void
  children: React.ReactNode
  className?: string
}

export const LanguageTabs: React.FC<LanguageTabsProps> = ({
  activeTab,
  onTabChange,
  children,
  className = "",
}) => {
  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex space-x-4">
          {LANGUAGE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key as LanguageTab)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {children}
    </div>
  )
}

interface LanguageTabContentProps {
  activeTab: LanguageTab
  targetTab: LanguageTab
  children: React.ReactNode
}

export const LanguageTabContent: React.FC<LanguageTabContentProps> = ({
  activeTab,
  targetTab,
  children,
}) => {
  if (activeTab !== targetTab) return null

  return <div className="space-y-6">{children}</div>
}
