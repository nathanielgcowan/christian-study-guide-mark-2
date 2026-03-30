import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const {
      currentDay,
      completed,
    }: { currentDay?: number; completed?: boolean } = await request.json();

    const updates: {
      updated_at: string;
      current_day?: number;
      completed?: boolean;
      completed_at?: string | null;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (currentDay !== undefined) {
      updates.current_day = currentDay;
    }

    if (completed !== undefined) {
      updates.completed = completed;
      updates.completed_at = completed ? new Date().toISOString() : null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_reading_plans")
      .update(updates)
      .eq("user_id", user.id)
      .eq("plan_id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ plan: data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_reading_plans")
      .delete()
      .eq("user_id", user.id)
      .eq("plan_id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
