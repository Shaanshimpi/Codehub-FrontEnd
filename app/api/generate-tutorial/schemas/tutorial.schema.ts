// app/api/generate-tutorial/schemas/tutorial.schema.ts
// JSON Schema definitions for AI API requests

// ==================== BASIC FIELD SCHEMAS ====================

export const MULTI_LANGUAGE_TITLE_SCHEMA = {
  type: "object",
  properties: {
    en: {
      type: "string",
      description: "Tutorial title in clear, engaging English",
    },
    hi: {
      type: "string",
      description:
        "Tutorial title in Hindi using Roman script with Hindi grammar but English technical terms",
    },
    mr: {
      type: "string",
      description:
        "Tutorial title in Marathi using Roman script with Marathi grammar but English technical terms",
    },
  },
  required: ["en", "hi", "mr"],
  additionalProperties: false,
}

export const MULTI_LANGUAGE_DESCRIPTION_SCHEMA = {
  type: "object",
  properties: {
    en: {
      type: "string",
      description: "Comprehensive tutorial description in English",
    },
    hi: {
      type: "string",
      description: "Tutorial description in Hindi Roman script",
    },
    mr: {
      type: "string",
      description: "Tutorial description in Marathi Roman script",
    },
  },
  required: ["en", "hi", "mr"],
  additionalProperties: false,
}

// ==================== LESSON CONTENT SCHEMAS ====================

export const CONCEPT_CONTENT_SCHEMA = {
  type: "object",
  properties: {
    explanation: {
      type: "string",
      description: "Comprehensive explanation of the programming concept",
    },
    keyPoints: {
      type: "array",
      items: { type: "string" },
      description: "3-5 key learning points",
      minItems: 3,
      maxItems: 5,
    },
    codeExamples: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          code: { type: "string", description: "Complete, working code" },
          explanation: { type: "string" },
        },
        required: ["title", "code", "explanation"],
        additionalProperties: false,
      },
      minItems: 1,
      maxItems: 3,
    },
    practiceHints: {
      type: "array",
      items: { type: "string" },
      description: "2-4 practical hints",
      minItems: 2,
      maxItems: 4,
    },
    mermaid: { type: "string", description: "Optional Mermaid diagram" },
    commonMistakes: {
      type: "array",
      items: { type: "string" },
      description: "Common student mistakes",
    },
    bestPractices: {
      type: "array",
      items: { type: "string" },
      description: "Programming best practices",
    },
  },
  required: ["explanation", "keyPoints", "codeExamples", "practiceHints"],
  additionalProperties: false,
}

export const MCQ_CONTENT_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                text: { type: "string" },
                isCorrect: { type: "boolean" },
              },
              required: ["id", "text", "isCorrect"],
              additionalProperties: false,
            },
            minItems: 4,
            maxItems: 4,
          },
          explanation: { type: "string" },
          difficulty: { type: "number", enum: [1, 2, 3] },
          codeSnippet: { type: "string" },
        },
        required: ["id", "question", "options", "explanation", "difficulty"],
        additionalProperties: false,
      },
      minItems: 1,
      maxItems: 5,
    },
  },
  required: ["questions"],
  additionalProperties: false,
}

export const CODE_BLOCK_REARRANGING_SCHEMA = {
  type: "object",
  properties: {
    scenario: { type: "string", description: "Problem description" },
    targetCode: { type: "string", description: "Expected final code" },
    codeBlocks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          content: { type: "string" },
        },
        required: ["id", "content"],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 8,
    },
    correctOrder: {
      type: "array",
      items: { type: "string" },
      description: "Array of block IDs in correct order",
    },
    hints: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 3,
    },
    difficulty: { type: "number", enum: [1, 2, 3] },
    estimatedTime: { type: "number", minimum: 5, maximum: 30 },
  },
  required: [
    "scenario",
    "targetCode",
    "codeBlocks",
    "correctOrder",
    "hints",
    "difficulty",
    "estimatedTime",
  ],
  additionalProperties: false,
}

export const FILL_IN_BLANKS_SCHEMA = {
  type: "object",
  properties: {
    scenario: { type: "string", description: "Problem context" },
    codeTemplate: {
      type: "string",
      description: "Code with blanks marked as {{blank_id}}",
    },
    blanks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["text", "dropdown", "code"] },
          correctAnswer: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" },
          },
          hint: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["id", "type", "correctAnswer", "explanation"],
        additionalProperties: false,
      },
      minItems: 1,
      maxItems: 6,
    },
    hints: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 3,
    },
    solution: {
      type: "object",
      properties: {
        completeCode: { type: "string" },
        explanation: { type: "string" },
      },
      required: ["completeCode", "explanation"],
      additionalProperties: false,
    },
    difficulty: { type: "number", enum: [1, 2, 3] },
    estimatedTime: { type: "number", minimum: 5, maximum: 30 },
  },
  required: [
    "scenario",
    "codeTemplate",
    "blanks",
    "hints",
    "solution",
    "difficulty",
    "estimatedTime",
  ],
  additionalProperties: false,
}

// ==================== LESSON SCHEMA ====================

export const TUTORIAL_LESSON_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: MULTI_LANGUAGE_TITLE_SCHEMA,
    type: {
      type: "string",
      enum: ["concept", "mcq", "codeblock_rearranging", "fill_in_blanks"],
    },
    content: {
      type: "object",
      description: "Lesson content - structure varies by lesson type",
      additionalProperties: true,
    },
    learningObjectives: {
      type: "array",
      items: MULTI_LANGUAGE_DESCRIPTION_SCHEMA,
      minItems: 2,
      maxItems: 4,
    },
    difficulty: { type: "number", enum: [1, 2, 3] },
    tags: {
      type: "array",
      items: { type: "string" },
    },
    order: { type: "number" },
    estimatedTime: { type: "number", minimum: 5, maximum: 45 },
  },
  required: [
    "id",
    "title",
    "type",
    "content",
    "learningObjectives",
    "difficulty",
    "tags",
    "order",
    "estimatedTime",
  ],
  additionalProperties: false,
}

// ==================== MAIN TUTORIAL SCHEMA ====================

export const PROGRAMMING_TUTORIAL_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: MULTI_LANGUAGE_TITLE_SCHEMA,
    description: MULTI_LANGUAGE_DESCRIPTION_SCHEMA,
    learningObjectives: {
      type: "array",
      items: MULTI_LANGUAGE_DESCRIPTION_SCHEMA,
      minItems: 3,
      maxItems: 6,
    },
    keyTopics: {
      type: "array",
      items: { type: "string" },
      minItems: 4,
      maxItems: 8,
    },
    difficulty: { type: "number", enum: [1, 2, 3] },
    lessons: {
      type: "array",
      items: TUTORIAL_LESSON_SCHEMA,
      minItems: 5,
      maxItems: 20,
    },
    conceptualFlow: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 10,
    },
    practicalApplications: {
      type: "array",
      items: MULTI_LANGUAGE_DESCRIPTION_SCHEMA,
      minItems: 2,
      maxItems: 5,
    },
    tags: {
      type: "array",
      items: { type: "string" },
    },
    estimatedTime: { type: "number", minimum: 30, maximum: 600 },
    prerequisites: {
      type: "array",
      items: { type: "string" },
    },
    assessmentSuggestions: {
      type: "array",
      items: { type: "string" },
    },
    mermaid_diagram: {
      type: "string",
      description:
        "Optional Mermaid diagram showing tutorial flow. Use DOUBLE QUOTES for all text labels.",
    },
  },
  required: [
    "id",
    "title",
    "description",
    "learningObjectives",
    "keyTopics",
    "difficulty",
    "lessons",
    "conceptualFlow",
    "practicalApplications",
    "tags",
    "estimatedTime",
  ],
  additionalProperties: false,
}

// ==================== SIMPLIFIED API SCHEMA ====================
// For the initial API implementation, we'll use a simpler structure

export const TUTORIAL_API_SCHEMA = {
  type: "object",
  properties: {
    title_en: { type: "string", description: "Tutorial title in English" },
    title_hi: {
      type: "string",
      description: "Tutorial title in Hindi Roman script",
    },
    title_mr: {
      type: "string",
      description: "Tutorial title in Marathi Roman script",
    },
    description_en: {
      type: "string",
      description: "Tutorial description in English",
    },
    description_hi: {
      type: "string",
      description: "Tutorial description in Hindi Roman script",
    },
    description_mr: {
      type: "string",
      description: "Tutorial description in Marathi Roman script",
    },
    learningObjectives: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 6,
    },
    keyTopics: {
      type: "array",
      items: { type: "string" },
      minItems: 4,
      maxItems: 8,
    },
    difficulty: { type: "number", enum: [1, 2, 3] },
    lessons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          type: {
            type: "string",
            enum: ["concept", "mcq", "codeblock_rearranging", "fill_in_blanks"],
          },
          content: { type: "object", additionalProperties: true },
          learningObjectives: {
            type: "array",
            items: { type: "string" },
          },
          difficulty: { type: "number", enum: [1, 2, 3] },
          estimatedTime: { type: "number", minimum: 5, maximum: 45 },
        },
        required: [
          "title",
          "type",
          "content",
          "learningObjectives",
          "difficulty",
          "estimatedTime",
        ],
        additionalProperties: false,
      },
      minItems: 5,
      maxItems: 20,
    },
    conceptualFlow: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 10,
    },
    practicalApplications: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 5,
    },
    tags: {
      type: "array",
      items: { type: "string" },
    },
    estimatedTime: { type: "number", minimum: 30, maximum: 600 },
    prerequisites: {
      type: "array",
      items: { type: "string" },
    },
    assessmentSuggestions: {
      type: "array",
      items: { type: "string" },
    },
    mermaid_diagram: {
      type: "string",
      description:
        "Optional Mermaid diagram. Use DOUBLE QUOTES for all text labels.",
    },
  },
  required: [
    "title_en",
    "title_hi",
    "title_mr",
    "description_en",
    "description_hi",
    "description_mr",
    "learningObjectives",
    "keyTopics",
    "difficulty",
    "lessons",
    "conceptualFlow",
    "practicalApplications",
    "tags",
    "estimatedTime",
  ],
  additionalProperties: false,
}
