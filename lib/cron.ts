import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { sendDailyDevotional } from "@/lib/email";
import { getDailyDevotional } from "@/lib/devotionals";
import type { EmailPreferences } from "@/lib/notification-prefs";
import { isWebPushConfigured, sendBrowserPush } from "@/lib/web-push";

type UserCommandCenterPreference = {
  user_id: string;
  visible_widgets: {
    emailPreferences?: EmailPreferences;
  } | null;
};

type UserProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
};

function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

export async function sendDailyDevotionals() {
  const devotional = getDailyDevotional(new Date().toISOString().split("T")[0]);
  if (!devotional) {
    return 0;
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Daily devotional cron skipped:", error);
    return 0;
  }

  const { data: preferenceRows, error: preferencesError } = await supabase
    .from("user_command_center_preferences")
    .select("user_id,visible_widgets");

  if (preferencesError) {
    console.error("Unable to load devotional preferences:", preferencesError);
    return 0;
  }

  const devotionalRecipients = (preferenceRows ?? [])
    .map((row) => row as UserCommandCenterPreference)
    .filter((row) => {
      const prefs = row.visible_widgets?.emailPreferences;
      return (
        prefs?.dailyDevotional &&
        (prefs.dailyDevotionalChannel === "email" ||
          prefs.dailyDevotionalChannel === "both")
      );
    });

  if (devotionalRecipients.length === 0) {
    return 0;
  }

  const userIds = devotionalRecipients.map((row) => row.user_id);
  const { data: profiles, error: profilesError } = await supabase
    .from("user_profiles")
    .select("id,email,full_name")
    .in("id", userIds);

  if (profilesError) {
    console.error("Unable to load devotional recipient profiles:", profilesError);
    return 0;
  }

  const profileMap = new Map(
    (profiles ?? []).map((profile) => {
      const row = profile as UserProfileRow;
      return [row.id, row];
    }),
  );

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  let sentCount = 0;

  for (const recipient of devotionalRecipients) {
    const profile = profileMap.get(recipient.user_id);
    const reflection = devotional.reflection[0] ?? devotional.content.trim().split("\n")[0] ?? "";
    let delivered = false;

    if (
      profile?.email &&
      (recipient.visible_widgets?.emailPreferences?.dailyDevotionalChannel === "email" ||
        recipient.visible_widgets?.emailPreferences?.dailyDevotionalChannel === "both")
    ) {
      const success = await sendDailyDevotional(profile.email, {
        title: devotional.title,
        reference: devotional.verse.reference,
        verse: devotional.verse.text,
        reflection,
        prayer: devotional.prayer,
        manageUrl: `${siteUrl}/notifications`,
      });

      if (success) {
        delivered = true;
        console.log(`Daily devotional email sent to ${profile.email}`);
      } else {
        console.error(`Failed to send devotional email to ${profile.email}`);
      }
    }

    const pushPrefs = recipient.visible_widgets?.emailPreferences;
    if (
      isWebPushConfigured() &&
      pushPrefs &&
      (pushPrefs.dailyDevotionalChannel === "browser" ||
        pushPrefs.dailyDevotionalChannel === "both") &&
      Array.isArray(pushPrefs.pushSubscriptions)
    ) {
      for (const subscription of pushPrefs.pushSubscriptions) {
        const result = await sendBrowserPush(subscription, {
          title: devotional.title,
          body: `${devotional.verse.reference} · ${reflection}`,
          url: `${siteUrl}/devotionals/daily`,
          tag: "daily-devotional",
        });

        if (result.ok) {
          delivered = true;
        } else {
          console.error(`Failed to send browser push to ${recipient.user_id}: ${result.error}`);
        }
      }
    }

    if (delivered) {
      sentCount += 1;
    }
  }

  return sentCount;
}
