import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";

type NoteOrganizationMeta = {
  folder: string | null;
  pinned: boolean;
};

type NoteOrganizationMap = Record<string, NoteOrganizationMeta>;

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

async function getOrganizationMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data } = await supabase
    .from("user_command_center_preferences")
    .select("recommendation_weights")
    .eq("user_id", userId)
    .maybeSingle();

  const weights = (data?.recommendation_weights ?? {}) as {
    noteOrganization?: NoteOrganizationMap;
  };

  return weights.noteOrganization ?? {};
}

async function saveOrganizationMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  organizationMap: NoteOrganizationMap,
) {
  const { data: existing, error: existingError } = await supabase
    .from("user_command_center_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    return existingError;
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
          noteOrganization: organizationMap,
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
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_notes")
      .select("*, note_tags(tag)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const organizationMap = await getOrganizationMap(supabase, user.id);
    const notes = (data ?? []).map((note) => ({
      id: note.id,
      reference: note.reference,
      content: note.content,
      noteType: note.note_type,
      color: note.color,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
      tags: Array.isArray(note.note_tags)
        ? note.note_tags.map((tag: { tag: string }) => tag.tag)
        : [],
      folder: organizationMap[note.id]?.folder ?? null,
      pinned: organizationMap[note.id]?.pinned ?? false,
    }));

    notes.sort((left, right) => {
      if (left.pinned !== right.pinned) {
        return left.pinned ? -1 : 1;
      }
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

    return NextResponse.json({ notes });
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

    const {
      reference,
      content,
      noteType,
      color,
      tags,
      folder,
      pinned,
    }: {
      reference: string;
      content: string;
      noteType?: string;
      color?: string;
      tags?: string[];
      folder?: string | null;
      pinned?: boolean;
    } = await request.json();

    if (!reference || !content) {
      return NextResponse.json(
        { error: "Reference and content are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_notes")
      .insert({
        user_id: user.id,
        reference,
        content,
        note_type: noteType ?? "note",
        color: color ?? "#f0efe9",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (tags && tags.length > 0) {
      const inserts = tags.map((tag) => ({
        note_id: data.id,
        tag,
      }));
      await supabase.from("note_tags").insert(inserts);
    }

    const organizationMap = await getOrganizationMap(supabase, user.id);
    const organizationError = await saveOrganizationMap(supabase, user.id, {
      ...organizationMap,
      [data.id]: {
        folder: folder?.trim() || null,
        pinned: Boolean(pinned),
      },
    });
    if (organizationError) {
      return NextResponse.json({ error: organizationError.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        id: data.id,
        reference: data.reference,
        content: data.content,
        noteType: data.note_type,
        color: data.color,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        tags: tags ?? [],
        folder: folder?.trim() || null,
        pinned: Boolean(pinned),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
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

    const {
      id,
      content,
      color,
      noteType,
      tags,
      folder,
      pinned,
    }: {
      id: string;
      content?: string;
      color?: string;
      noteType?: string;
      tags?: string[];
      folder?: string | null;
      pinned?: boolean;
    } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: existing, error: fetchError } = await supabase
      .from("user_notes")
      .select("id,user_id")
      .eq("id", id)
      .single();

    if (fetchError || existing.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_notes")
      .update({
        content,
        color,
        note_type: noteType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (tags !== undefined) {
      await supabase.from("note_tags").delete().eq("note_id", id);
      if (tags.length > 0) {
        await supabase.from("note_tags").insert(
          tags.map((tag) => ({
            note_id: id,
            tag,
          })),
        );
      }
    }

    const organizationMap = await getOrganizationMap(supabase, user.id);
    const nextMeta = organizationMap[id] ?? {
      folder: null,
      pinned: false,
    };
    const organizationError = await saveOrganizationMap(supabase, user.id, {
      ...organizationMap,
      [id]: {
        folder: folder !== undefined ? folder?.trim() || null : nextMeta.folder,
        pinned: pinned !== undefined ? pinned : nextMeta.pinned,
      },
    });
    if (organizationError) {
      return NextResponse.json({ error: organizationError.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      reference: data.reference,
      content: data.content,
      noteType: data.note_type,
      color: data.color,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: tags ?? [],
      folder: folder !== undefined ? folder?.trim() || null : nextMeta.folder,
      pinned: pinned !== undefined ? pinned : nextMeta.pinned,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: existing, error: fetchError } = await supabase
      .from("user_notes")
      .select("id,user_id")
      .eq("id", id)
      .single();

    if (fetchError || existing.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("user_notes").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const organizationMap = await getOrganizationMap(supabase, user.id);
    if (organizationMap[id]) {
      const nextMap = { ...organizationMap };
      delete nextMap[id];
      await saveOrganizationMap(supabase, user.id, nextMap);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
