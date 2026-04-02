import { NextResponse } from "next/server";
import {
  getChurchProfiles,
  persistChurchProfiles,
  updateChurchProfile,
  type ChurchProfile,
} from "@/lib/church-events";
import { getCurrentUser, getUserProfile } from "@/lib/auth-server";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const profile = await getUserProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return {
      user: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user, response: null };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) {
    return auth.response;
  }

  return NextResponse.json({ churches: await getChurchProfiles() });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) {
    return auth.response;
  }

  const {
    slug,
    name,
    city,
    state,
    tagline,
    summary,
    branding,
    announcements,
    ministryFocus,
    weeklyRhythms,
    featuredResources,
  }: Partial<ChurchProfile> & { slug?: string } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: "Church slug is required." }, { status: 400 });
  }

  const updated = updateChurchProfile(slug, {
    name,
    city,
    state,
    tagline,
    summary,
    branding,
    announcements,
    ministryFocus,
    weeklyRhythms,
    featuredResources,
  });

  if (!updated) {
    return NextResponse.json({ error: "Church profile not found." }, { status: 404 });
  }

  const churches = await getChurchProfiles();
  const persisted = await persistChurchProfiles(churches, auth.user.id);
  if (persisted.error) {
    return NextResponse.json({ error: persisted.error }, { status: 400 });
  }

  return NextResponse.json({ church: updated });
}
