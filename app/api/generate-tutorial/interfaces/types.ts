// app/api/generate-tutorial/interfaces/types.ts
// TypeScript interfaces for Programming Tutorial System (English-only)

// ==================== CORE INTERFACES ====================

// Removed multilingual support - now using simple strings

// ==================== LESSON CONTENT TYPES ====================

// 1. CONCEPT LESSON - For teaching programming concepts
export interface ConceptContent {
  explanation: string
  keyPoints: string[] // 3-5 key learning points
  codeExamples: {
    title: string
    code: string // Complete, working code
    explanation: string
  }[]
  practiceHints: string[] // 2-4 practical hints
  mermaid?: string
  commonMistakes?: string[] // Common student mistakes
  bestPractices?: string[] // Programming best practices
}

// 2. MCQ LESSON - Multiple Choice Questions
export interface MCQContent {
  questions: {
    id: string
    question: string
    options: {
      id: string
      text: string
      isCorrect: boolean
    }[]
    explanation: string // Why correct answer is right
    difficulty: 1 | 2 | 3 // Question difficulty
    codeSnippet?: string // Optional code for context
  }[]
}

// 3. CODE BLOCK REARRANGING - Drag and drop code blocks
export interface CodeBlockRearrangingContent {
  scenario: string // Problem description
  targetCode: string // Expected final code
  codeBlocks: {
    id: string
    content: string // Code block content
  }[]
  correctOrder: string[] // Array of block IDs in correct order
  hints: string[] // Progressive hints
  difficulty: 1 | 2 | 3
  estimatedTime: number // Minutes to complete
}

// 4. FILL IN THE BLANKS - Code completion exercises
export interface FillInTheBlanksContent {
  scenario: string // Problem context
  codeTemplate: string // Code with blanks marked as {{blank_id}}
  blanks: {
    id: string // Matches {{blank_id}} in template
    type: "text" | "dropdown" | "code"
    correctAnswer: string
    options?: string[] // For dropdown type
    hint?: string
    explanation: string // Why this is correct
  }[]
  hints: string[] // General hints for the exercise
  solution: {
    completeCode: string // Final code with all blanks filled
    explanation: string // Overall solution explanation
  }
  difficulty: 1 | 2 | 3
  estimatedTime: number
}

// ==================== LESSON STRUCTURE ====================
export interface TutorialLesson {
  id: string
  title: string // English title
  type: "concept" | "mcq" | "codeblock_rearranging" | "fill_in_blanks"
  content:
    | ConceptContent
    | MCQContent
    | CodeBlockRearrangingContent
    | FillInTheBlanksContent
  learningObjectives: string[] // 2-4 specific objectives in English
  difficulty: 1 | 2 | 3 // Lesson difficulty
  tags: string[] // Searchable tags
  order: number // Lesson sequence
  estimatedTime: number // Minutes to complete
}

// ==================== TUTORIAL STRUCTURE ====================
export interface ProgrammingTutorial {
  // Basic Information
  id: string
  title: string // English title
  description: string // English description

  // Educational Metadata
  learningObjectives: string[] // 3-6 overall objectives in English
  keyTopics: string[] // 4-8 main topics covered
  difficulty: 1 | 2 | 3 // Overall difficulty

  // Content Structure
  lessons: TutorialLesson[] // 5-20 lessons
  conceptualFlow: string[] // Learning progression
  practicalApplications: string[] // Real-world uses in English

  // Metadata
  tags: string[]
  estimatedTime?: number // Total time in minutes
  mermaid_diagram?: string // Optional overview diagram
}

// ==================== API RESPONSE INTERFACES ====================

// Modern English-only interface for API responses
export interface TutorialAPIResponse {
  id: string
  title: string // English title
  description: string // English description
  learningObjectives: string[] // English objectives
  keyTopics: string[]
  difficulty: 1 | 2 | 3
  lessons: TutorialLesson[]
  conceptualFlow: string[]
  practicalApplications: string[] // English applications
  tags: string[]
  estimatedTime: number
  mermaid_diagram?: string
}

// For backward compatibility with existing API structure
export interface LegacyTutorialAPIResponse {
  title_en: string
  title_hi: string
  title_mr: string
  description_en: string
  description_hi: string
  description_mr: string
  learningObjectives: string[]
  keyTopics: string[]
  difficulty: 1 | 2 | 3
  lessons: {
    title: string
    type: "concept" | "mcq" | "codeblock_rearranging" | "fill_in_blanks"
    content: any
    learningObjectives: string[]
    difficulty: 1 | 2 | 3
    estimatedTime: number
  }[]
  conceptualFlow: string[]
  practicalApplications: string[]
  tags: string[]
  estimatedTime: number
  prerequisites?: string[]
  assessmentSuggestions?: string[]
  mermaid_diagram?: string
}
