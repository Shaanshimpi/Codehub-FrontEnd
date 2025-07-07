import { fetchCollection } from "@/lib/FetchDataPayload";
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes";

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

// Universal fetch function
