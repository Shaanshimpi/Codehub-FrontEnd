// lib/updateData.ts - Update operations for admin functionality

/**
 * Update an existing exercise by ID
 * @param exerciseId - The ID of the exercise to update
 * @param updateData - The data to update the exercise with
 * @returns Promise<any> - The updated exercise data
 */
export async function updateExercise(
  exerciseId: number | string,
  updateData: any,
): Promise<any> {
  try {
    console.log(`🔄 Updating exercise with ID: ${exerciseId}`, updateData);

    // Use absolute URL in the browser
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Transform the data for API submission
    const transformedData = transformUpdateDataForAPI(updateData);

    const response = await fetch(
      `${baseUrl}/api/payload/exercises/${exerciseId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Update Exercise API Error: ${response.status} ${response.statusText}`,
      );
      console.error("❌ Error details:", errorText);

      let errorObj;
      try {
        errorObj = JSON.parse(errorText);
      } catch {
        errorObj = { error: errorText };
      }

      throw new Error(
        `Failed to update exercise: ${response.status} ${errorObj.error || errorText}`,
      );
    }

    const result = await response.json();
    console.log(`✅ Exercise ${exerciseId} updated successfully`, result);

    return result.data || result;
  } catch (error) {
    console.error(`❌ Error updating exercise ${exerciseId}:`, error);
    throw error;
  }
}

/**
 * Transform form data to API format for updating
 * @param formData - The form data from EditExerciseModal
 * @returns Transformed data suitable for API submission
 */
export function transformUpdateDataForAPI(formData: any) {
  // Filter out empty learning objectives and tags
  const validObjectives =
    formData.learning_objectives?.filter((obj: string) => obj.trim() !== "") ||
    [];

  const validTags =
    formData.tags?.filter((tag: string) => tag.trim() !== "") || [];

  // Filter out empty hints
  const validHintsEn =
    formData.hints_en?.filter(
      (hint: { text: string }) => hint.text.trim() !== "",
    ) || [];

  const validHintsHi =
    formData.hints_hi?.filter(
      (hint: { text: string }) => hint.text.trim() !== "",
    ) || [];

  const validHintsMr =
    formData.hints_mr?.filter(
      (hint: { text: string }) => hint.text.trim() !== "",
    ) || [];

  const transformedData = {
    // Basic fields
    title_en: formData.title_en,
    title_hi: formData.title_hi || "",
    title_mr: formData.title_mr || "",
    slug: formData.slug,

    // Problem statements
    problem_statement_en: formData.problem_statement_en || "",
    problem_statement_hi: formData.problem_statement_hi || "",
    problem_statement_mr: formData.problem_statement_mr || "",

    // Code fields
    boilerplate_code: formData.boilerplate_code || "",
    solution_code: formData.solution_code || "",

    // Settings
    difficultyLevel: formData.difficultyLevel || 1,
    isLocked: formData.isLocked || false,

    // Relationships (ensure they're numbers)
    programmingLanguage: Number(formData.programmingLanguage),
    tutorial: Number(formData.tutorial),

    // Transform arrays to the expected format
    learning_objectives: validObjectives.map((obj: string) => ({
      objective: obj,
    })),
    tags: validTags.map((tag: string) => ({ tag: tag })),

    // Hints
    hints_en: validHintsEn,
    hints_hi: validHintsHi,
    hints_mr: validHintsMr,
  };

  console.log("🔄 Transformed update data:", transformedData);
  return transformedData;
}

/**
 * Partial update - only update specific fields
 * @param exerciseId - The ID of the exercise to update
 * @param partialData - Only the fields to update
 * @returns Promise<any> - The updated exercise data
 */
export async function partialUpdateExercise(
  exerciseId: number | string,
  partialData: Partial<any>,
): Promise<any> {
  try {
    console.log(`🔄 Partial update for exercise ${exerciseId}:`, partialData);

    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/payload/exercises/${exerciseId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partialData),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Partial Update API Error: ${response.status} ${response.statusText}`,
      );
      console.error("❌ Error details:", errorText);

      throw new Error(
        `Failed to partially update exercise: ${response.status} ${errorText}`,
      );
    }

    const result = await response.json();
    console.log(`✅ Exercise ${exerciseId} partially updated`, result);

    return result.data || result;
  } catch (error) {
    console.error(`❌ Error partially updating exercise ${exerciseId}:`, error);
    throw error;
  }
}

/**
 * Toggle exercise lock status
 * @param exerciseId - The ID of the exercise
 * @param isLocked - New lock status
 * @returns Promise<any> - The updated exercise data
 */
export async function toggleExerciseLock(
  exerciseId: number | string,
  isLocked: boolean,
): Promise<any> {
  return partialUpdateExercise(exerciseId, { isLocked });
}

/**
 * Update exercise difficulty level
 * @param exerciseId - The ID of the exercise
 * @param difficultyLevel - New difficulty level (1-3)
 * @returns Promise<any> - The updated exercise data
 */
export async function updateExerciseDifficulty(
  exerciseId: number | string,
  difficultyLevel: number,
): Promise<any> {
  return partialUpdateExercise(exerciseId, { difficultyLevel });
}
