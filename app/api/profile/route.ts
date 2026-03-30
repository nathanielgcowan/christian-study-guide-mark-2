import { NextResponse } from "next/server";
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
        email: user.email,
        name: user.user_metadata?.full_name ?? null,
        role: user.user_metadata?.role ?? "user",
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
        email: user.email,
        name: user.user_metadata?.full_name ?? null,
        role: user.user_metadata?.role ?? "user",
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected /api/profile error:", error);
    return NextResponse.json(
      { error: "Unable to load profile right now." },
      { status: 500 },
    );
  }
}
