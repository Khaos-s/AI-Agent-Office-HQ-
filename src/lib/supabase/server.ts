import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

class AccessError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

export function databaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getDatabase() {
  if (!databaseConfigured()) {
    if (process.env.VERCEL) throw new AccessError("Persistent storage is not configured.", 503);
    return null;
  }
  const jar = cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: values => values.forEach(({ name, value, options }) => jar.set(name, value, options)),
    },
  });
}

export async function requireOperator() {
  const db = getDatabase();
  if (!db) return null;
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !user) throw new AccessError("Sign in to continue.", 401);
  const { data, error: denied } = await db.from("office_operators").select("email").eq("email", user.email?.toLowerCase() ?? "").maybeSingle();
  if (denied || !data || !user.email_confirmed_at) throw new AccessError("Operator access required.", 403);
  return user;
}

export function withOperator<T extends (...args: any[]) => Promise<Response>>(handler: T) {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      await requireOperator();
      const request = args[0];
      if (databaseConfigured() && request instanceof Request && !["GET", "HEAD", "OPTIONS"].includes(request.method) && request.headers.get("origin") !== new URL(request.url).origin) {
        throw new AccessError("Invalid request origin.", 403);
      }
      const response = await handler(...args);
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    } catch (error) {
      return NextResponse.json({ success: false, error: error instanceof AccessError ? error.message : "The office service is temporarily unavailable." }, { status: error instanceof AccessError ? error.status : 503, headers: { "Cache-Control": "private, no-store" } });
    }
  };
}
