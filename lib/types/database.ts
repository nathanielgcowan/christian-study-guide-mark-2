// Database Types

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  subscription_tier: "free" | "premium" | "church";
  role?: "user" | "admin" | "super_admin";
  tradition?:
    | "overview"
    | "protestant"
    | "baptist"
    | "reformed"
    | "non-denominational"
    | "catholic";
  created_at: string;
  updated_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  best_streak: number;
  last_read_date: string | null;
  total_studies: number;
  created_at: string;
  updated_at: string;
}

export interface UserStudy {
  id: string;
  user_id: string;
  reference: string;
  translation: "web" | "kjv" | "asv";
  read_at: string;
  time_spent_minutes: number;
  completed: boolean;
  created_at: string;
}

export interface UserNote {
  id: string;
  user_id: string;
  reference: string;
  content: string;
  note_type: "note" | "highlight" | "question";
  color: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface UserBookmark {
  id: string;
  user_id: string;
  reference: string;
  category: string | null;
  created_at: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
}
