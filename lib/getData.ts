import { fetchCollection } from "@/lib/FetchDataPayload";
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes";

// Re-export delete functions for convenience
export {
  deleteExercise,
  deleteMultipleExercises,
  softDeleteExercise,
  restoreExercise,
  exerciseExists,
} from "@/lib/deleteData";

// Re-export update functions for convenience
export {
  updateExercise,
  partialUpdateExercise,
  toggleExerciseLock,
  updateExerciseDifficulty,
} from "@/lib/updateData";

export async function getLanguages(): Promise<Language[]> {
  try {
    const languages = await fetchCollection("programming-languages", {
      limit: 100,
      sort: `index`,
    });
    return languages;
  } catch (err) {
    console.error("Error fetching languages:", err);
    return [];
  }
}

// Returns all languages or single language by slug
export async function getLanguageBySlug(
  langSlug?: string,
): Promise<Language | null> {
  try {
    if (!langSlug) {
      const languages = await fetchCollection("programming-languages", {
        limit: 100,
      });
      return languages;
    }

    const query = {
      slug: { equals: langSlug },
    };

    const languages = await fetchCollection("programming-languages", {
      where: query,
    });

    return languages.length > 0 ? languages[0] : null;
  } catch (error) {
    console.error("Error fetching language:", error);
    return null;
  }
}

// Get all tutorials for a specific language ID
export async function getTutorialsByLanguageId(
  languageId: string | number,
): Promise<Tutorial[]> {
  try {
    const tutorials = await fetchCollection("tutorials", {
      where: {
        programmingLanguage: { equals: languageId },
      },
      sort: "index",
      depth: 2,
    });

    return tutorials;
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return [];
  }
}

// Get a specific tutorial by slug and language
export async function getTutorialBySlug(
  tutSlug: string,
  languageId: string | number,
): Promise<Tutorial | null> {
  try {
    const query = {
      and: [
        { slug: { equals: tutSlug } },
        { programmingLanguage: { equals: languageId } },
      ],
    };

    const tutorials = await fetchCollection("tutorials", {
      where: query,
      depth: 2,
    });

    return tutorials.length > 0 ? tutorials[0] : null;
  } catch (error) {
    console.error("Error fetching tutorial:", error);
    return null;
  }
}

// Get all exercises for a specific tutorial ID
export async function getExercisesByTutorialId(
  tutorialId: string | number,
): Promise<any[]> {
  try {
    const exercises = await fetchCollection("exercises", {
      where: {
        tutorial: { equals: tutorialId },
      },
      sort: "index",
      depth: 2,
    });

    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
}

// Get all exercises for admin dashboard
export async function getAllExercises(): Promise<any[]> {
  try {
    const exercises = await fetchCollection("exercises", {
      limit: 100,
      sort: "-createdAt", // Most recent first
      depth: 2, // Include related data (programming language, tutorial)
    });

    return exercises;
  } catch (error) {
    console.error("Error fetching all exercises:", error);
    return [];
  }
}

// Get single exercise by slug and tutorial
export async function getExerciseBySlug(
  exerciseSlug: string,
  tutorialId: string | number,
): Promise<any | null> {
  try {
    const exercises = await fetchCollection("exercises", {
      where: {
        and: [
          { slug: { equals: exerciseSlug } },
          { tutorial: { equals: tutorialId } },
        ],
      },
      depth: 2,
    });

    return exercises.length > 0 ? exercises[0] : null;
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return null;
  }
}

export async function generateExercise(
  questionInput: string,
  selectedLanguage: string,
  difficulty: number,
  selectedModel: string,
  exclusions?: string,
) {
  try {
    const response = await fetch("/api/generate-exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionInput,
        selectedLanguage,
        difficulty,
        selectedModel,
        exclusions,
      }),
    });

    console.log("📡 API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "❌ API Response Error:",
        response.status,
        response.statusText,
      );
      console.error("❌ Error details:", errorText);

      let errorObj;
      try {
        errorObj = JSON.parse(errorText);
      } catch {
        errorObj = { error: errorText };
      }

      throw new Error(
        `API Error ${response.status}: ${errorObj.error || errorText}`,
      );
    }

    const data = await response.json();
    console.log("✅ Exercise generated successfully:", data);

    return data;
  } catch (error) {
    console.error("❌ Error in generateExercise:", error);

    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(`Exercise generation failed: ${error.message}`);
    } else {
      throw new Error(`Exercise generation failed: ${String(error)}`);
    }
  }
}

export async function generateTutorial(
  topic: string,
  language: string,
  difficulty: number,
  numLessons: number,
  selectedModel: string,
  focusAreas?: string,
  exclusions?: string,
  customPrompts?: {
    coreRequirements: string;
    lessonProgression: string;
    contentQuality: string;
    jsonStructure: string;
  },
) {
  try {
    const response = await fetch("/api/generate-tutorial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        language,
        difficulty,
        numLessons,
        focusAreas,
        exclusions,
        selectedModel,
        customPrompts,
      }),
    });

    console.log("📡 Tutorial API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "❌ Tutorial API Response Error:",
        response.status,
        response.statusText,
      );
      console.error("❌ Error details:", errorText);

      let errorObj;
      try {
        errorObj = JSON.parse(errorText);
      } catch {
        errorObj = { error: errorText };
      }

      throw new Error(
        `Tutorial API Error ${response.status}: ${errorObj.error || errorText}`,
      );
    }

    const data = await response.json();
    console.log("✅ Tutorial generated successfully:", data);

    // Check if the response contains an error field
    if (data.error) {
      throw new Error(`Tutorial API Error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error("❌ Error in generateTutorial:", error);

    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(`Tutorial generation failed: ${error.message}`);
    } else {
      throw new Error(`Tutorial generation failed: ${String(error)}`);
    }
  }
}
