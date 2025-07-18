import { fetchCollection } from "@/lib/FetchDataPayload";
import {
  ExerciseAIData,
  Language,
  Tutorial,
} from "@/app/Learn/types/TutorialTypes";

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

export async function generateExercise(
  questionInput: string,
  selectedLanguage: string,
  difficulty: number,
  selectedModel: string,
): Promise<ExerciseAIData> {
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
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error generating exercise:", error);
    throw error;
  }
}

export async function submitExercise(exercisePayload: any): Promise<void> {
  // Replace with your actual Payload CMS API call
  const response = await fetch("/api/generate-exercise/submit-exercise", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exercisePayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit exercise: ${response.status}`);
  }
}
