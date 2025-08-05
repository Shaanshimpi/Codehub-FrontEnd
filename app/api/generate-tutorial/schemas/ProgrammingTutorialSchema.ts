export const TUTORIAL_TITLE_SCHEMA = {
  type: "string",
  description:
    "Tutorial title in clear, engaging English that describes what students will learn",
}

export const TUTORIAL_DESCRIPTION_SCHEMA = {
  type: "string",
  description:
    "Comprehensive tutorial description in English explaining what students will learn, why it's important, and what they'll be able to do after completion.",
}

export const TUTORIAL_MERMAID_SCHEMA = {
  type: "string",
  description:
    "Optional overall tutorial flow diagram in Mermaid format showing lesson progression and concept relationships. Must start with diagram type (flowchart TD, graph TD, etc.). CRITICAL: Use DOUBLE QUOTES for ALL text labels. Mathematical expressions like arr[i], if(x>0) are allowed. AVOID: [], <>, \\, ;, : in node labels.",
}

// ==================== LESSON CONTENT SCHEMAS ====================

export const CONCEPT_CONTENT_SCHEMA = {
  type: "object",
  properties: {
    explanation: {
      type: "string",
      description:
        "10 - 20 lines of Comprehensive explanation of the programming concept with clear examples and context",
    },
    keyPoints: {
      type: "array",
      items: { type: "string" },
      description:
        "3-5 key learning points that summarize the most important aspects",
      minItems: 3,
      maxItems: 5,
    },
    codeExamples: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Descriptive title for the code example",
          },
          code: {
            type: "string",
            description:
              "Complete, working PLAIN TEXT code with clear comments",
          },
          explanation: {
            type: "string",
            description: "Detailed explanation of what the code does and why",
          },
          mermaid_diagram: {
            type: "string",
            description:
              "Optional Mermaid diagram visualizing the code flow, logic, or data structure. Use DOUBLE QUOTES for all labels. use as many times as possible",
          },
        },
        required: ["title", "code", "explanation"],
        additionalProperties: false,
      },
      description: "1-3 complete code examples with explanations",
      minItems: 1,
      maxItems: 3,
    },
    practiceHints: {
      type: "array",
      items: { type: "string" },
      description:
        "Practical hints and tips for students to practice and remember the concept",
      minItems: 2,
      maxItems: 4,
    },
    mermaid: {
      type: "string",
      description:
        "Optional Mermaid diagram for concepts. Use DOUBLE QUOTES for all labels. use as many times as possible",
    },
    commonMistakes: {
      type: "array",
      items: { type: "string" },
      description: "Common student mistakes to avoid",
    },
    bestPractices: {
      type: "array",
      items: { type: "string" },
      description: "Programming best practices related to this concept",
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
          id: { type: "string", description: "Unique question identifier" },
          question: {
            type: "string",
            description: "Clear, educational question",
          },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "Option identifier (a, b, c, d)",
                },
                text: { type: "string", description: "Option text" },
                isCorrect: {
                  type: "boolean",
                  description: "Whether this option is correct",
                },
              },
              required: ["id", "text", "isCorrect"],
              additionalProperties: false,
            },
            description:
              "Exactly 4 well-crafted options with one correct answer",
            minItems: 4,
            maxItems: 4,
          },
          explanation: {
            type: "string",
            description: "Why the correct answer is right",
          },
          difficulty: {
            type: "number",
            enum: [1, 2, 3],
            description: "Question difficulty",
          },
          codeSnippet: { type: "string", description: "Optional code context" },
          mermaid_diagram: {
            type: "string",
            description:
              "Optional Mermaid diagram to visualize the code snippet or concept being tested. Use DOUBLE QUOTES for all labels.",
          },
        },
        required: ["id", "question", "options", "explanation", "difficulty"],
        additionalProperties: false,
      },
      minItems: 4,
      maxItems: 6,
    },
  },
  required: ["questions"],
  additionalProperties: false,
}

export const CODE_BLOCK_REARRANGING_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique question identifier" },
          scenario: {
            type: "string",
            description: "Problem description and setup for this question",
          },
          targetCode: {
            type: "string",
            description: "Expected final code after rearranging",
          },
          mermaid_diagram: {
            type: "string",
            description:
              "Optional Mermaid diagram showing the expected code flow or logic structure. Use DOUBLE QUOTES for all labels.",
          },
          codeBlocks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", description: "Unique block identifier" },
                content: {
                  type: "string",
                  description: "multi line Code block content",
                },
              },
              required: ["id", "content"],
              additionalProperties: false,
            },
            description: "Code blocks to be rearranged",
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
            description: "Progressive hints to guide students",
            minItems: 1,
            maxItems: 3,
          },
          difficulty: {
            type: "number",
            enum: [1, 2, 3],
            description: "Question difficulty",
          },
        },
        required: [
          "id",
          "scenario",
          "targetCode",
          "codeBlocks",
          "correctOrder",
          "hints",
          "difficulty",
        ],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 5,
    },
  },
  required: ["questions"],
  additionalProperties: false,
}

export const FILL_IN_BLANKS_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique question identifier" },
          scenario: {
            type: "string",
            description: "Problem context and setup for this question",
          },
          codeTemplate: {
            type: "string",
            description: "Code with blanks marked as {{blank_id}}",
          },
          mermaid_diagram: {
            type: "string",
            description:
              "Optional Mermaid diagram showing the code structure or flow with blanks highlighted. Use DOUBLE QUOTES for all labels.",
          },
          blanks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "Matches {{blank_id}} in template",
                },
                type: { type: "string", enum: ["text", "dropdown"] },
                correctAnswer: { type: "string" },
                options: {
                  type: "array",
                  items: { type: "string" },
                  description: "Options for dropdown type",
                },
                hint: { type: "string" },
                explanation: {
                  type: "string",
                  description: "Why this is correct",
                },
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
            description: "General hints for this question",
            minItems: 1,
            maxItems: 3,
          },
          solution: {
            type: "object",
            properties: {
              completeCode: {
                type: "string",
                description: "Final code with all blanks filled",
              },
              explanation: {
                type: "string",
                description: "Overall solution explanation",
              },
              mermaid_diagram: {
                type: "string",
                description:
                  "Optional Mermaid diagram showing the complete solution flow or structure. Use DOUBLE QUOTES for all labels.",
              },
            },
            required: ["completeCode", "explanation"],
            additionalProperties: false,
          },
          difficulty: {
            type: "number",
            enum: [1, 2, 3],
            description: "Question difficulty",
          },
        },
        required: [
          "id",
          "scenario",
          "codeTemplate",
          "blanks",
          "hints",
          "solution",
          "difficulty",
        ],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 5,
    },
  },
  required: ["questions"],
  additionalProperties: false,
}

// ==================== LESSON SCHEMA ====================

export const TUTORIAL_LESSON_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string", description: "Unique lesson identifier" },
    title: { type: "string", description: "Lesson title in English" },
    type: {
      type: "string",
      enum: ["concept", "mcq", "codeblock_rearranging", "fill_in_blanks"],
      description: "Type of lesson content",
    },
    content: {
      type: "object",
      description:
        "Lesson content structure that MUST match the lesson type exactly. For 'concept' lessons use CONCEPT_CONTENT_SCHEMA, for 'mcq' use MCQ_CONTENT_SCHEMA, for 'codeblock_rearranging' use CODE_BLOCK_REARRANGING_SCHEMA, for 'fill_in_blanks' use FILL_IN_BLANKS_SCHEMA",
      oneOf: [
        {
          description: "Content for concept lessons",
          ...CONCEPT_CONTENT_SCHEMA,
        },
        {
          description: "Content for MCQ lessons",
          ...MCQ_CONTENT_SCHEMA,
        },
        {
          description: "Content for code block rearranging lessons",
          ...CODE_BLOCK_REARRANGING_SCHEMA,
        },
        {
          description: "Content for fill in the blanks lessons",
          ...FILL_IN_BLANKS_SCHEMA,
        },
      ],
    },
    learningObjectives: {
      type: "array",
      items: { type: "string" },
      description: "2-4 specific learning objectives in English",
      minItems: 2,
      maxItems: 4,
    },
    order: { type: "number", description: "Lesson sequence order" },
  },
  required: ["id", "title", "type", "content", "learningObjectives", "order"],
  additionalProperties: false,
}

// ==================== TUTORIAL METADATA SCHEMAS ====================

export const TUTORIAL_LEARNING_OBJECTIVES_SCHEMA = {
  type: "array",
  description: "Overall tutorial learning objectives in English",
  items: { type: "string", description: "Learning objective in English" },
  minItems: 3,
  maxItems: 6,
}

export const TUTORIAL_KEY_TOPICS_SCHEMA = {
  type: "array",
  description: "Key programming topics covered in the tutorial",
  items: {
    type: "string",
    description:
      "Specific programming concept or technique. segmentation of concepts invloved sequentially",
  },
  minItems: 4,
  maxItems: 8,
}

export const TUTORIAL_PRACTICAL_APPLICATIONS_SCHEMA = {
  type: "array",
  description: "10-20 words Real-world applications in English",
  items: { type: "string", description: "Practical application description" },
  minItems: 2,
  maxItems: 5,
}

export const TUTORIAL_TAGS_SCHEMA = {
  type: "array",
  description: "Searchable tags for the tutorial",
  items: { type: "string" },
  minItems: 3,
  maxItems: 10,
}

// ==================== MAIN PROGRAMMING TUTORIAL SCHEMA ====================

export const ProgrammingTutorialSchema = {
  id: {
    type: "string",
    description: "Unique tutorial identifier",
  },
  title: TUTORIAL_TITLE_SCHEMA,
  description: TUTORIAL_DESCRIPTION_SCHEMA,
  learningObjectives: TUTORIAL_LEARNING_OBJECTIVES_SCHEMA,
  keyTopics: TUTORIAL_KEY_TOPICS_SCHEMA,
  difficulty: {
    type: "number",
    enum: [1, 2, 3],
    description:
      "Overall tutorial difficulty: 1-Beginner, 2-Intermediate, 3-Advanced",
  },
  lessons: {
    type: "array",
    items: TUTORIAL_LESSON_SCHEMA,
    description:
      "Array of tutorial lessons with varied types and progressive difficulty",
    minItems: 5,
    maxItems: 20,
  },
  practicalApplications: TUTORIAL_PRACTICAL_APPLICATIONS_SCHEMA,
  tags: TUTORIAL_TAGS_SCHEMA,
}

// ==================== LESSON CONTENT TYPE MAPPING ====================

// This mapping helps the API understand which content schema to use for each lesson type
export const LESSON_CONTENT_SCHEMA_MAP = {
  concept: CONCEPT_CONTENT_SCHEMA,
  mcq: MCQ_CONTENT_SCHEMA,
  codeblock_rearranging: CODE_BLOCK_REARRANGING_SCHEMA,
  fill_in_blanks: FILL_IN_BLANKS_SCHEMA,
}

// Complete schema with all lesson content types properly defined
export const COMPLETE_TUTORIAL_SCHEMA = {
  type: "object",
  properties: ProgrammingTutorialSchema,
  required: [
    "id",
    "title",
    "description",
    "learningObjectives",
    "keyTopics",
    "difficulty",
    "lessons",
    "practicalApplications",
    "tags",
  ],
  additionalProperties: false,
}
