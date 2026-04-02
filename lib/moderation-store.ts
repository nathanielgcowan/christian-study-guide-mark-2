import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export type ModerationSection = "prayers" | "testimonies" | "content";
export type ModerationStatus = "approved" | "flagged" | "hidden";

export type ModerationEntry = {
  status: ModerationStatus;
  note: string;
  updatedAt: string;
  updatedBy: string;
};

export type ModerationState = Record<ModerationSection, Record<string, ModerationEntry>>;

function createModerationClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

function getDefaultState(): ModerationState {
  return {
    prayers: {},
    testimonies: {},
    content: {},
  };
}

function normalizeState(input: unknown): ModerationState {
  const fallback = getDefaultState();
  if (!input || typeof input !== "object") {
    return fallback;
  }

  const source = input as Partial<ModerationState>;
  return {
    prayers: source.prayers && typeof source.prayers === "object" ? source.prayers : {},
    testimonies:
      source.testimonies && typeof source.testimonies === "object" ? source.testimonies : {},
    content: source.content && typeof source.content === "object" ? source.content : {},
  };
}

export async function getModerationState() {
  const supabase = createModerationClient();
  if (!supabase) {
    return getDefaultState();
  }

  const { data, error } = await supabase
    .from("user_command_center_preferences")
    .select("recommendation_weights,updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    return getDefaultState();
  }

  for (const row of data ?? []) {
    const weights = (row.recommendation_weights ?? {}) as {
      globalModeration?: unknown;
    };
    if (weights.globalModeration) {
      return normalizeState(weights.globalModeration);
    }
  }

  return getDefaultState();
}

export async function persistModerationState(state: ModerationState, userId: string) {
  const supabase = createModerationClient();
  if (!supabase) {
    return { error: "Missing Supabase service role configuration." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("user_command_center_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
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
          globalModeration: state,
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

  return { error: error?.message ?? null };
}

export function getEntryStatus(
  state: ModerationState,
  section: ModerationSection,
  id: string,
) {
  return state[section][id] ?? null;
}
