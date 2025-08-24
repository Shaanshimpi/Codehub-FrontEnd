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

export const TUTORIAL_DIAGRAM_SCHEMA = {
  type: "object",
  description:
    "Optional overall tutorial flow diagram data showing lesson progression and concept relationships.Use appropriate diagram types like activity, component, class, sequence.",
  properties: {
    type: {
      type: "string",
      enum: ["activity", "component", "class", "sequence", "flowchart"],
    },
    title: { type: "string" },
    nodes: { type: "array", items: { type: "object" } },
    connections: { type: "array", items: { type: "object" } },
  },
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
          diagram_data: {
            type: "object",
            description:
              "HIGHLY RECOMMENDED: JSON diagram data for visualizing code flow, logic, or data structure.Include this in 80% of code examples for better learning visualization.",
            properties: {
              type: {
                type: "string",
                enum: [
                  "activity",
                  "component",
                  "class",
                  "sequence",
                  "flowchart",
                ],
              },
              title: { type: "string" },
              nodes: { type: "array", items: { type: "object" } },
              connections: { type: "array", items: { type: "object" } },
            },
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
    diagram_data: {
      type: "object",
      description:
        "RECOMMENDED: Overall concept diagram data for complex topics.Include this in 70% of concept lessons to enhance understanding.",
      properties: {
        type: {
          type: "string",
          enum: ["activity", "component", "class", "sequence", "flowchart"],
        },
        title: { type: "string" },
        nodes: { type: "array", items: { type: "object" } },
        connections: { type: "array", items: { type: "object" } },
      },
    },
    commonMistakes: {
      type: "array",
      items: {
        type: "string",
        description:
          "IMPORTANT: Don't make it an object Strictly make it string",
      },
      description:
        "IMPORTANT: Common student mistakes to avoid. Include 2-4 mistakes in 80% of concept lessons for better learning outcomes.",
      minItems: 2,
      maxItems: 4,
    },
    bestPractices: {
      type: "array",
      items: { type: "string" },
      description:
        "VALUABLE: Programming best practices related to this concept. Include 2-4 practices in 75% of concept lessons.",
      minItems: 2,
      maxItems: 4,
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
          codeSnippet: {
            type: "string",
            description:
              "ENCOURAGED: Code context to make the question more practical. Include in 60% of MCQ questions for better engagement.",
          },
          diagram_data: {
            type: "object",
            description:
              "RECOMMENDED: JSON diagram data to visualize the code snippet or concept being tested.Include in 50% of MCQ questions with code snippets.",
            properties: {
              type: {
                type: "string",
                enum: [
                  "activity",
                  "component",
                  "class",
                  "sequence",
                  "flowchart",
                ],
              },
              title: { type: "string" },
              nodes: { type: "array", items: { type: "object" } },
              connections: { type: "array", items: { type: "object" } },
            },
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
          diagram_data: {
            type: "object",
            description:
              "HIGHLY VALUABLE: JSON diagram data showing the expected code flow or logic structure.Include in 70% of code rearranging questions for better visualization.",
            properties: {
              type: {
                type: "string",
                enum: [
                  "activity",
                  "component",
                  "class",
                  "sequence",
                  "flowchart",
                ],
              },
              title: { type: "string" },
              nodes: { type: "array", items: { type: "object" } },
              connections: { type: "array", items: { type: "object" } },
            },
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
          diagram_data: {
            type: "object",
            description:
              "STRONGLY RECOMMENDED: JSON diagram data showing the code structure or flow with blanks highlighted.Include in 75% of fill-in-blank questions for enhanced learning.",
            properties: {
              type: {
                type: "string",
                enum: [
                  "activity",
                  "component",
                  "class",
                  "sequence",
                  "flowchart",
                ],
              },
              title: { type: "string" },
              nodes: { type: "array", items: { type: "object" } },
              connections: { type: "array", items: { type: "object" } },
            },
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
                hint: {
                  type: "string",
                  description:
                    "HELPFUL: Specific hint for this blank. Include in 70% of blanks to guide students.",
                },
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
              diagram_data: {
                type: "object",
                description:
                  "ENCOURAGED: JSON diagram data showing the complete solution flow or structure.Include in 60% of fill-in-blank solutions for complete understanding.",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "activity",
                      "component",
                      "class",
                      "sequence",
                      "flowchart",
                    ],
                  },
                  title: { type: "string" },
                  nodes: { type: "array", items: { type: "object" } },
                  connections: { type: "array", items: { type: "object" } },
                },
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

export const TUTORIAL_REFERENCE_SCHEMA = {
  type: "object",
  description:
    "W3Schools-style comprehensive reference tutorial page teaching the complete concept",
  properties: {
    title: {
      type: "string",
      description: "Main concept title (e.g., 'If Statements', 'While Loops')",
    },
    subtitle: {
      type: "string",
      description:
        "Brief subtitle explaining what will be learned (e.g., 'Using the `if` Statement in C')",
    },
    introduction: {
      type: "string",
      description:
        "Opening paragraph explaining the concept and its importance in programming",
    },
    examples: {
      type: "array",
      description: "5-10 complete examples with full code and explanations",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description:
              "Example title (e.g., 'Basic Example: When Condition is False')",
          },
          description: {
            type: "string",
            description: "Brief description of what this example demonstrates",
          },
          code: {
            type: "string",
            description:
              "Complete, working PLAIN TEXT code example that can be executed",
          },
          explanation: {
            type: "string",
            description:
              "Detailed explanation of how the code works, referencing specific lines and outcomes",
          },
          output: {
            type: "string",
            description: "Expected output when the code is run (optional)",
          },
        },
        required: ["title", "description", "code", "explanation"],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 4,
    },
    key_points: {
      type: "array",
      description: "Important points to remember about this concept",
      items: {
        type: "string",
        description: "Key point or rule about the concept",
      },
      minItems: 3,
      maxItems: 6,
    },
    common_mistakes: {
      type: "array",
      description: "Common mistakes beginners make with this concept",
      items: {
        type: "object",
        properties: {
          mistake: {
            type: "string",
            description: "Description of the common mistake",
          },
          why_wrong: {
            type: "string",
            description: "Why this approach is incorrect",
          },
          correct_approach: {
            type: "string",
            description: "The correct way to handle this situation",
          },
        },
        required: ["mistake", "why_wrong", "correct_approach"],
        additionalProperties: false,
      },
      minItems: 2,
      maxItems: 4,
    },
    syntax_guide: {
      type: "object",
      description: "Syntax reference for the concept",
      properties: {
        basic_syntax: {
          type: "string",
          description: "Basic syntax template in plain text",
        },
        parameters: {
          type: "array",
          description: "Explanation of syntax components",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Parameter or component name",
              },
              description: {
                type: "string",
                description: "What this component does",
              },
              required: {
                type: "boolean",
                description: "Whether this component is required",
              },
            },
            required: ["name", "description", "required"],
            additionalProperties: false,
          },
        },
      },
      required: ["basic_syntax", "parameters"],
      additionalProperties: false,
    },
  },
  required: [
    "title",
    "subtitle",
    "introduction",
    "examples",
    "key_points",
    "common_mistakes",
    "syntax_guide",
  ],
  additionalProperties: false,
}

// ==================== MAIN PROGRAMMING TUTORIAL SCHEMA ====================

export const ProgrammingTutorialSchema = {
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
  reference: TUTORIAL_REFERENCE_SCHEMA,
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
    "title",
    "description",
    "learningObjectives",
    "keyTopics",
    "difficulty",
    "lessons",
    "practicalApplications",
    "tags",
    "reference",
  ],
  additionalProperties: false,
}
