import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";
import {
  type BrowserPushSubscriptionRecord,
  type EmailPreferences,
  getDefaultEmailPrefs,
} from "@/lib/notification-prefs";

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

function mergeEmailPrefs(existing: {
  visible_widgets?: { emailPreferences?: EmailPreferences } | null;
} | null | undefined) {
  return {
    ...getDefaultEmailPrefs(),
    ...(existing?.visible_widgets?.emailPreferences ?? {}),
  };
}

function normalizeSubscription(
  input: Partial<BrowserPushSubscriptionRecord> | null | undefined,
): BrowserPushSubscriptionRecord | null {
  if (
    !input?.endpoint ||
    !input.keys?.p256dh ||
    !input.keys?.auth
  ) {
    return null;
  }

  const now = new Date().toISOString();
  return {
    endpoint: input.endpoint,
    expirationTime:
      typeof input.expirationTime === "number" ? input.expirationTime : null,
    keys: {
      p256dh: input.keys.p256dh,
      auth: input.keys.auth,
    },
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incoming = (await request.json()) as Partial<BrowserPushSubscriptionRecord>;
    const subscription = normalizeSubscription(incoming);
    if (!subscription) {
      return NextResponse.json({ error: "Invalid push subscription." }, { status: 400 });
    }

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

    const currentPrefs = mergeEmailPrefs(existing as {
      visible_widgets?: { emailPreferences?: EmailPreferences } | null;
    });
    const otherSubscriptions = currentPrefs.pushSubscriptions.filter(
      (entry) => entry.endpoint !== subscription.endpoint,
    );

    const nextPrefs: EmailPreferences = {
      ...currentPrefs,
      browserPushEnabled: true,
      pushSubscriptions: [...otherSubscriptions, subscription],
    };

    const { error } = await supabase
      .from("user_command_center_preferences")
      .upsert(
        {
          user_id: user.id,
          visible_widgets: {
            ...(existing?.visible_widgets ?? {}),
            emailPreferences: nextPrefs,
          },
          focus_goal: existing?.focus_goal ?? "consistency",
          recommendation_weights: existing?.recommendation_weights ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ emailPrefs: nextPrefs });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { endpoint } = (await request.json()) as { endpoint?: string };
    if (!endpoint) {
      return NextResponse.json({ error: "Subscription endpoint is required." }, { status: 400 });
    }

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

    const currentPrefs = mergeEmailPrefs(existing as {
      visible_widgets?: { emailPreferences?: EmailPreferences } | null;
    });
    const nextSubscriptions = currentPrefs.pushSubscriptions.filter(
      (entry) => entry.endpoint !== endpoint,
    );

    const nextPrefs: EmailPreferences = {
      ...currentPrefs,
      browserPushEnabled: nextSubscriptions.length > 0,
      pushSubscriptions: nextSubscriptions,
    };

    const { error } = await supabase
      .from("user_command_center_preferences")
      .upsert(
        {
          user_id: user.id,
          visible_widgets: {
            ...(existing?.visible_widgets ?? {}),
            emailPreferences: nextPrefs,
          },
          focus_goal: existing?.focus_goal ?? "consistency",
          recommendation_weights: existing?.recommendation_weights ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ emailPrefs: nextPrefs });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
