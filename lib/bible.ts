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
