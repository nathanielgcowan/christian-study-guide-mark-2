import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface SupabaseCookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none" | boolean;
  secure?: boolean;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/user/profile";

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: SupabaseCookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: SupabaseCookieOptions) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingProfile) {
        await supabase.from("user_profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || "",
          tradition: data.user.user_metadata?.tradition || "overview",
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
