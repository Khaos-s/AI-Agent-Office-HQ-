import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return process.env.VERCEL ? NextResponse.json({ success: false, error: "Sign-in and storage are not configured." }, { status: 503 }) : NextResponse.next();
  }
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 });
  }
  let response = NextResponse.next({ request });
  const db = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  const { data: { user } } = await db.auth.getUser();
  const publicPage = request.nextUrl.pathname === "/login" || request.nextUrl.pathname.startsWith("/auth/");
  if (!publicPage) {
    const { data: operator } = user?.email_confirmed_at
      ? await db.from("office_operators").select("email").eq("email", user.email!.toLowerCase()).maybeSingle()
      : { data: null };
    if (!operator) {
      const denied = request.nextUrl.pathname.startsWith("/api/")
        ? NextResponse.json({ success: false, error: user ? "Operator access required." : "Sign in to continue." }, { status: user ? 403 : 401 })
        : NextResponse.redirect(new URL(user ? "/login?error=access" : "/login", request.url));
      response.cookies.getAll().forEach(c => denied.cookies.set(c));
      denied.headers.set("Cache-Control", "private, no-store");
      return denied;
    }
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
