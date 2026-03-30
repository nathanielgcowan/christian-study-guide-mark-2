import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";

interface DashboardPreferences {
  focusGoal: string;
  preferredTranslation: string;
  dailyTargetMinutes: number;
  visibleWidgets: {
    bookmarks: boolean;
    prayerRequests: boolean;
    emailPreferences: boolean;
    studySummary: boolean;
  };
}

const DEFAULT_PREFERENCES: DashboardPreferences = {
  focusGoal: "consistency",
  preferredTranslation: "web",
  dailyTargetMinutes: 20,
  visibleWidgets: {
    bookmarks: true,
    prayerRequests: true,
    emailPreferences: true,
    studySummary: true,
  },
};

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

function mergePreferences(
  record:
    | {
        focus_goal?: string | null;
        recommendation_weights?: Record<string, unknown> | null;
        visible_widgets?: Record<string, unknown> | null;
      }
    | null
    | undefined,
): DashboardPreferences {
  const recommendationWeights = record?.recommendation_weights as
    | { preferredTranslation?: string; dailyTargetMinutes?: number }
    | undefined;
  const visibleWidgets = record?.visible_widgets as
    | Partial<DashboardPreferences["visibleWidgets"]>
    | undefined;

  return {
    focusGoal: record?.focus_goal ?? DEFAULT_PREFERENCES.focusGoal,
    preferredTranslation:
      recommendationWeights?.preferredTranslation ??
      DEFAULT_PREFERENCES.preferredTranslation,
    dailyTargetMinutes:
      typeof recommendationWeights?.dailyTargetMinutes === "number"
        ? recommendationWeights.dailyTargetMinutes
        : DEFAULT_PREFERENCES.dailyTargetMinutes,
    visibleWidgets: {
      ...DEFAULT_PREFERENCES.visibleWidgets,
      ...visibleWidgets,
    },
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
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ preferences: mergePreferences(data) });
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

    const incoming = (await request.json()) as Partial<DashboardPreferences>;
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
      return NextResponse.json(
        { error: existingError.message },
        { status: 400 },
      );
    }

    const merged = {
      ...mergePreferences(existing),
      ...incoming,
      visibleWidgets: {
        ...mergePreferences(existing).visibleWidgets,
        ...incoming.visibleWidgets,
      },
    };

    const { data, error } = await supabase
      .from("user_command_center_preferences")
      .upsert(
        {
          user_id: user.id,
          focus_goal: merged.focusGoal,
          recommendation_weights: {
            preferredTranslation: merged.preferredTranslation,
            dailyTargetMinutes: merged.dailyTargetMinutes,
          },
          visible_widgets: {
            ...merged.visibleWidgets,
            emailPreferences:
              (existing?.visible_widgets as { emailPreferences?: unknown } | null)
                ?.emailPreferences ?? DEFAULT_PREFERENCES.visibleWidgets.emailPreferences,
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ preferences: mergePreferences(data) });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
