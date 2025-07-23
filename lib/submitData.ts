// lib/getData.ts - Updated submitExercise function for separate fields

export interface ExerciseSubmissionPayload {
  // Basic fields
  index?: number;
  slug: string;

  // Code fields
  solution_code?: string;
  boilerplate_code?: string;
  mermaid_diagram?: string;

  // Learning objectives as array of objects
  learning_objectives?: Array<{
    objective: string;
  }>;

  // Tags as array of objects
  tags?: Array<{
    tag: string;
  }>;

  // Multi-language titles
  title_en: string;
  title_hi?: string;
  title_mr?: string;

  // Multi-language hints as array of objects
  hints_en?: Array<{
    text: string;
    code_snippet?: string;
  }>;
  hints_hi?: Array<{
    text: string;
    code_snippet?: string;
  }>;
  hints_mr?: Array<{
    text: string;
    code_snippet?: string;
  }>;

  // Multi-language explanations as array of objects
  explanation_en?: Array<{
    text: string;
    type: "text" | "solution_code" | "concept" | "warning" | "tip";
    code_ref?: Array<{
      ref_number: number;
    }>;
  }>;
  explanation_hi?: Array<{
    text: string;
    type: "text" | "solution_code" | "concept" | "warning" | "tip";
    code_ref?: Array<{
      ref_number: number;
    }>;
  }>;
  explanation_mr?: Array<{
    text: string;
    type: "text" | "solution_code" | "concept" | "warning" | "tip";
    code_ref?: Array<{
      ref_number: number;
    }>;
  }>;

  // Visual elements as separate array fields
  memory_states?: Array<{
    step: string;
    variables: Array<{
      name: string;
      value: string;
      type: string;
    }>;
  }>;

  execution_steps?: Array<{
    step: number;
    line: string;
    description: string;
    output: string;
  }>;

  concepts?: Array<{
    name: string;
    description: string;
    visual_metaphor: string;
  }>;

  // Relationships (as IDs)
  programmingLanguage: number;
  tutorial: number;

  // Settings
  difficultyLevel: number;
  isLocked: boolean;
}

// Helper function to transform AI data to Payload structure
const transformToPayloadFormat = (exerciseData: any) => {
  // Transform learning objectives from string array to object array
  const learning_objectives =
    exerciseData.learning_objectives?.map((obj: string) => ({
      objective: obj,
    })) || [];

  // Transform tags from string array to object array
  const tags =
    exerciseData.tags?.map((tag: string) => ({
      tag: tag,
    })) || [];

  // Transform hints arrays (they should already be in correct format from AI)
  const hints_en = exerciseData.hints_en || [];
  const hints_hi = exerciseData.hints_hi || [];
  const hints_mr = exerciseData.hints_mr || [];

  // Transform explanation arrays with code_ref conversion
  const transformExplanations = (explanations: any[]) => {
    return (
      explanations?.map((exp: any) => ({
        text: exp.text,
        type: exp.type || "text",
        code_ref:
          exp.code_ref?.map((ref: number) => ({ ref_number: ref })) || [],
      })) || []
    );
  };

  const explanation_en = transformExplanations(exerciseData.explanation_en);
  const explanation_hi = transformExplanations(exerciseData.explanation_hi);
  const explanation_mr = transformExplanations(exerciseData.explanation_mr);

  // Transform visual elements from nested object to separate arrays
  const memory_states = exerciseData.visual_elements?.memory_states || [];
  const execution_steps = exerciseData.visual_elements?.execution_steps || [];
  const concepts = exerciseData.visual_elements?.concepts || [];

  return {
    learning_objectives,
    tags,
    hints_en,
    hints_hi,
    hints_mr,
    explanation_en,
    explanation_hi,
    explanation_mr,
    memory_states,
    execution_steps,
    concepts,
  };
};

export const submitExercise = async (exerciseData: any): Promise<any> => {
  try {
    console.log("📤 Submitting exercise to Payload:", exerciseData);

    // Validate required fields
    if (!exerciseData.title_en) {
      throw new Error("English title is required");
    }

    if (!exerciseData.programmingLanguage) {
      throw new Error("Programming language is required");
    }

    if (!exerciseData.tutorial) {
      throw new Error("Tutorial selection is required");
    }

    if (!exerciseData.slug) {
      throw new Error("Slug is required");
    }

    // Transform AI data to Payload format
    const transformedData = transformToPayloadFormat(exerciseData);

    // Build the final payload
    const payloadData = {
      // Basic fields
      index: exerciseData.index || 1,
      slug: exerciseData.slug,

      // Code fields
      solution_code: exerciseData.solution_code || "",
      boilerplate_code: exerciseData.boilerplate_code || "",
      mermaid_diagram: exerciseData.mermaid_diagram || "",

      // Transformed array fields
      learning_objectives: transformedData.learning_objectives,
      tags: transformedData.tags,

      // Multi-language titles
      title_en: exerciseData.title_en,
      title_hi: exerciseData.title_hi || "",
      title_mr: exerciseData.title_mr || "",

      // Multi-language hints and explanations
      hints_en: transformedData.hints_en,
      hints_hi: transformedData.hints_hi,
      hints_mr: transformedData.hints_mr,
      explanation_en: transformedData.explanation_en,
      explanation_hi: transformedData.explanation_hi,
      explanation_mr: transformedData.explanation_mr,

      // Visual elements as separate arrays
      memory_states: transformedData.memory_states,
      execution_steps: transformedData.execution_steps,
      concepts: transformedData.concepts,

      // Relationships (ensure they're numbers)
      programmingLanguage: Number(exerciseData.programmingLanguage),
      tutorial: Number(exerciseData.tutorial),

      // Settings
      difficultyLevel: exerciseData.difficultyLevel || 1,
      isLocked: exerciseData.isLocked || false,
    };

    console.log("🔄 Transformed payload for Payload CMS:", payloadData);

    // Submit to Payload CMS via our API route
    const response = await fetch("/api/generate-exercise/submit-exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Payload API Error:", errorData);
      throw new Error(
        `Failed to submit exercise: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();
    console.log("✅ Exercise submitted successfully:", result);

    return result;
  } catch (error) {
    console.error("❌ Error in submitExercise:", error);
    throw error;
  }
};

// Alternative function that uses the direct Payload API endpoint
export const submitExerciseToPayload = async (
  exerciseData: any,
): Promise<any> => {
  try {
    // Use the Payload API URL from environment or default
    const payloadApiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "/api";

    const response = await fetch(`${payloadApiUrl}/exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add auth headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(exerciseData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to submit exercise to Payload:", error);
    throw error;
  }
};

// Utility function to validate exercise data before submission
export const validateExerciseData = (data: any): string[] => {
  const errors: string[] = [];

  if (!data.title_en) {
    errors.push("English title is required");
  }

  if (!data.slug) {
    errors.push("Slug is required");
  }

  if (!data.programmingLanguage) {
    errors.push("Programming language must be selected");
  }

  if (!data.tutorial) {
    errors.push("Tutorial must be selected");
  }

  if (!data.solution_code) {
    errors.push("Solution code is required");
  }

  if (!data.boilerplate_code) {
    errors.push("Boilerplate code is required");
  }

  return errors;
};
