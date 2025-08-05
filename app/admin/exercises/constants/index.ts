// Exercise Management Constants

export const DIFFICULTY_LEVELS = [
  {
    value: 1,
    label: "Beginner",
    displayName: "1 - Beginner",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    value: 2,
    label: "Intermediate",
    displayName: "2 - Intermediate",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    value: 3,
    label: "Advanced",
    displayName: "3 - Advanced",
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
] as const

export const FORM_SECTIONS = [
  { id: "basic", label: "Basic Info" },
  { id: "content", label: "Content" },
  { id: "code", label: "Code" },
  { id: "visual", label: "Visual Elements" },
] as const

export const EXPLANATION_TYPES = [
  { value: "text", label: "Text" },
  { value: "concept", label: "Concept" },
  { value: "warning", label: "Warning" },
  { value: "tip", label: "Tip" },
] as const

export const LANGUAGE_TABS = [
  { key: "en", label: "English" },
  { key: "hi", label: "Hindi" },
  { key: "mr", label: "Marathi" },
] as const

export const DEFAULT_FORM_DATA = {
  title_en: "",
  title_hi: "",
  title_mr: "",
  slug: "",
  problem_statement_en: "",
  problem_statement_hi: "",
  problem_statement_mr: "",
  difficultyLevel: 1,
  programmingLanguage: 0,
  tutorial: 0,
  isLocked: false,
  boilerplate_code: "",
  solution_code: "",
  learning_objectives: [""],
  tags: [""],
  hints_en: [{ text: "" }],
  hints_hi: [{ text: "" }],
  hints_mr: [{ text: "" }],
} as const

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  TITLE_EN_REQUIRED: "English title is required",
  TITLE_HI_REQUIRED: "Hindi title is required",
  TITLE_MR_REQUIRED: "Marathi title is required",
  PROBLEM_STATEMENT_EN_REQUIRED: "English problem statement is required",
  SOLUTION_CODE_REQUIRED: "Solution code is required",
  BOILERPLATE_CODE_REQUIRED: "Boilerplate code is required",
  MERMAID_DIAGRAM_REQUIRED: "Mermaid diagram is required",
  LEARNING_OBJECTIVES_MIN: "At least 2 learning objectives are required",
  TAGS_MIN: "At least 3 programming tags are required",
  HINTS_EN_REQUIRED: "At least one English hint is required",
  HINTS_HI_REQUIRED: "At least one Hindi hint is required",
  HINTS_MR_REQUIRED: "At least one Marathi hint is required",
  PROGRAMMING_LANGUAGE_REQUIRED: "Programming language is required",
  TUTORIAL_REQUIRED: "Tutorial is required",
} as const

export const TABLE_HEADERS = [
  { key: "title", label: "Title", sortable: true },
  { key: "difficulty", label: "Difficulty", sortable: true },
  { key: "language", label: "Language", sortable: true },
  { key: "tutorial", label: "Tutorial", sortable: true },
  { key: "status", label: "Status", sortable: false },
  { key: "created", label: "Created", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
] as const
