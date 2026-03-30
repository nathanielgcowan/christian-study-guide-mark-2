import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getCurrentUser, getUserProfile } from "@/lib/auth-server";

type ActivityRow = {
  user_id: string;
  event_type: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  email: string;
};

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getUserProfile();
    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createAdminClient();
    const [{ data: profiles, error: profilesError }, { data: activity, error: activityError }] =
      await Promise.all([
        supabase.from("user_profiles").select("id,email"),
        supabase
          .from("user_activity")
          .select("user_id,event_type,created_at")
          .order("created_at", { ascending: false })
          .limit(2000),
      ]);

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 400 });
    }

    if (activityError) {
      return NextResponse.json({ error: activityError.message }, { status: 400 });
    }

    const profileMap = new Map(
      ((profiles ?? []) as ProfileRow[]).map((item) => [item.id, item.email]),
    );

    const metricsByUser = ((activity ?? []) as ActivityRow[]).reduce<
      Record<
        string,
        { email: string; lastActive: string; sessions: number; prayersLogged: number; pagesVisited: number }
      >
    >((acc, item) => {
      const email = profileMap.get(item.user_id);
      if (!email) {
        return acc;
      }

      const existing = acc[item.user_id] ?? {
        email,
        lastActive: item.created_at,
        sessions: 0,
        prayersLogged: 0,
        pagesVisited: 0,
      };

      if (item.created_at > existing.lastActive) {
        existing.lastActive = item.created_at;
      }

      if (
        item.event_type.includes("study") ||
        item.event_type.includes("session")
      ) {
        existing.sessions += 1;
      }

      if (item.event_type.includes("prayer")) {
        existing.prayersLogged += 1;
      }

      existing.pagesVisited += 1;
      acc[item.user_id] = existing;
      return acc;
    }, {});

    const metrics = Object.values(metricsByUser).map((item, index) => ({
      id: index + 1,
      email: item.email,
      lastActive: item.lastActive,
      sessions: item.sessions,
      prayersLogged: item.prayersLogged,
      pagesVisited: item.pagesVisited,
    }));

    return NextResponse.json({ metrics });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
