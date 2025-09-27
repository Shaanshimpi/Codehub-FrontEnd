// schemas/ExerciseSchemas.ts - JSON Schema definitions for exercise generation

export const TITLE_SCHEMA = {
  type: "string",
  description: "Exercise question in brief couple of lines as a statement",
} as const

export const DESCRIPTION_SCHEMA = {
  type: "string",
  description:
    "Detailed description of the exercise, explaining what the student will learn and implement",
} as const

export const CODE_SCHEMA = {
  type: "string",
  description:
    "Complete working PLAIN TEXT code with numbered comments [1], [2], etc. NO HTML formatting - just clean, copyable code that can be executed directly. For BEGINNERS use SIMPLE algorithms without optimizations.",
} as const

export const MERMAID_SCHEMA = {
  type: "string",
  description:
    "Educational Mermaid flowchart explaining the code logic. Must start with diagram type (graph TD, flowchart TD, etc.). CRITICAL: Use DOUBLE QUOTES for ALL text labels. Mathematical expressions and simple code conditions are ALLOWED: sqrt(n), if(year%4==0), arr[i], i++. AVOID only these problematic characters: [], <>, \\, ;, : in node labels.",
} as const

export const HINTS_SCHEMA = {
  type: "array",
  description: "Practical hints array",
  items: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description:
          "Clear, practical hint text. Use backticks for inline code.",
      },
      code_snippet: {
        type: "string",
        description: "Optional plain text code example",
      },
    },
    required: ["text"],
    additionalProperties: false,
  },
} as const

export const EXPLANATION_SCHEMA = {
  type: "array",
  description: "Detailed explanation array",
  items: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "Explanation text starting with [1], [2], etc.",
      },
      type: {
        type: "string",
        enum: ["text", "concept", "warning", "tip"],
        description: "Type of explanation for proper formatting",
      },
      code_ref: {
        type: "array",
        items: { type: "number" },
        description: "Array of comment numbers this explanation refers to",
      },
    },
    required: ["text", "type"],
    additionalProperties: false,
  },
} as const

export const MEMORY_STATE_SCHEMA = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Variable name",
    },
    value: {
      type: "string",
      description: "Current value of the variable",
    },
    type: {
      type: "string",
      description: "Data type",
    },
    changed: {
      type: "boolean",
      description: "Whether this variable changed in this step",
    },
  },
  required: ["name", "value", "type"],
  additionalProperties: false,
} as const

export const EXECUTION_STEPS_SCHEMA = {
  type: "array",
  description: "Step-by-step execution trace with memory states",
  items: {
    type: "object",
    properties: {
      step: {
        type: "number",
        description: "Sequential step number",
      },
      line_number: {
        type: "number",
        description: "Line number in the code (optional for reference)",
      },
      line: {
        type: "string",
        description: "Code line being executed",
      },
      description: {
        type: "string",
        description: "What happens in this step",
      },
      output: {
        type: "string",
        description: "Any output produced",
      },
      memory_state: {
        type: "array",
        description: "Current state of all variables at this execution step",
        items: MEMORY_STATE_SCHEMA,
      },
    },
    required: ["step", "line", "description", "memory_state"],
    additionalProperties: false,
  },
} as const

export const CONCEPTS_SCHEMA = {
  type: "array",
  description: "Key programming concepts demonstrated",
  items: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Concept name",
      },
      description: {
        type: "string",
        description: "Clear explanation of the concept",
      },
      visual_metaphor: {
        type: "string",
        description: "Real-world analogy or metaphor",
      },
    },
    required: ["name", "description", "visual_metaphor"],
    additionalProperties: false,
  },
} as const

export const VISUAL_ELEMENTS_SCHEMA = {
  type: "object",
  description: "Required visual learning elements",
  properties: {
    execution_steps: EXECUTION_STEPS_SCHEMA,
    concepts: CONCEPTS_SCHEMA,
  },
  required: ["execution_steps", "concepts"],
  additionalProperties: false,
} as const

export const BOILERPLATE_SCHEMA = {
  type: "string",
  description:
    "PLAIN TEXT starter code template for students with TODO comments and empty implementation areas. Must be clean, copyable code that can be executed directly. Should be 20%-30% part of original code for students to get started with clear guidance.",
} as const

export const LEARNING_OBJECTIVES_SCHEMA = {
  type: "array",
  description: "Learning objectives for the exercise",
  items: {
    type: "string",
    description: "Specific learning objective starting with action verb",
  },
  minItems: 2,
  maxItems: 4,
} as const

export const TAGS_SCHEMA = {
  type: "array",
  description: "Programming concept tags",
  items: {
    type: "string",
    description: "Single programming concept or technique",
  },
  minItems: 3,
  maxItems: 6,
} as const

// Main exercise schema
export const EXERCISE_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: TITLE_SCHEMA,
    description: DESCRIPTION_SCHEMA,
    solution_code: CODE_SCHEMA,
    mermaid_diagram: MERMAID_SCHEMA,
    hints: HINTS_SCHEMA,
    explanation: EXPLANATION_SCHEMA,
    tags: TAGS_SCHEMA,
    learning_objectives: LEARNING_OBJECTIVES_SCHEMA,
    visual_elements: VISUAL_ELEMENTS_SCHEMA,
    boilerplate_code: BOILERPLATE_SCHEMA,
  },
  required: [
    "title",
    "description",
    "solution_code",
    "mermaid_diagram",
    "hints",
    "explanation",
    "visual_elements",
    "boilerplate_code",
  ],
  additionalProperties: false,
} as const
