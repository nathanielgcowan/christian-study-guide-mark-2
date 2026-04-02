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

async function ensureUserStreak(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { error } = await supabase.from("user_streaks").upsert(
    {
      user_id: userId,
    },
    { onConflict: "user_id" },
  );

  return error;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number.parseInt(searchParams.get("limit") ?? "10", 10);
    const limit = Math.min(Math.max(requestedLimit, 1), 180);

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    const streakSetupError = await ensureUserStreak(supabase, user.id);

    if (profileError || streakSetupError) {
      return NextResponse.json(
        { error: profileError?.message || streakSetupError?.message },
        { status: 400 },
      );
    }

    const { data: streak, error: streakError } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (streakError) {
      return NextResponse.json({ error: streakError.message }, { status: 400 });
    }

    const { data: recentStudies, error: studiesError } = await supabase
      .from("user_studies")
      .select("*")
      .eq("user_id", user.id)
      .order("read_at", { ascending: false })
      .limit(limit);

    if (studiesError) {
      return NextResponse.json({ error: studiesError.message }, { status: 400 });
    }

    return NextResponse.json({
      streak,
      recentStudies,
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

    const {
      reference,
      translation = "web",
      timeSpentMinutes = 0,
      completed = true,
    }: {
      reference: string;
      translation?: string;
      timeSpentMinutes?: number;
      completed?: boolean;
    } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    const streakSetupError = await ensureUserStreak(supabase, user.id);

    if (profileError || streakSetupError) {
      return NextResponse.json(
        { error: profileError?.message || streakSetupError?.message },
        { status: 400 },
      );
    }

    const { data: study, error: studyError } = await supabase
      .from("user_studies")
      .insert({
        user_id: user.id,
        reference,
        translation,
        time_spent_minutes: timeSpentMinutes,
        completed,
      })
      .select("*")
      .single();

    if (studyError) {
      return NextResponse.json({ error: studyError.message }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    const { data: currentStreak, error: streakFetchError } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (streakFetchError) {
      return NextResponse.json(
        { error: streakFetchError.message },
        { status: 400 },
      );
    }

    let nextCurrent = currentStreak.current_streak;
    if (currentStreak.last_read_date !== today) {
      nextCurrent =
        currentStreak.last_read_date === yesterdayString
          ? currentStreak.current_streak + 1
          : 1;
    }

    const { data: updatedStreak, error: updateError } = await supabase
      .from("user_streaks")
      .update({
        current_streak: nextCurrent,
        best_streak: Math.max(currentStreak.best_streak, nextCurrent),
        last_read_date: today,
        total_studies: currentStreak.total_studies + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        study,
        streak: updatedStreak,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
