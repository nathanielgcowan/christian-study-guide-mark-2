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
      console.error("Unable to upsert user profile:", profileError);
      return NextResponse.json({
        id: user.id,
        name: user.user_metadata?.full_name ?? null,
        email: user.email,
        bio: null,
        avatar: null,
        role: user.user_metadata?.role ?? "user",
        createdAt: user.created_at,
      });
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Unable to load user profile:", error);
      return NextResponse.json({
        id: user.id,
        name: user.user_metadata?.full_name ?? null,
        email: user.email,
        bio: null,
        avatar: null,
        role: user.user_metadata?.role ?? "user",
        createdAt: user.created_at,
      });
    }

    return NextResponse.json({
      id: data.id,
      name: data.full_name,
      email: data.email,
      bio: data.bio,
      avatar: data.avatar_url,
      role: data.role,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error("Unexpected /api/user/profile GET error:", error);
    return NextResponse.json(
      { error: "Unable to load profile right now." },
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

    const { name, bio, avatar } = await request.json();

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        full_name: name ?? undefined,
        bio: bio ?? undefined,
        avatar_url: avatar ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      name: data.full_name,
      email: data.email,
      bio: data.bio,
      avatar: data.avatar_url,
      role: data.role,
    });
  } catch (error) {
    console.error("Unexpected /api/user/profile PATCH error:", error);
    return NextResponse.json(
      { error: "Unable to update profile right now." },
      { status: 500 },
    );
  }
}
