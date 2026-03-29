import { prisma } from "@/lib/prisma";
import { sendDailyDevotional } from "@/lib/email";
import { getVerse } from "@/lib/bible";

export async function sendDailyDevotionals() {
  const usersWithDevotional = await prisma.emailPreference.findMany({
    where: { dailyDevotional: true },
    include: { user: true },
  });

  const verse = await getVerse("John 3:16");
  const reflection =
    "God's love for us is unconditional and extends to all people. Today, reflect on how this love impacts your life.";

  for (const pref of usersWithDevotional) {
    const success = await sendDailyDevotional(
      pref.user.email,
      verse?.text || "For God so loved the world...",
      reflection,
    );

    if (success) {
      console.log(`Daily devotional sent to ${pref.user.email}`);
    } else {
      console.error(`Failed to send devotional to ${pref.user.email}`);
    }
  }

  return usersWithDevotional.length;
}
