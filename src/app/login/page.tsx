"use client";

import { useEffect, useState } from "react";
import { browserDatabase } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) setMessage(error === "access" ? "This account is not an authorized operator." : "This confirmation link could not be completed. Try signing in, or request a new confirmation email.");
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const db = browserDatabase();
      const result = mode === "login"
        ? await db.auth.signInWithPassword({ email, password })
        : await db.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (result.error) throw result.error;
      if (!result.data.session) { setMessage("Check your email to confirm your account, then sign in here."); return; }
      const { data, error } = await db.from("office_operators").select("email").eq("email", result.data.user!.email!.toLowerCase()).maybeSingle();
      if (error || !data) { await db.auth.signOut(); setMessage("This account is not an authorized operator."); return; }
      window.location.assign("/");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Sign-in failed. Please try again."); }
    finally { setBusy(false); }
  }

  return <main className="flex min-h-[100dvh] items-center justify-center bg-[#10262b] p-6">
    <section className="w-full max-w-md rounded-2xl border border-white/15 bg-[#132d34] p-8 shadow-2xl">
      <p className="text-xs uppercase tracking-[.2em] text-emerald-200">EasyUp / Agent Office</p>
      <h1 className="mt-4 text-2xl font-semibold">{mode === "login" ? "Welcome back, operator." : "Create your operator account."}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">Your office, shared memory, and approval history stay private. Access is limited to authorized operator emails.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm">Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 block h-11 w-full rounded-lg border border-white/20 bg-[#0b2027] px-3" /></label>
        <label className="block text-sm">Password<input required minLength={mode === "register" ? 12 : 1} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={e => setPassword(e.target.value)} className="mt-2 block h-11 w-full rounded-lg border border-white/20 bg-[#0b2027] px-3" /></label>
        {mode === "register" && <p className="text-xs text-slate-300">Use at least 12 characters. Confirm your email before signing in.</p>}
        {message && <p role="status" className="text-sm text-amber-200">{message}</p>}
        <button disabled={busy} className="h-11 w-full rounded-lg bg-emerald-200 font-semibold text-[#132d34] disabled:opacity-50">{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
      </form>
      <button className="mt-4 min-h-11 text-sm text-slate-300 underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>{mode === "login" ? "First visit? Create your account" : "Already registered? Sign in"}</button>
      <p className="mt-4 text-xs leading-5 text-slate-400">Agent responses and external actions are simulations. No real emails, posts, or financial transactions are sent.</p>
    </section>
  </main>;
}
