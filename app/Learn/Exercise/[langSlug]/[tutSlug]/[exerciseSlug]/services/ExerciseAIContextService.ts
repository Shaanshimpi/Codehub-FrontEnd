interface ExerciseAIContextParams {
  exercise: any
  language: any
  tutorial?: any
  currentCode?: string
  codeOutput?: string
  testResults?: any
  viewType: "problem" | "solution"
}

/**
 * Build AI context message from exercise data
 * This context is prepended to chat conversations to provide
 * relevant information about the exercise, code, and current state
 */
export function buildExerciseAIContext({
  exercise,
  language,
  tutorial,
  currentCode,
  codeOutput,
  testResults,
  viewType,
}: ExerciseAIContextParams): string {
  // Limits to avoid oversized prompts
  const MAX_CODE_CHARS = 8000
  const MAX_OUTPUT_CHARS = 4000
  const trim = (text: string, limit: number) =>
    text.length > limit
      ? text.slice(0, limit) + "\n/* ...truncated... */"
      : text

  let context = `You are helping a student ${viewType === "problem" ? "solve" : "understand"} an exercise "${exercise?.title || "Exercise"}" in ${language?.title || "programming"}.\n\n`

  // Add exercise information
  context += `Exercise Information:\n`
  context += `- Title: ${exercise?.title || "Unknown"}\n`
  if (exercise?.description) {
    context += `- Description: ${exercise.description}\n`
  }
  if (exercise?.difficulty) {
    context += `- Difficulty: ${exercise.difficulty}\n`
  }
  context += `- Programming Language: ${language?.title || "Unknown"}\n`

  // Add problem statement if available
  if (exercise?.problem_statement) {
    context += `\nProblem Statement:\n${exercise.problem_statement}\n`
  }

  // Add constraints if available
  if (exercise?.constraints) {
    context += `\nConstraints:\n${exercise.constraints}\n`
  }

  // Add input/output format if available
  if (exercise?.input_format) {
    context += `\nInput Format:\n${exercise.input_format}\n`
  }
  if (exercise?.output_format) {
    context += `\nOutput Format:\n${exercise.output_format}\n`
  }

  // Add hints if in problem view
  if (viewType === "problem" && exercise?.hints) {
    context += `\nHints (for reference, guide student toward these):\n`
    if (Array.isArray(exercise.hints)) {
      exercise.hints.forEach((hint: any, index: number) => {
        const hintText =
          typeof hint === "string" ? hint : hint.hint || hint.text
        context += `${index + 1}. ${hintText}\n`
      })
    } else {
      context += `${exercise.hints}\n`
    }
  }

  // Add solution explanation if in solution view
  if (viewType === "solution" && exercise?.explanation) {
    context += `\nSolution Explanation:\n${exercise.explanation}\n`
  }

  // Add key concepts if in solution view
  if (viewType === "solution" && exercise?.visual_elements?.concepts) {
    context += `\nKey Concepts:\n`
    exercise.visual_elements.concepts.forEach((concept: any, index: number) => {
      const conceptText =
        typeof concept === "string" ? concept : concept.concept || concept.name
      context += `${index + 1}. ${conceptText}\n`
    })
  }

  // Add learning objectives if available
  if (exercise?.learning_objectives) {
    context += `\nLearning Objectives:\n`
    if (Array.isArray(exercise.learning_objectives)) {
      exercise.learning_objectives.forEach((obj: any, index: number) => {
        const objective =
          typeof obj === "string" ? obj : obj.objective || obj.text
        context += `${index + 1}. ${objective}\n`
      })
    } else {
      context += `${exercise.learning_objectives}\n`
    }
  }

  // Add test cases if available
  if (exercise?.test_cases && Array.isArray(exercise.test_cases)) {
    context += `\nTest Cases:\n`
    exercise.test_cases.slice(0, 5).forEach((testCase: any, index: number) => {
      context += `Test ${index + 1}:\n`
      if (testCase.input) context += `  Input: ${testCase.input}\n`
      if (testCase.output) context += `  Expected Output: ${testCase.output}\n`
      if (testCase.description)
        context += `  Description: ${testCase.description}\n`
    })
    if (exercise.test_cases.length > 5) {
      context += `... and ${exercise.test_cases.length - 5} more test cases\n`
    }
  }

  // Add current code if available (trimmed to prevent oversized prompts)
  if (currentCode && currentCode.trim()) {
    context += `\n\nStudent's Current Code:\n`
    context += "```" + (language?.slug || "") + "\n"
    context += trim(currentCode, MAX_CODE_CHARS)
    context += "\n```\n"
  }

  // Add code output if available (trimmed)
  if (codeOutput && codeOutput.trim()) {
    context += `\nCode Output:\n${trim(codeOutput, MAX_OUTPUT_CHARS)}\n`
  }

  // Phase 2 & 3: Add test results if available (with detailed analysis)
  if (testResults) {
    context += `\nTest Results:\n`
    if (testResults.passed !== undefined && testResults.total !== undefined) {
      const passRate = ((testResults.passed / testResults.total) * 100).toFixed(
        1
      )
      context += `- Passed: ${testResults.passed}/${testResults.total} (${passRate}%)\n`

      // Phase 3: Exercise State Awareness
      if (testResults.passed === testResults.total) {
        context += `- Status: All tests passed! ✅\n`
      } else if (testResults.passed === 0) {
        context += `- Status: All tests failed ❌\n`
      } else {
        context += `- Status: Partial success (${testResults.total - testResults.passed} failed)\n`
      }
    }
    if (testResults.failedTests && Array.isArray(testResults.failedTests)) {
      context += `- Failed Tests:\n`
      testResults.failedTests
        .slice(0, 5)
        .forEach((test: any, index: number) => {
          context += `  ${index + 1}. ${test.name || `Test ${index + 1}`}\n`
          if (test.input) context += `     Input: ${test.input}\n`
          if (test.expected) context += `     Expected: ${test.expected}\n`
          if (test.actual) context += `     Got: ${test.actual}\n`
          if (test.error) context += `     Error: ${test.error}\n`
        })
      if (testResults.failedTests.length > 5) {
        context += `  ... and ${testResults.failedTests.length - 5} more failed tests\n`
      }
    }
  }

  // Phase 3: Code State Analysis
  if (currentCode && currentCode.trim()) {
    const codeLength = currentCode.length
    const codeLines = currentCode.split("\n").length

    // Simple code state detection
    if (codeLength < 50) {
      context += `\nCode State: Just starting (very short code)\n`
    } else if (codeLength < 200) {
      context += `\nCode State: Partial implementation (${codeLines} lines)\n`
    } else {
      context += `\nCode State: Substantial implementation (${codeLines} lines)\n`
    }

    // Detect common patterns that might indicate issues
    if (
      codeOutput &&
      codeOutput.includes("Error") &&
      !codeOutput.includes("Execution time")
    ) {
      context += `\nExecution State: Error detected in output\n`
    } else if (codeOutput && codeOutput.trim() && !codeOutput.includes("❌")) {
      context += `\nExecution State: Code executed successfully\n`
    }
  } else {
    context += `\nCode State: No code written yet\n`
  }

  // Phase 2 & 3: Instructions for AI based on view type and state
  context += `\n\nInstructions:\n`
  context += `- RESPONSE LENGTH: Keep responses SHORT and CONCISE (2-3 sentences) unless detailed help is required\n`
  context += `- Use LONGER responses ONLY when:\n`
  context += `  * Code has syntax errors or runtime errors - explain the mistakes and provide fixes\n`
  context += `  * Code has logic errors - explain the fault and guide toward correct logic\n`
  context += `  * Test cases are failing - identify why tests fail and guide toward solution\n`
  context += `  * Student is confused about the problem - provide clear, detailed explanation\n`
  context += `  * Student asks for detailed explanation - provide thorough response\n`
  context += `- For simple questions: Answer briefly and directly\n`
  context += `- For code errors: Identify the specific mistake, explain why it's wrong, and show the fix\n`
  context += `- For failing tests: Explain what's wrong and guide toward the correct approach\n`
  context += `- For confusion: Provide clear explanation with examples if needed\n`
  context += `- Default to concise responses - only expand when necessary for clarity\n`

  if (viewType === "problem") {
    context += `\n- Problem View Specific:\n`
    context += `  * Help the student solve the exercise through guidance and hints\n`
    context += `  * Provide hints and guidance, but DON'T give complete solutions\n`
    context += `  * If code has syntax errors, explain them clearly and show fixes\n`
    context += `  * If code has logic errors, guide toward the correct approach without giving the answer\n`
    context += `  * If test cases are failing, explain why and guide toward fixing them\n`
    context += `  * If no code exists, help them understand the problem and get started (briefly)\n`
    context += `  * Adapt your response based on the code state (empty, partial, complete) and execution results\n`
  } else {
    context += `\n- Solution View Specific:\n`
    context += `  * Help the student understand the solution and learn from it\n`
    context += `  * Explain the approach, algorithm, and key concepts (briefly unless asked for detail)\n`
    context += `  * Clarify why the solution works and how it addresses the problem\n`
    context += `  * If asked about alternatives, discuss trade-offs briefly\n`
    context += `  * Be clear and educational, but keep responses concise unless detail is needed\n`
  }

  context += `\n- General:\n`
  context += `  * Encourage learning and understanding, don't just give answers\n`
  context += `  * Be friendly, encouraging, and patient\n`
  context += `  * Remember: Short responses by default, detailed only when required`

  return context
}
