import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ getUser: vi.fn(), maybeSingle: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: () => ({ getAll: () => [], set: vi.fn() }) }));
vi.mock("@supabase/ssr", () => ({ createServerClient: () => ({ auth: { getUser: mocks.getUser }, from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.maybeSingle }) }) }) }) }));
import { withOperator } from "@/lib/supabase/server";

describe("Operator access boundary", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-publishable");
    mocks.getUser.mockResolvedValue({ data: { user: { id: "operator", email: "operator@example.com", email_confirmed_at: "2026-11-11" } }, error: null });
    mocks.maybeSingle.mockResolvedValue({ data: { email: "operator@example.com" }, error: null });
  });
  afterEach(() => vi.unstubAllEnvs());
  const request = () => new Request("https://office.example/api/memory", { method: "POST", headers: { origin: "https://office.example" } });
  it("requires a validated session", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error("Invalid token") });
    const handler = vi.fn(async () => new Response("ok"));
    expect((await withOperator(handler)()).status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });
  it("rejects signed-in users outside the operator allowlist", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null });
    expect((await withOperator(async () => new Response("ok"))()).status).toBe(403);
  });
  it("rejects a cross-origin write with a valid operator session", async () => {
    const handler = withOperator(async (_request: Request) => new Response("ok"));
    expect((await handler(new Request("https://office.example/api/memory", { method: "POST", headers: { origin: "https://untrusted.example" } }))).status).toBe(403);
    const valid = await handler(request());
    expect(valid.status).toBe(200);
    expect(valid.headers.get("Cache-Control")).toContain("no-store");
  });
  it("fails closed on Vercel without database configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", ""); vi.stubEnv("VERCEL", "1");
    expect((await withOperator(async () => new Response("ok"))()).status).toBe(503);
  });
});
