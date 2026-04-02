import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getCurrentUser, getUserProfile } from "@/lib/auth-server";
import { listContentItems } from "@/lib/content-store";
import { getEntryStatus, getModerationState, persistModerationState, type ModerationSection, type ModerationStatus } from "@/lib/moderation-store";
import { getTestimonyEntries } from "@/lib/testimony-wall";

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const profile = await getUserProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return {
      user: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user, response: null };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) {
    return auth.response;
  }

  try {
    const supabase = createAdminClient();
    const moderationState = await getModerationState();

    const { data: publicPrayers, error } = await supabase
      .from("prayer_requests")
      .select("id,title,content,created_at,replies_count,user_profiles(full_name,email)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const prayers = (publicPrayers ?? []).map((item) => {
      const profile = Array.isArray(item.user_profiles)
        ? item.user_profiles[0]
        : item.user_profiles;
      return {
        id: item.id,
        title: item.title,
        excerpt: item.content,
        createdAt: item.created_at,
        repliesCount: item.replies_count ?? 0,
        userName: profile?.full_name ?? "Unknown",
        moderation: getEntryStatus(moderationState, "prayers", item.id),
      };
    });

    const testimonies = getTestimonyEntries().map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.summary,
      author: item.author,
      scripture: item.scripture,
      moderation: getEntryStatus(moderationState, "testimonies", item.id),
    }));

    const content = listContentItems().map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      type: item.type,
      status: item.status,
      owner: item.owner,
      moderation: getEntryStatus(moderationState, "content", item.id),
    }));

    return NextResponse.json({
      prayers,
      testimonies,
      content,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) {
    return auth.response;
  }

  const {
    section,
    id,
    status,
    note,
  }: {
    section?: ModerationSection;
    id?: string;
    status?: ModerationStatus;
    note?: string;
  } = await request.json();

  if (!section || !id || !status) {
    return NextResponse.json(
      { error: "Section, id, and status are required." },
      { status: 400 },
    );
  }

  const state = await getModerationState();
  const nextState = {
    ...state,
    [section]: {
      ...state[section],
      [id]: {
        status,
        note: note?.trim() ?? "",
        updatedAt: new Date().toISOString(),
        updatedBy: auth.user.email ?? auth.user.id,
      },
    },
  };

  const persisted = await persistModerationState(nextState, auth.user.id);
  if (persisted.error) {
    return NextResponse.json({ error: persisted.error }, { status: 400 });
  }

  return NextResponse.json({ moderation: nextState[section][id] });
}
