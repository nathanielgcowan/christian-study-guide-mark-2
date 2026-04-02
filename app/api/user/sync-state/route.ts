import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";

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

    const recommendationWeights = (data?.recommendation_weights ?? {}) as {
      syncedFeatures?: unknown;
    };

    return NextResponse.json({
      syncState:
        recommendationWeights.syncedFeatures ?? {
          collections: [],
          recentPassages: [],
          memoryVerses: [],
          sermonNotes: [],
          audioProgress: null,
          familyMode: null,
          updatedAt: null,
        },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incoming = (await request.json()) as {
      collections?: unknown[];
      recentPassages?: unknown[];
      memoryVerses?: unknown[];
      sermonNotes?: unknown[];
      audioProgress?: unknown;
      familyMode?: unknown;
    };

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

    const existingWeights = (existing?.recommendation_weights ?? {}) as Record<string, unknown>;
    const syncState = {
      collections: Array.isArray(incoming.collections) ? incoming.collections : [],
      recentPassages: Array.isArray(incoming.recentPassages) ? incoming.recentPassages : [],
      memoryVerses: Array.isArray(incoming.memoryVerses) ? incoming.memoryVerses : [],
      sermonNotes: Array.isArray(incoming.sermonNotes) ? incoming.sermonNotes : [],
      audioProgress:
        incoming.audioProgress && typeof incoming.audioProgress === "object"
          ? incoming.audioProgress
          : null,
      familyMode:
        incoming.familyMode && typeof incoming.familyMode === "object"
          ? incoming.familyMode
          : null,
      updatedAt: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("user_command_center_preferences")
      .upsert(
        {
          user_id: user.id,
          focus_goal: existing?.focus_goal ?? "consistency",
          recommendation_weights: {
            ...existingWeights,
            preferredTranslation:
              existingWeights.preferredTranslation ?? "web",
            dailyTargetMinutes:
              existingWeights.dailyTargetMinutes ?? 20,
            syncedFeatures: syncState,
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

    return NextResponse.json({ syncState });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
