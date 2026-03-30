import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";

interface EmailPreferences {
  dailyDevotional: boolean;
  prayerUpdates: boolean;
  newsletter: boolean;
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

function getDefaultPrefs(): EmailPreferences {
  return {
    dailyDevotional: false,
    prayerUpdates: false,
    newsletter: false,
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

    const storedPrefs =
      (data?.visible_widgets as { emailPreferences?: EmailPreferences } | null)
        ?.emailPreferences ?? getDefaultPrefs();

    return NextResponse.json({ emailPrefs: storedPrefs });
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

    const incomingPrefs = (await request.json()) as Partial<EmailPreferences>;

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

    const nextPrefs: EmailPreferences = {
      ...getDefaultPrefs(),
      ...(existing?.visible_widgets as { emailPreferences?: EmailPreferences } | null)
        ?.emailPreferences,
      ...incomingPrefs,
    };

    const nextVisibleWidgets = {
      ...(existing?.visible_widgets ?? {}),
      emailPreferences: nextPrefs,
    };

    const { data, error } = await supabase
      .from("user_command_center_preferences")
      .upsert(
        {
          user_id: user.id,
          visible_widgets: nextVisibleWidgets,
          focus_goal: existing?.focus_goal ?? "consistency",
          recommendation_weights: existing?.recommendation_weights ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      emailPrefs:
        (data.visible_widgets as { emailPreferences?: EmailPreferences })
          .emailPreferences ?? nextPrefs,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
