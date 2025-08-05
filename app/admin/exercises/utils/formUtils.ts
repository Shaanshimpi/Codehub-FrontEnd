import { VALIDATION_MESSAGES } from "../constants"
import { ExerciseFormData, ValidationError } from "../types"

// Generic array manipulation utilities
export const createArrayHandlers = <T>(
  field: keyof ExerciseFormData,
  setFormData: (updater: (prev: ExerciseFormData) => ExerciseFormData) => void
) => ({
  add: (item: T) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as T[]), item],
    }))
  },

  remove: (index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as T[]).filter((_, i) => i !== index),
    }))
  },

  update: (index: number, value: T) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as T[]).map((item, i) =>
        i === index ? value : item
      ),
    }))
  },
})

// Hint-specific handlers
export const createHintHandlers = (
  lang: "en" | "hi" | "mr",
  setFormData: (updater: (prev: ExerciseFormData) => ExerciseFormData) => void
) => {
  const field = `hints_${lang}` as keyof ExerciseFormData

  return {
    update: (index: number, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as { text: string }[]).map((hint, i) =>
          i === index ? { text: value } : hint
        ),
      }))
    },

    add: () => {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as { text: string }[]), { text: "" }],
      }))
    },

    remove: (index: number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as { text: string }[]).filter(
          (_, i) => i !== index
        ),
      }))
    },
  }
}

// Auto-generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Form validation utilities
export const validateRequiredField = (
  value: string,
  fieldName: string
): ValidationError | null => {
  if (!value?.trim()) {
    return {
      field: fieldName,
      message: VALIDATION_MESSAGES.REQUIRED,
    }
  }
  return null
}

export const validateArrayMinLength = (
  array: any[],
  minLength: number,
  fieldName: string,
  message: string
): ValidationError | null => {
  const validItems = array.filter((item) =>
    typeof item === "string" ? item.trim() !== "" : item?.text?.trim() !== ""
  )

  if (validItems.length < minLength) {
    return {
      field: fieldName,
      message,
    }
  }
  return null
}

export const validateExerciseForm = (
  formData: ExerciseFormData
): ValidationError[] => {
  const errors: ValidationError[] = []

  // Required text fields
  const requiredFields = [
    { field: "title_en", message: VALIDATION_MESSAGES.TITLE_EN_REQUIRED },
    { field: "title_hi", message: VALIDATION_MESSAGES.TITLE_HI_REQUIRED },
    { field: "title_mr", message: VALIDATION_MESSAGES.TITLE_MR_REQUIRED },
    {
      field: "problem_statement_en",
      message: VALIDATION_MESSAGES.PROBLEM_STATEMENT_EN_REQUIRED,
    },
    {
      field: "solution_code",
      message: VALIDATION_MESSAGES.SOLUTION_CODE_REQUIRED,
    },
    {
      field: "boilerplate_code",
      message: VALIDATION_MESSAGES.BOILERPLATE_CODE_REQUIRED,
    },
  ]

  requiredFields.forEach(({ field, message }) => {
    const error = validateRequiredField(
      formData[field as keyof ExerciseFormData] as string,
      field
    )
    if (error) {
      errors.push({ ...error, message })
    }
  })

  // Validate arrays with minimum length requirements
  const arrayValidations = [
    {
      array: formData.learning_objectives,
      minLength: 2,
      field: "learning_objectives",
      message: VALIDATION_MESSAGES.LEARNING_OBJECTIVES_MIN,
    },
    {
      array: formData.tags,
      minLength: 3,
      field: "tags",
      message: VALIDATION_MESSAGES.TAGS_MIN,
    },
  ]

  arrayValidations.forEach(({ array, minLength, field, message }) => {
    const error = validateArrayMinLength(array, minLength, field, message)
    if (error) errors.push(error)
  })

  // Validate hints for all languages
  const hintValidations = [
    {
      hints: formData.hints_en,
      field: "hints_en",
      message: VALIDATION_MESSAGES.HINTS_EN_REQUIRED,
    },
    {
      hints: formData.hints_hi,
      field: "hints_hi",
      message: VALIDATION_MESSAGES.HINTS_HI_REQUIRED,
    },
    {
      hints: formData.hints_mr,
      field: "hints_mr",
      message: VALIDATION_MESSAGES.HINTS_MR_REQUIRED,
    },
  ]

  hintValidations.forEach(({ hints, field, message }) => {
    if (!hints[0]?.text?.trim()) {
      errors.push({ field, message })
    }
  })

  // Validate relationships
  if (!formData.programmingLanguage) {
    errors.push({
      field: "programmingLanguage",
      message: VALIDATION_MESSAGES.PROGRAMMING_LANGUAGE_REQUIRED,
    })
  }

  if (!formData.tutorial) {
    errors.push({
      field: "tutorial",
      message: VALIDATION_MESSAGES.TUTORIAL_REQUIRED,
    })
  }

  return errors
}

// Transform form data for API submission
export const transformFormDataForSubmission = (formData: ExerciseFormData) => {
  // Filter out empty items
  const validObjectives = formData.learning_objectives.filter(
    (obj) => obj.trim() !== ""
  )
  const validTags = formData.tags.filter((tag) => tag.trim() !== "")

  return {
    ...formData,
    learning_objectives:
      validObjectives.length >= 2
        ? validObjectives.map((obj) => ({ objective: obj }))
        : [
            { objective: "Default learning objective 1" },
            { objective: "Default learning objective 2" },
          ],

    tags:
      validTags.length >= 3
        ? validTags.map((tag) => ({ tag }))
        : [{ tag: "programming" }, { tag: "coding" }, { tag: "basics" }],

    hints_en: formData.hints_en.filter((hint) => hint.text.trim() !== ""),
    hints_hi: formData.hints_hi.filter((hint) => hint.text.trim() !== ""),
    hints_mr: formData.hints_mr.filter((hint) => hint.text.trim() !== ""),
  }
}

// Common input change handler
export const createInputChangeHandler =
  (
    setFormData: (updater: (prev: ExerciseFormData) => ExerciseFormData) => void
  ) =>
  (field: keyof ExerciseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
