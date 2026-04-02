import { getEntryStatus, getModerationState } from "@/lib/moderation-store";
import { getTestimonyEntries } from "@/lib/testimony-wall";
import TestimoniesClient from "./TestimoniesClient";

export default async function TestimoniesPage() {
  const moderationState = await getModerationState();
  const featuredEntries = getTestimonyEntries().filter(
    (entry) => getEntryStatus(moderationState, "testimonies", entry.id)?.status !== "hidden",
  );

  return <TestimoniesClient featuredEntries={featuredEntries} />;
}
