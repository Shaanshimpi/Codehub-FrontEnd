import type { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"

interface AIContextParams {
  tutorial: Tutorial
  lesson: any | null // Current lesson (optional)
  language: Language
  currentCode?: string
  codeOutput?: string
}

/**
 * Build AI context message from tutorial and lesson data
 * This context is prepended to chat conversations to provide
 * relevant information about the tutorial and current lesson
 */
export function buildAIContext({
  tutorial,
  lesson,
  language,
  currentCode,
  codeOutput,
}: AIContextParams): string {
  // Limits to avoid oversized prompts
  const MAX_CODE_CHARS = 8000
  const MAX_OUTPUT_CHARS = 4000
  const trim = (text: string, limit: number) =>
    text.length > limit
      ? text.slice(0, limit) + "\n/* ...truncated... */"
      : text

  let context = `You are helping a student learn "${tutorial.title}" in ${language.title}.\n\n`

  // Add tutorial-level information
  context += `Tutorial Information:\n`
  context += `- Title: ${tutorial.title}\n`
  if (tutorial.description) {
    context += `- Description: ${tutorial.description}\n`
  }
  context += `- Programming Language: ${language.title}\n`
  if (tutorial.difficulty) {
    context += `- Difficulty: ${tutorial.difficulty}\n`
  }
  if (tutorial.lessons?.length) {
    context += `- Total Lessons: ${tutorial.lessons.length}\n`
  }

  // Add learning objectives from tutorial level if available
  if (tutorial.learningConfiguration?.learningObjectives?.length) {
    context += `\nTutorial Learning Objectives:\n`
    tutorial.learningConfiguration.learningObjectives.forEach((obj, index) => {
      const objective = typeof obj === "string" ? obj : obj.objective
      context += `${index + 1}. ${objective}\n`
    })
  }

  // Add key topics from tutorial level if available
  if (tutorial.learningConfiguration?.keyTopics?.length) {
    context += `\nTutorial Key Topics:\n`
    tutorial.learningConfiguration.keyTopics.forEach((topic, index) => {
      const topicText = typeof topic === "string" ? topic : topic.topic
      context += `${index + 1}. ${topicText}\n`
    })
  }

  // Add current lesson information if available
  if (lesson) {
    context += `\n\nCurrent Lesson:\n`
    context += `- Title: ${lesson.title}\n`
    context += `- Type: ${lesson.type}\n`

    if (lesson.learningObjectives?.length) {
      context += `\nLesson Learning Objectives:\n`
      lesson.learningObjectives.forEach((obj, index) => {
        const objective = typeof obj === "string" ? obj : obj.objective
        context += `${index + 1}. ${objective}\n`
      })
    }

    if (lesson.keyTopics?.length) {
      context += `\nLesson Key Topics:\n`
      lesson.keyTopics.forEach((topic, index) => {
        const topicText = typeof topic === "string" ? topic : topic.topic
        context += `${index + 1}. ${topicText}\n`
      })
    }

    // Add lesson-specific content based on type
    if (lesson.type === "concept" && lesson.conceptData) {
      if (lesson.conceptData.explanation) {
        context += `\nLesson Explanation:\n${lesson.conceptData.explanation}\n`
      }
      if (lesson.conceptData.keyPoints?.length) {
        context += `\nKey Points:\n`
        lesson.conceptData.keyPoints.forEach((point, index) => {
          const pointText = typeof point === "string" ? point : point.point
          context += `${index + 1}. ${pointText}\n`
        })
      }
    }
  }

  // Add current code if available
  if (currentCode && currentCode.trim()) {
    context += `\n\nStudent's Current Code:\n`
    context += "```" + language.slug + "\n"
    context += trim(currentCode, MAX_CODE_CHARS)
    context += "\n```\n"
  }

  // Add code output if available
  if (codeOutput && codeOutput.trim()) {
    context += `\nCode Output:\n${trim(codeOutput, MAX_OUTPUT_CHARS)}\n`
  }

  // Instructions for AI
  context += `\n\nInstructions:\n`
  context += `- RESPONSE LENGTH: Keep responses SHORT and CONCISE (2-3 sentences) unless detailed help is required\n`
  context += `- Use LONGER responses ONLY when:\n`
  context += `  * Code has syntax errors or runtime errors - explain the mistakes and provide fixes\n`
  context += `  * Code has logic errors - explain the fault and guide toward correct logic\n`
  context += `  * Student is confused about a concept - provide clear, detailed explanation\n`
  context += `  * Student asks for detailed explanation - provide thorough response\n`
  context += `- For simple questions: Answer briefly and directly\n`
  context += `- For code errors: Identify the specific mistake, explain why it's wrong, and show the fix\n`
  context += `- For confusion: Provide clear explanation with examples if needed\n`
  context += `- Encourage learning and understanding, don't just give answers\n`
  context += `- Reference the tutorial and lesson content when relevant\n`
  context += `- Be friendly, encouraging, and patient\n`
  context += `- Default to concise responses - only expand when necessary for clarity`

  return context
}
