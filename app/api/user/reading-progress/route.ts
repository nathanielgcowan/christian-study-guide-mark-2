import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";
import { findBibleBook, getBibleReadingProgress, getDefaultBibleReference, SUPPORTED_TRANSLATIONS } from "@/lib/bible";

interface StoredReadingProgress {
  book?: string;
  chapter?: number;
  reference?: string;
  translation?: string;
  updatedAt?: string;
}

async function ensureUserProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>,
) {
  const { error } = await supabase.from("user_profiles").upsert(
    {
      id: user.id,
      email: user.email ?? `${user.id}@example.com`,
      full_name: user.user_metadata?.full_name ?? null,
    },
    { onConflict: "id" },
  );

  return error;
}

function normalizeStoredProgress(value: StoredReadingProgress | null | undefined) {
  const fallback = getDefaultBibleReference();
  const book = findBibleBook(value?.book ?? "")?.name ?? fallback.book;
  const canonicalBook = findBibleBook(book) ?? findBibleBook(fallback.book)!;
  const translation = SUPPORTED_TRANSLATIONS.some(
    (entry) => entry.id === value?.translation,
  )
    ? (value?.translation as string)
    : fallback.translation;
  const chapter = Math.min(
    Math.max(Number(value?.chapter ?? fallback.chapter) || fallback.chapter, 1),
    canonicalBook.chapters,
  );

  return {
    book: canonicalBook.name,
    chapter,
    reference: `${canonicalBook.name} ${chapter}`,
    translation,
    updatedAt: value?.updatedAt ?? null,
    progress: getBibleReadingProgress(canonicalBook.name, chapter),
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_command_center_preferences")
      .select("recommendation_weights")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const recommendationWeights = (data?.recommendation_weights as
      | { readingProgress?: StoredReadingProgress }
      | null
      | undefined);

    return NextResponse.json({
      readingProgress: normalizeStoredProgress(recommendationWeights?.readingProgress),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incoming = (await request.json()) as Partial<StoredReadingProgress>;
    const normalized = normalizeStoredProgress(incoming);
    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabase
      .from("user_command_center_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 400 });
    }

    const recommendationWeights = (existing?.recommendation_weights as
      | Record<string, unknown>
      | null
      | undefined) ?? {};

    const { error } = await supabase
      .from("user_command_center_preferences")
      .upsert(
        {
          user_id: user.id,
          focus_goal: existing?.focus_goal ?? "consistency",
          recommendation_weights: {
            ...recommendationWeights,
            readingProgress: {
              book: normalized.book,
              chapter: normalized.chapter,
              reference: normalized.reference,
              translation: normalized.translation,
              updatedAt: new Date().toISOString(),
            },
          },
          visible_widgets: existing?.visible_widgets ?? {
            bookmarks: true,
            prayerRequests: true,
            emailPreferences: true,
            studySummary: true,
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ readingProgress: normalized });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
