"use client"

import React, { ReactNode, useState } from "react"

export interface TabConfig {
  id: string
  label: string
  content: ReactNode
  icon?: ReactNode
  disabled?: boolean
  badge?: string | number
  tooltip?: string
}

export interface SubTabConfig {
  main: TabConfig[]
  sub?: Record<string, TabConfig[]>
}

interface EnhancedTabContainerProps {
  tabs: TabConfig[]
  subTabs?: Record<string, TabConfig[]>
  defaultTab?: string
  defaultSubTab?: Record<string, string>
  onTabChange?: (tabId: string) => void
  onSubTabChange?: (mainTabId: string, subTabId: string) => void
  className?: string
  tabsClassName?: string
  contentClassName?: string
  variant?: "default" | "pills" | "underline"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
}

const EnhancedTabContainer: React.FC<EnhancedTabContainerProps> = ({
  tabs,
  subTabs = {},
  defaultTab,
  defaultSubTab = {},
  onTabChange,
  onSubTabChange,
  className = "",
  tabsClassName = "",
  contentClassName = "",
  variant = "default",
  size = "md",
  fullWidth = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const [activeSubTabs, setActiveSubTabs] =
    useState<Record<string, string>>(defaultSubTab)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)

    // Initialize sub-tab if not set
    if (subTabs[tabId] && !activeSubTabs[tabId]) {
      const firstSubTab = subTabs[tabId][0]?.id
      if (firstSubTab) {
        setActiveSubTabs((prev) => ({ ...prev, [tabId]: firstSubTab }))
        onSubTabChange?.(tabId, firstSubTab)
      }
    }
  }

  const handleSubTabChange = (mainTabId: string, subTabId: string) => {
    setActiveSubTabs((prev) => ({ ...prev, [mainTabId]: subTabId }))
    onSubTabChange?.(mainTabId, subTabId)
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "pills":
        return {
          container: "bg-slate-700 rounded-lg p-1",
          tab: "rounded-md",
          active: "bg-slate-600 text-white shadow-sm",
          inactive: "text-slate-300 hover:bg-slate-600 hover:text-white",
        }
      case "underline":
        return {
          container: "border-b border-slate-600",
          tab: "border-b-2 border-transparent",
          active: "border-blue-500 text-blue-400",
          inactive: "text-slate-300 hover:text-white hover:border-slate-400",
        }
      default:
        return {
          container: "bg-slate-800 border-b border-slate-600",
          tab: "border-b-2 border-transparent",
          active: "border-blue-500 text-white bg-slate-700",
          inactive: "text-slate-300 hover:text-white hover:bg-slate-700",
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-3 py-2"
      case "lg":
        return "text-base px-6 py-4"
      default:
        return "text-sm px-4 py-3"
    }
  }

  const variantClasses = getVariantClasses()
  const sizeClasses = getSizeClasses()

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab)
  const currentSubTabs = subTabs[activeTab]
  const activeSubTab = activeSubTabs[activeTab]
  const activeSubTabConfig = currentSubTabs?.find(
    (tab) => tab.id === activeSubTab
  )

  return (
    <div className={`w-full ${className}`}>
      {/* Main Tabs */}
      <div
        className={`flex ${fullWidth ? "w-full" : ""} ${variantClasses.container} ${tabsClassName}`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`flex items-center gap-2 transition-all duration-200 ${sizeClasses} ${variantClasses.tab} ${activeTab === tab.id ? variantClasses.active : variantClasses.inactive} ${tab.disabled ? "cursor-not-allowed opacity-50" : ""} ${fullWidth ? "flex-1 justify-center" : ""} `}
            title={tab.tooltip}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sub Tabs (if available for current main tab) */}
      {currentSubTabs && currentSubTabs.length > 0 && (
        <div className="bg-slate-750 border-b border-slate-700">
          <div className="flex">
            {currentSubTabs.map((subTab) => (
              <button
                key={subTab.id}
                onClick={() =>
                  !subTab.disabled && handleSubTabChange(activeTab, subTab.id)
                }
                disabled={subTab.disabled}
                className={`flex items-center gap-2 border-b-2 border-transparent px-4 py-2 text-sm transition-all duration-200 ${
                  activeSubTab === subTab.id
                    ? "border-blue-400 bg-slate-700 text-blue-400"
                    : "text-slate-400 hover:bg-slate-700 hover:text-white"
                } ${subTab.disabled ? "cursor-not-allowed opacity-50" : ""} `}
                title={subTab.tooltip}
              >
                {subTab.icon}
                <span>{subTab.label}</span>
                {subTab.badge && (
                  <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                    {subTab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`${contentClassName}`}>
        {/* Sub-tab content takes priority if available */}
        {activeSubTabConfig
          ? activeSubTabConfig.content
          : activeTabConfig?.content}
      </div>
    </div>
  )
}

export default EnhancedTabContainer
