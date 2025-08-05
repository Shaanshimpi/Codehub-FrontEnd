// lib/deleteData.ts - Delete operations for admin functionality

/**
 * Delete a single exercise by ID
 * @param exerciseId - The ID of the exercise to delete
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function deleteExercise(
  exerciseId: number | string,
): Promise<boolean> {
  try {
    console.log(`🗑️ Deleting exercise with ID: ${exerciseId}`);

    // Use absolute URL in the browser
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/payload/exercises/${exerciseId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Delete Exercise API Error: ${response.status} ${response.statusText}`,
      );
      console.error("❌ Error details:", errorText);

      throw new Error(
        `Failed to delete exercise: ${response.status} ${response.statusText}`,
      );
    }

    console.log(`✅ Exercise ${exerciseId} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting exercise ${exerciseId}:`, error);
    throw error;
  }
}

/**
 * Delete multiple exercises by IDs
 * @param exerciseIds - Array of exercise IDs to delete
 * @returns Promise<{ successful: number[], failed: number[] }> - Results of deletion attempts
 */
export async function deleteMultipleExercises(
  exerciseIds: (number | string)[],
): Promise<{ successful: (number | string)[]; failed: (number | string)[] }> {
  console.log(`🗑️ Deleting ${exerciseIds.length} exercises:`, exerciseIds);

  const results = {
    successful: [] as (number | string)[],
    failed: [] as (number | string)[],
  };

  // Process deletions in parallel with a reasonable concurrency limit
  const BATCH_SIZE = 5;
  const batches = [];

  for (let i = 0; i < exerciseIds.length; i += BATCH_SIZE) {
    batches.push(exerciseIds.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async (exerciseId) => {
      try {
        await deleteExercise(exerciseId);
        results.successful.push(exerciseId);
        return { id: exerciseId, success: true };
      } catch (error) {
        console.error(`❌ Failed to delete exercise ${exerciseId}:`, error);
        results.failed.push(exerciseId);
        return { id: exerciseId, success: false, error };
      }
    });

    // Wait for the current batch to complete before processing the next
    await Promise.all(batchPromises);
  }

  console.log(`✅ Batch deletion completed:`);
  console.log(`   - Successful: ${results.successful.length} exercises`);
  console.log(`   - Failed: ${results.failed.length} exercises`);

  if (results.failed.length > 0) {
    console.warn("⚠️ Some exercises failed to delete:", results.failed);
  }

  return results;
}

/**
 * Soft delete an exercise (mark as deleted without removing from database)
 * This is useful for keeping audit trails
 * @param exerciseId - The ID of the exercise to soft delete
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function softDeleteExercise(
  exerciseId: number | string,
): Promise<boolean> {
  try {
    console.log(`🗑️ Soft deleting exercise with ID: ${exerciseId}`);

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
        body: JSON.stringify({
          _status: "draft", // Change status to draft (soft delete)
          deletedAt: new Date().toISOString(),
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Soft Delete Exercise API Error: ${response.status} ${response.statusText}`,
      );
      console.error("❌ Error details:", errorText);

      throw new Error(
        `Failed to soft delete exercise: ${response.status} ${response.statusText}`,
      );
    }

    console.log(`✅ Exercise ${exerciseId} soft deleted successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error soft deleting exercise ${exerciseId}:`, error);
    throw error;
  }
}

/**
 * Restore a soft-deleted exercise
 * @param exerciseId - The ID of the exercise to restore
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function restoreExercise(
  exerciseId: number | string,
): Promise<boolean> {
  try {
    console.log(`🔄 Restoring exercise with ID: ${exerciseId}`);

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
        body: JSON.stringify({
          _status: "published", // Restore to published status
          deletedAt: null, // Clear deletion timestamp
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Restore Exercise API Error: ${response.status} ${response.statusText}`,
      );
      console.error("❌ Error details:", errorText);

      throw new Error(
        `Failed to restore exercise: ${response.status} ${response.statusText}`,
      );
    }

    console.log(`✅ Exercise ${exerciseId} restored successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error restoring exercise ${exerciseId}:`, error);
    throw error;
  }
}

/**
 * Check if an exercise exists before attempting to delete
 * @param exerciseId - The ID of the exercise to check
 * @returns Promise<boolean> - True if exercise exists, false otherwise
 */
export async function exerciseExists(
  exerciseId: number | string,
): Promise<boolean> {
  try {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/payload/exercises/${exerciseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.ok;
  } catch (error) {
    console.error(`❌ Error checking if exercise ${exerciseId} exists:`, error);
    return false;
  }
}
