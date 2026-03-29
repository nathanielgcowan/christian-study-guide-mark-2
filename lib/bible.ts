export interface BiblePassageVerse {
  number: number;
  text: string;
}

/**
 * Fetches a passage and returns an array of verses with their numbers and text.
 * @param reference Passage reference (e.g., 'John 3:16-18')
 * @returns Array of verses with numbers and text, or null if not found
 */
export async function getPassage(
  reference: string,
): Promise<BiblePassageVerse[] | null> {
  try {
    if (!API_KEY) {
      // Mock passage for local/dev
      return [
        {
          number: 16,
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        },
        {
          number: 17,
          text: "For God did not send his Son into the world to condemn the world, but to save the world through him.",
        },
        {
          number: 18,
          text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God’s one and only Son.",
        },
      ];
    }

    // Example API endpoint for passage (update as needed for your API)
    const response = await fetch(`${BIBLE_API_URL}/passages`, {
      method: "POST",
      headers: { "api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ query: reference }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    // Adjust parsing based on actual API response structure
    if (!data.results || data.results.length === 0) return null;

    // Assume data.results[0].verses is an array of { number, text }
    if (Array.isArray(data.results[0].verses)) {
      return data.results[0].verses.map((v: any) => ({
        number: v.number,
        text: v.text,
      }));
    }

    // Fallback: try to parse a single string into verses (if needed)
    return null;
  } catch (error) {
    console.error("Bible API error (getPassage):", error);
    return null;
  }
}
export interface BibleVerse {
  reference: string;
  text: string;
  version: string;
}

const BIBLE_API_URL = "https://api.scripture.api.bible/v1";
const API_KEY = process.env.BIBLE_API_KEY || "";

export async function getVerse(reference: string): Promise<BibleVerse | null> {
  try {
    if (!API_KEY) {
      console.warn("BIBLE_API_KEY not set; returning mock verse");
      return {
        reference,
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. (John 3:16)",
        version: "NIV",
      };
    }

    const response = await fetch(`${BIBLE_API_URL}/search`, {
      headers: { "api-key": API_KEY },
      body: JSON.stringify({ query: reference }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    return {
      reference,
      text: data.results[0].text || "",
      version: "NIV",
    };
  } catch (error) {
    console.error("Bible API error:", error);
    return null;
  }
}

export async function searchVerse(query: string): Promise<BibleVerse[]> {
  try {
    if (!API_KEY) {
      return [
        {
          reference: "John 3:16",
          text: "For God so loved the world...",
          version: "NIV",
        },
      ];
    }

    const response = await fetch(`${BIBLE_API_URL}/search`, {
      headers: { "api-key": API_KEY },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (
      data.results?.map((result: any) => ({
        reference: result.reference || "",
        text: result.text || "",
        version: "NIV",
      })) || []
    );
  } catch (error) {
    console.error("Bible API error:", error);
    return [];
  }
}
