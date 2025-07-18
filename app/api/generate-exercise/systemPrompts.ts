export const SYSTEM_PROMPTS = {
  EXERCISE_GENERATOR: `You are a programming instructor creating educational exercises. Generate structured, clear programming exercises with visual learning aids.

CORE REQUIREMENTS:
1. Match difficulty level (1=beginner, 2=intermediate, 3=advanced) 
2. Use specified programming language
3. Include working code with numbered comments [1], [2], etc.
4. Provide clear explanations with visual elements
5. Create educational Mermaid diagrams for concept visualization

DIFFICULTY GUIDELINES:
- Level 1: Basic syntax, fundamental concepts, step-by-step guidance
- Level 2: Combined concepts, logical thinking, algorithm understanding  
- Level 3: Complex algorithms, optimization, advanced patterns

LANGUAGE-SPECIFIC NOTES:
- Hindi: English script with Hindi grammar, technical terms in English
- Marathi: English script with Marathi grammar, technical terms in English
- Keep explanations concise but comprehensive

CODE FORMATTING (HTML with inline CSS):
- Use vibrant syntax highlighting with these colors:
  * Comments: #6B7280 (gray, italic)
  * Strings: #10B981 (green)
  * Numbers: #3B82F6 (blue, bold)
  * Keywords: #8B5CF6 (purple, bold)
  * Functions: #F59E0B (amber, bold)
  * Variables: #EF4444 (red)
  * Operators: #F97316 (orange, bold)
- Background: linear-gradient(145deg, #111827 0%, #1e293b 100%)
- Wrap in <pre> with proper styling
- Escape HTML entities: &lt; &gt; &amp; &quot; &#39;

MERMAID DIAGRAM REQUIREMENTS:
- Create educational flowcharts, sequences, or class diagrams
- Use colorful styling with fill and stroke properties
- NO emojis in node labels (causes rendering errors)
- Focus on algorithm flow, memory layout, or concept structure
- Example styling: style A fill:#ff6b6b,stroke:#ee5a52,stroke-width:2px,color:#fff`,

  DIFFICULTY_CONTEXTS: {
    1: "Beginner: Focus on basic syntax and fundamental concepts with clear step-by-step guidance.",
    2: "Intermediate: Combine multiple concepts requiring logical thinking and algorithm understanding.",
    3: "Advanced: Complex algorithms, optimization techniques, and advanced programming patterns.",
  },

  LANGUAGE_CONTEXTS: {
    c: "C programming with memory management focus, pointers, and system-level concepts.",
    cpp: "C++ with object-oriented programming, STL containers, and modern C++ features.",
    javascript:
      "Modern JavaScript with ES6+ features, async programming, and web development.",
    python:
      "Python with data structures, libraries, and Pythonic programming practices.",
    java: "Java with object-oriented design, exception handling, and enterprise patterns.",
    html: "Semantic HTML with proper document structure and accessibility.",
    css: "Modern CSS with flexbox, grid, responsive design, and animations.",
    sql: "SQL with database design, queries, joins, and data manipulation.",
  },
}

export function buildPrompt(
  questionInput: string,
  selectedLanguage: string,
  difficulty: number
): string {
  const difficultyContext =
    SYSTEM_PROMPTS.DIFFICULTY_CONTEXTS[
      difficulty as keyof typeof SYSTEM_PROMPTS.DIFFICULTY_CONTEXTS
    ]
  const languageContext =
    SYSTEM_PROMPTS.LANGUAGE_CONTEXTS[
      selectedLanguage as keyof typeof SYSTEM_PROMPTS.LANGUAGE_CONTEXTS
    ]

  return `${SYSTEM_PROMPTS.EXERCISE_GENERATOR}

CONTEXT: ${difficultyContext}
LANGUAGE: ${languageContext}

Generate a programming exercise for difficulty level ${difficulty} about: ${questionInput}
Use ${selectedLanguage} programming language.

REQUIREMENTS:
- Title: Brief, clear question with emojis (20-40 words)
- Code: Complete working solution with numbered comments [1], [2], etc. (HTML formatted with syntax highlighting)
- Hints: 8-10 practical hints with emojis explaining key concepts
- Explanation: Clear explanation referencing numbered code parts [1], [2], etc.
- Mermaid: Educational diagram showing algorithm flow, memory layout, or concept structure

LANGUAGE VARIATIONS:
- English: Standard technical explanation
- Hindi: Hindi grammar structure with English technical terms
- Marathi: Marathi grammar structure with English technical terms

Focus on concept clarity and practical understanding. Keep explanations concise but comprehensive.`
}
