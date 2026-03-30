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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("id,title,content,replies_count,created_at,user_profiles(full_name,email)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + Math.max(limit - 1, 0));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

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
    });

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

    const { title, description, isPublic } = await request.json();
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
        is_public: isPublic ?? true,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.content,
      prayerCount: data.replies_count ?? 0,
      createdAt: data.created_at,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
