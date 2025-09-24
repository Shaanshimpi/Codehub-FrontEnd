/**
 * Constants used throughout the tutorial interface
 */

export const LESSON_TYPES = {
  CONCEPT: "concept",
  MCQ: "mcq",
  CODE_REARRANGE: "codeblock_rearranging",
  FILL_IN_BLANKS: "fill_in_blanks",
} as const

export const DIFFICULTY_LEVELS = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
} as const

export const STORAGE_KEYS = {
  TUTORIAL_PROGRESS: (tutorialId: string) => `tutorial-progress-${tutorialId}`,
  THEME_PREFERENCE: "theme-preference",
  KEYBOARD_SHORTCUTS_SHOWN: "keyboard-shortcuts-shown",
} as const

export const TIMING = {
  SESSION_UPDATE_INTERVAL: 60000, // 1 minute
  AUTO_SAVE_DELAY: 2000, // 2 seconds
  ANIMATION_DURATION: 300, // milliseconds
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const

export const COLORS = {
  PRIMARY: "#3B82F6",
  SUCCESS: "#10B981",
  WARNING: "#F59E0B",
  ERROR: "#EF4444",
  INFO: "#6366F1",
} as const

export const KEYBOARD_SHORTCUTS = {
  PREVIOUS_LESSON: "ArrowLeft",
  NEXT_LESSON: "ArrowRight",
  TOGGLE_BOOKMARK: "b",
  OPEN_NOTES: "n",
  BACK_TO_REFERENCE: "r",
  SHOW_HELP: "?",
} as const

export const ACHIEVEMENT_THRESHOLDS = {
  HIGH_SCORE: 80,
  EXCELLENT_SCORE: 90,
  LONG_SESSION: 3600000, // 1 hour in milliseconds
  STREAK_MILESTONE: 7, // days
} as const

export const UI_CONFIG = {
  SIDEBAR_WIDTH: 320,
  MOBILE_BREAKPOINT: 768,
  PROGRESS_BAR_HEIGHT: 8,
  MIN_TOUCH_TARGET: 44, // pixels
} as const
