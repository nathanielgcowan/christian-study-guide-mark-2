import { NextResponse } from "next/server";

function maskValue(value: string | undefined) {
  if (!value) return null;
  if (value.length <= 8) return `${value.slice(0, 2)}***`;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export async function GET() {
  const environment =
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV ??
    "unknown";

  return NextResponse.json({
    environment,
    checks: {
      NEXT_PUBLIC_SUPABASE_URL: {
        present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        preview: maskValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        preview: maskValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      },
      SUPABASE_URL: {
        present: Boolean(process.env.SUPABASE_URL),
        preview: maskValue(process.env.SUPABASE_URL),
      },
      SUPABASE_ANON_KEY: {
        present: Boolean(process.env.SUPABASE_ANON_KEY),
        preview: maskValue(process.env.SUPABASE_ANON_KEY),
      },
      NEXT_PUBLIC_GA_ID: {
        present: Boolean(process.env.NEXT_PUBLIC_GA_ID),
        preview: maskValue(process.env.NEXT_PUBLIC_GA_ID),
      },
    },
  });
}
