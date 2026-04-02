import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getEntryStatus, getModerationState } from "@/lib/moderation-store";

type PrayerRequestVisibility = "private" | "group" | "public";

type PrayerRequestSharingMeta = {
  visibility: PrayerRequestVisibility;
  groupSlug?: string | null;
};

type PrayerRequestSharingMap = Record<string, PrayerRequestSharingMeta>;

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

async function getSharingMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data } = await supabase
    .from("user_command_center_preferences")
    .select("recommendation_weights")
    .eq("user_id", userId)
    .maybeSingle();

  const weights = (data?.recommendation_weights ?? {}) as {
    prayerRequestSharing?: PrayerRequestSharingMap;
  };

  return weights.prayerRequestSharing ?? {};
}

async function saveSharingMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  sharingMap: PrayerRequestSharingMap,
) {
  const { data: existing, error: existingError } = await supabase
    .from("user_command_center_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    return existingError;
  }

  const existingWeights = (existing?.recommendation_weights ?? {}) as Record<string, unknown>;

  const { error } = await supabase
    .from("user_command_center_preferences")
    .upsert(
      {
        user_id: userId,
        focus_goal: existing?.focus_goal ?? "consistency",
        recommendation_weights: {
          ...existingWeights,
          prayerRequestSharing: sharingMap,
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

  return error;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
  const scope = searchParams.get("scope");
  const groupSlugFilter = searchParams.get("groupSlug");

  try {
    const supabase = await createClient();

    if (scope === "mine") {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const profileError = await ensureUserProfile(supabase, user);
      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }

      const sharingMap = await getSharingMap(supabase, user.id);

      const { data, error } = await supabase
        .from("prayer_requests")
        .select("id,title,content,answered,updated_at,created_at,is_public")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .range(offset, offset + Math.max(limit - 1, 0));

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      const prayerRequests = (data ?? [])
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.content,
          status: item.answered ? "answered" : "active",
          updatedAt: item.updated_at ?? item.created_at,
          createdAt: item.created_at,
          isPublic: item.is_public ?? true,
          visibility:
            sharingMap[item.id]?.visibility ?? ((item.is_public ?? true) ? "public" : "private"),
          groupSlug: sharingMap[item.id]?.groupSlug ?? null,
        }))
        .filter((item) =>
          groupSlugFilter
            ? item.visibility === "group" && item.groupSlug === groupSlugFilter
            : true,
        );

      return NextResponse.json({ prayerRequests });
    }

    const { data, error } = await supabase
      .from("prayer_requests")
      .select("id,title,content,replies_count,created_at,user_profiles(full_name,email)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + Math.max(limit - 1, 0));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const moderationState = await getModerationState();
    const prayerRequests = (data ?? []).map((item) => {
      const profile = Array.isArray(item.user_profiles)
        ? item.user_profiles[0]
        : item.user_profiles;

      return {
        id: item.id,
        title: item.title,
        description: item.content,
        prayerCount: item.replies_count ?? 0,
        createdAt: item.created_at,
        user: {
          name: profile?.full_name ?? null,
          email: profile?.email ?? "unknown@example.com",
        },
      };
    }).filter((item) => getEntryStatus(moderationState, "prayers", item.id)?.status !== "hidden");

    return NextResponse.json({ prayerRequests });
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
      title,
      description,
      visibility,
      groupSlug,
    }: {
      title?: string;
      description?: string;
      visibility?: PrayerRequestVisibility;
      groupSlug?: string | null;
    } = await request.json();
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("prayer_requests")
      .insert({
        user_id: user.id,
        title,
        content: description,
        is_public: (visibility ?? "public") === "public",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const nextSharingMap = {
      ...(await getSharingMap(supabase, user.id)),
      [data.id]: {
        visibility: visibility ?? "public",
        groupSlug: visibility === "group" ? groupSlug ?? null : null,
      },
    };

    const sharingError = await saveSharingMap(supabase, user.id, nextSharingMap);
    if (sharingError) {
      return NextResponse.json({ error: sharingError.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.content,
      prayerCount: data.replies_count ?? 0,
      createdAt: data.created_at,
      status: data.answered ? "answered" : "active",
      updatedAt: data.updated_at ?? data.created_at,
      visibility: visibility ?? "public",
      groupSlug: visibility === "group" ? groupSlug ?? null : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      id,
      answered,
      visibility,
      groupSlug,
    }: {
      id?: string;
      answered?: boolean;
      visibility?: PrayerRequestVisibility;
      groupSlug?: string | null;
    } = await request.json();

    if (!id || answered === undefined) {
      return NextResponse.json(
        { error: "Prayer request id and answered state are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("prayer_requests")
      .update({
        answered,
        is_public: visibility ? visibility === "public" : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id,title,content,answered,updated_at,created_at,is_public")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (visibility) {
      const nextSharingMap = {
        ...(await getSharingMap(supabase, user.id)),
        [data.id]: {
          visibility,
          groupSlug: visibility === "group" ? groupSlug ?? null : null,
        },
      };

      const sharingError = await saveSharingMap(supabase, user.id, nextSharingMap);
      if (sharingError) {
        return NextResponse.json({ error: sharingError.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      prayerRequest: {
        id: data.id,
        title: data.title,
        description: data.content,
        status: data.answered ? "answered" : "active",
        updatedAt: data.updated_at ?? data.created_at,
        createdAt: data.created_at,
        isPublic: data.is_public ?? true,
        visibility:
          visibility ?? ((data.is_public ?? true) ? "public" : "private"),
        groupSlug: visibility === "group" ? groupSlug ?? null : null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
