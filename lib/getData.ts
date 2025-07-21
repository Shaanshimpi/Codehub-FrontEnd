import { fetchCollection } from "@/lib/FetchDataPayload";
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes";

export async function getLanguages(): Promise<Language[]> {
  try {
    const languages = await fetchCollection("programming-languages", {
      limit: 100,
      sort: `index`,
    });
    console.log(languages);
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
) {
  try {
    console.log("🔄 Generating exercise with params:", {
      questionInput,
      selectedLanguage,
      difficulty,
      selectedModel,
    });

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
