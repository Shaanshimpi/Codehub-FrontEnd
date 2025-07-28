import { allowedHosts } from "@/utils/allowedHosts"
import type { CollectionConfig } from "payload"

const Exercise: CollectionConfig = {
  slug: "exercises",
  access: {
    read: allowedHosts,
    create: allowedHosts,
  },
  admin: {
    useAsTitle: "title_en",
    defaultColumns: [
      "title_en",
      "index",
      "programmingLanguage",
      "tutorial",
      "difficultyLevel",
      "isLocked",
    ],
    components: {
      beforeList: [
        {
          path: "src/components/Tutorials/ExerciseLanguageAndTutorialTabs",
        },
      ],
    },
  },
  defaultSort: "index",
  fields: [
    // Multi-language content tabs
    {
      type: "tabs",
      tabs: [
        {
          label: "English",
          fields: [
            {
              name: "title_en",
              label: "Title English",
              type: "text",
              required: true,
              admin: {
                description:
                  "Exercise question in brief couple of lines in English as a statement",
              },
            },
            {
              name: "hints_en",
              label: "Hints English",
              type: "array",
              required: true,
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "Clear, practical hint text. Use backticks for inline code.",
                  },
                },
                {
                  name: "code_snippet",
                  label: "Code Snippet (Optional)",
                  type: "textarea",
                  admin: {
                    description: "Optional plain text code example",
                  },
                },
              ],
            },
            {
              name: "explanation_en",
              label: "Explanation English",
              type: "array",
              required: true,
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "Explanation text starting with [1], [2], etc.",
                  },
                },
                {
                  name: "type",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Text", value: "text" },
                    { label: "Solution Code", value: "solution_code" },
                    { label: "Concept", value: "concept" },
                    { label: "Warning", value: "warning" },
                    { label: "Tip", value: "tip" },
                  ],
                  defaultValue: "text",
                  admin: {
                    description: "Type of explanation for proper formatting",
                  },
                },
                {
                  name: "code_ref",
                  label: "Code References",
                  type: "array",
                  fields: [
                    {
                      name: "ref_number",
                      type: "number",
                      required: true,
                    },
                  ],
                  admin: {
                    description:
                      "Array of comment numbers this explanation refers to",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Hindi",
          fields: [
            {
              name: "title_hi",
              label: "Title Hindi",
              type: "text",
              required: true,
              admin: {
                description:
                  "Exercise question in brief couple of lines in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script) as a statement (Roman script)",
              },
            },
            {
              name: "hints_hi",
              label: "Hints Hindi",
              type: "array",
              required: true,
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "Practical hints in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script)",
                  },
                },
                {
                  name: "code_snippet",
                  label: "Code Snippet (Optional)",
                  type: "textarea",
                  admin: {
                    description: "Optional plain text code example",
                  },
                },
              ],
            },
            {
              name: "explanation_hi",
              label: "Explanation Hindi",
              type: "array",
              required: true,
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "Detailed explanation in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script)",
                  },
                },
                {
                  name: "type",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Text", value: "text" },
                    { label: "Solution Code", value: "solution_code" },
                    { label: "Concept", value: "concept" },
                    { label: "Warning", value: "warning" },
                    { label: "Tip", value: "tip" },
                  ],
                  defaultValue: "text",
                },
                {
                  name: "code_ref",
                  label: "Code References",
                  type: "array",
                  fields: [
                    {
                      name: "ref_number",
                      type: "number",
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Marathi",
          fields: [
            {
              name: "title_mr",
              label: "Title Marathi",
              type: "text",
              required: true,
              admin: {
                description:
                  "Exercise question in brief couple of lines in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script) as a statement (Roman script)",
              },
            },
            {
              name: "hints_mr",
              label: "Hints Marathi",
              type: "array",
              required: true,
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "Practical hints in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script)",
                  },
                },
                {
                  name: "code_snippet",
                  label: "Code Snippet (Optional)",
                  type: "textarea",
                  admin: {
                    description: "Optional plain text code example",
                  },
                },
              ],
            },
            {
              name: "explanation_mr",
              label: "Explanation Marathi",
              type: "array",
              required: true,
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "Detailed explanation in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script)",
                  },
                },
                {
                  name: "type",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Text", value: "text" },
                    { label: "Solution Code", value: "solution_code" },
                    { label: "Concept", value: "concept" },
                    { label: "Warning", value: "warning" },
                    { label: "Tip", value: "tip" },
                  ],
                  defaultValue: "text",
                },
                {
                  name: "code_ref",
                  label: "Code References",
                  type: "array",
                  fields: [
                    {
                      name: "ref_number",
                      type: "number",
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // Index field (sidebar)
    {
      name: "index",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Auto-managed by drag and drop sorting",
      },
    },

    // Basic fields
    {
      name: "slug",
      type: "text",
      required: true,
    },

    // Main code fields - Both required according to schema
    {
      name: "solution_code",
      label: "Solution Code",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Complete working PLAIN TEXT code with numbered comments [1], [2], etc. NO HTML formatting - just clean, copyable code that can be executed directly. For BEGINNERS use SIMPLE algorithms without optimizations.",
      },
    },
    {
      name: "boilerplate_code",
      label: "Boilerplate Code",
      type: "textarea",
      required: true,
      admin: {
        description:
          "PLAIN TEXT starter code template for students with TODO comments and empty implementation areas. Must be clean, copyable code that can be executed directly. Should be 20%-30% part of original code for students to get started with clear guidance.",
      },
    },

    // Mermaid diagram - Required according to schema
    {
      name: "mermaid_diagram",
      label: "Mermaid Diagram",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Educational Mermaid flowchart explaining the code logic. Must start with diagram type (graph TD, flowchart TD, etc.). CRITICAL: Use DOUBLE QUOTES for ALL text labels. Mathematical expressions and simple code conditions are ALLOWED: sqrt(n), if(year%4==0), arr[i], i++. AVOID only these problematic characters: [], <>, \\, ;, : in node labels.",
      },
    },

    // Learning objectives as simple array field - matching schema structure
    {
      name: "learning_objectives",
      label: "Learning Objectives",
      type: "array",
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: "objective",
          type: "text",
          required: true,
          admin: {
            description:
              "Specific learning objective starting with action verb",
          },
        },
      ],
    },

    // Tags as simple array field - matching schema structure
    {
      name: "tags",
      label: "Programming Concept Tags",
      type: "array",
      minRows: 3,
      maxRows: 6,
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
          admin: {
            description: "Single programming concept or technique",
          },
        },
      ],
    },

    // Visual Elements tab - Required according to schema
    {
      type: "tabs",
      tabs: [
        {
          label: "Visual Elements",
          fields: [
            // Enhanced Execution Steps with Memory States - Required
            {
              name: "visual_elements",
              label: "Visual Elements",
              type: "group",
              fields: [
                {
                  name: "execution_steps",
                  label: "Execution Steps with Memory States",
                  type: "array",
                  required: true,
                  admin: {
                    description:
                      "Step-by-step execution trace with memory states - REQUIRED for all exercises",
                  },
                  fields: [
                    {
                      name: "step",
                      label: "Step Number",
                      type: "number",
                      required: true,
                      admin: {
                        description: "Sequential step number",
                      },
                    },
                    {
                      name: "line_number",
                      label: "Line Number",
                      type: "number",
                      admin: {
                        description:
                          "Line number in the code (optional for reference)",
                      },
                    },
                    {
                      name: "line",
                      label: "Code Line",
                      type: "text",
                      required: true,
                      admin: {
                        description: "Code line being executed",
                      },
                    },
                    {
                      name: "description",
                      label: "Step Description",
                      type: "textarea",
                      required: true,
                      admin: {
                        description: "What happens in this step",
                      },
                    },
                    {
                      name: "output",
                      label: "Output",
                      type: "text",
                      required: true,
                      admin: {
                        description:
                          "Any output produced (use empty string if none)",
                      },
                    },
                    {
                      name: "memory_state",
                      label: "Memory State",
                      type: "array",
                      admin: {
                        description:
                          "Current state of all variables at this execution step - REQUIRED",
                      },
                      fields: [
                        {
                          name: "name",
                          label: "Variable Name",
                          type: "text",
                          required: true,
                        },
                        {
                          name: "value",
                          label: "Variable Value",
                          type: "text",
                          required: true,
                          admin: {
                            description: "Current value of the variable",
                          },
                        },
                        {
                          name: "type",
                          label: "Data Type",
                          type: "text",
                          required: true,
                          admin: {
                            description: "Data type",
                          },
                        },
                        {
                          name: "changed",
                          label: "Changed in this step",
                          type: "checkbox",
                          defaultValue: false,
                          admin: {
                            description:
                              "Whether this variable changed in this step",
                          },
                        },
                      ],
                    },
                  ],
                },
                // Programming Concepts - Required
                {
                  name: "concepts",
                  label: "Key Programming Concepts",
                  type: "array",
                  required: true,
                  admin: {
                    description:
                      "Key programming concepts demonstrated - REQUIRED",
                  },
                  fields: [
                    {
                      name: "name",
                      label: "Concept Name",
                      type: "text",
                      required: true,
                    },
                    {
                      name: "description",
                      label: "Description",
                      type: "textarea",
                      required: true,
                      admin: {
                        description: "Clear explanation of the concept",
                      },
                    },
                    {
                      name: "visual_metaphor",
                      label: "Visual Metaphor",
                      type: "textarea",
                      required: true,
                      admin: {
                        description: "Real-world analogy or metaphor",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // Sidebar fields
    {
      name: "difficultyLevel",
      label: "Difficulty Level",
      type: "number",
      min: 1,
      max: 5,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "programmingLanguage",
      type: "relationship",
      relationTo: "programming-languages",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tutorial",
      type: "relationship",
      relationTo: "tutorials",
      required: true,
      admin: {
        position: "sidebar",
        condition: (data) => Boolean(data.programmingLanguage),
      },
      filterOptions: ({ data }) => ({
        programmingLanguage: {
          equals: data?.programmingLanguage,
        },
      }),
    },
    {
      name: "isLocked",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
      },
    },
  ],

  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        const errors = []

        // Validate required multi-language fields
        if (!data.title_en?.trim()) {
          errors.push({
            path: "title_en",
            message: "English title is required and cannot be empty",
          })
        }
        if (!data.title_hi?.trim()) {
          errors.push({
            path: "title_hi",
            message: "Hindi title is required and cannot be empty",
          })
        }
        if (!data.title_mr?.trim()) {
          errors.push({
            path: "title_mr",
            message: "Marathi title is required and cannot be empty",
          })
        }

        // Validate slug
        if (!data.slug?.trim()) {
          errors.push({
            path: "slug",
            message: "Slug is required and cannot be empty",
          })
        }

        // Validate code fields
        if (!data.solution_code?.trim()) {
          errors.push({
            path: "solution_code",
            message: "Solution code is required and cannot be empty",
          })
        }
        if (!data.boilerplate_code?.trim()) {
          errors.push({
            path: "boilerplate_code",
            message: "Boilerplate code is required and cannot be empty",
          })
        }
        if (!data.mermaid_diagram?.trim()) {
          errors.push({
            path: "mermaid_diagram",
            message: "Mermaid diagram is required and cannot be empty",
          })
        }

        // Validate learning objectives
        if (
          !data.learning_objectives ||
          !Array.isArray(data.learning_objectives)
        ) {
          errors.push({
            path: "learning_objectives",
            message: "Learning objectives array is required",
          })
        } else if (data.learning_objectives.length < 2) {
          errors.push({
            path: "learning_objectives",
            message: "At least 2 learning objectives are required",
          })
        } else {
          data.learning_objectives.forEach((obj, index) => {
            if (!obj.objective?.trim()) {
              errors.push({
                path: `learning_objectives.${index}.objective`,
                message: `Learning objective ${index + 1} cannot be empty`,
              })
            }
          })
        }

        // Validate tags
        if (!data.tags || !Array.isArray(data.tags)) {
          errors.push({
            path: "tags",
            message: "Programming tags array is required",
          })
        } else if (data.tags.length < 3) {
          errors.push({
            path: "tags",
            message: "At least 3 programming tags are required",
          })
        } else {
          data.tags.forEach((tagObj, index) => {
            if (!tagObj.tag?.trim()) {
              errors.push({
                path: `tags.${index}.tag`,
                message: `Programming tag ${index + 1} cannot be empty`,
              })
            }
          })
        }

        // Validate hints for all languages
        const languages = ["en", "hi", "mr"]
        languages.forEach((lang) => {
          const hintsField = `hints_${lang}`
          if (!data[hintsField] || !Array.isArray(data[hintsField])) {
            errors.push({
              path: hintsField,
              message: `Hints in ${lang.toUpperCase()} are required`,
            })
          } else if (data[hintsField].length === 0) {
            errors.push({
              path: hintsField,
              message: `At least 1 hint in ${lang.toUpperCase()} is required`,
            })
          } else {
            data[hintsField].forEach((hint, index) => {
              if (!hint.text?.trim()) {
                errors.push({
                  path: `${hintsField}.${index}.text`,
                  message: `Hint ${index + 1} text in ${lang.toUpperCase()} cannot be empty`,
                })
              }
            })
          }
        })

        // Validate explanations for all languages
        languages.forEach((lang) => {
          const explanationField = `explanation_${lang}`
          if (
            !data[explanationField] ||
            !Array.isArray(data[explanationField])
          ) {
            errors.push({
              path: explanationField,
              message: `Explanations in ${lang.toUpperCase()} are required`,
            })
          } else if (data[explanationField].length === 0) {
            errors.push({
              path: explanationField,
              message: `At least 1 explanation in ${lang.toUpperCase()} is required`,
            })
          } else {
            data[explanationField].forEach((explanation, index) => {
              if (!explanation.text?.trim()) {
                errors.push({
                  path: `${explanationField}.${index}.text`,
                  message: `Explanation ${index + 1} text in ${lang.toUpperCase()} cannot be empty`,
                })
              }
              if (!explanation.type) {
                errors.push({
                  path: `${explanationField}.${index}.type`,
                  message: `Explanation ${index + 1} type in ${lang.toUpperCase()} is required`,
                })
              }
            })
          }
        })

        // Validate visual elements
        if (!data.visual_elements) {
          errors.push({
            path: "visual_elements",
            message: "Visual elements are required",
          })
        } else {
          // Validate execution steps
          if (
            !data.visual_elements.execution_steps ||
            !Array.isArray(data.visual_elements.execution_steps)
          ) {
            errors.push({
              path: "visual_elements.execution_steps",
              message: "Execution steps are required",
            })
          } else if (data.visual_elements.execution_steps.length === 0) {
            errors.push({
              path: "visual_elements.execution_steps",
              message: "At least 1 execution step is required",
            })
          } else {
            data.visual_elements.execution_steps.forEach((step, index) => {
              if (!step.line?.trim()) {
                errors.push({
                  path: `visual_elements.execution_steps.${index}.line`,
                  message: `Execution step ${index + 1} code line cannot be empty`,
                })
              }
              if (!step.description?.trim()) {
                errors.push({
                  path: `visual_elements.execution_steps.${index}.description`,
                  message: `Execution step ${index + 1} description cannot be empty`,
                })
              }
              if (step.output === undefined || step.output === null) {
                errors.push({
                  path: `visual_elements.execution_steps.${index}.output`,
                  message: `Execution step ${index + 1} output is required (use empty string if no output)`,
                })
              }
              if (!Array.isArray(step.memory_state)) {
                errors.push({
                  path: `visual_elements.execution_steps.${index}.memory_state`,
                  message: `Execution step ${index + 1} memory state must be an array`,
                })
              } else {
                step.memory_state.forEach((variable, varIndex) => {
                  if (!variable.name?.trim()) {
                    errors.push({
                      path: `visual_elements.execution_steps.${index}.memory_state.${varIndex}.name`,
                      message: `Variable name in step ${index + 1} cannot be empty`,
                    })
                  }
                  if (
                    variable.value === undefined ||
                    variable.value === null ||
                    variable.value === ""
                  ) {
                    errors.push({
                      path: `visual_elements.execution_steps.${index}.memory_state.${varIndex}.value`,
                      message: `Variable value in step ${index + 1} is required`,
                    })
                  }
                  if (!variable.type?.trim()) {
                    errors.push({
                      path: `visual_elements.execution_steps.${index}.memory_state.${varIndex}.type`,
                      message: `Variable type in step ${index + 1} cannot be empty`,
                    })
                  }
                })
              }
            })
          }

          // Validate concepts
          if (
            !data.visual_elements.concepts ||
            !Array.isArray(data.visual_elements.concepts)
          ) {
            errors.push({
              path: "visual_elements.concepts",
              message: "Programming concepts are required",
            })
          } else if (data.visual_elements.concepts.length === 0) {
            errors.push({
              path: "visual_elements.concepts",
              message: "At least 1 programming concept is required",
            })
          } else {
            data.visual_elements.concepts.forEach((concept, index) => {
              if (!concept.name?.trim()) {
                errors.push({
                  path: `visual_elements.concepts.${index}.name`,
                  message: `Concept ${index + 1} name cannot be empty`,
                })
              }
              if (!concept.description?.trim()) {
                errors.push({
                  path: `visual_elements.concepts.${index}.description`,
                  message: `Concept ${index + 1} description cannot be empty`,
                })
              }
              if (!concept.visual_metaphor?.trim()) {
                errors.push({
                  path: `visual_elements.concepts.${index}.visual_metaphor`,
                  message: `Concept ${index + 1} visual metaphor cannot be empty`,
                })
              }
            })
          }
        }

        // Validate relationships
        if (!data.programmingLanguage) {
          errors.push({
            path: "programmingLanguage",
            message: "Programming language is required",
          })
        }
        if (!data.tutorial) {
          errors.push({ path: "tutorial", message: "Tutorial is required" })
        }

        // Validate difficulty level
        if (
          !data.difficultyLevel ||
          data.difficultyLevel < 1 ||
          data.difficultyLevel > 5
        ) {
          errors.push({
            path: "difficultyLevel",
            message: "Difficulty level must be between 1 and 5",
          })
        }

        // If there are validation errors, throw them
        if (errors.length > 0) {
          throw new Error(
            JSON.stringify({
              message: "Validation failed",
              errors: errors,
            })
          )
        }

        return data
      },
    ],
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === "create") {
          const existingDocs = await req.payload.find({
            collection: "exercises",
            where: {
              and: [
                {
                  programmingLanguage: {
                    equals: data.programmingLanguage,
                  },
                },
                {
                  tutorial: {
                    equals: data.tutorial,
                  },
                },
              ],
            },
            sort: "-index",
            limit: 1,
          })

          const lastDoc = existingDocs.docs[0]
          data.index =
            lastDoc && typeof lastDoc.index === "number" ? lastDoc.index + 1 : 1
        }
        return data
      },
    ],
  },
}

export default Exercise
