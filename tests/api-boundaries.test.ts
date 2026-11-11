import { describe, expect, it } from "vitest";
import { GET as brain } from "@/app/api/brain/route";
import { POST as memory } from "@/app/api/memory/route";
import { POST as approval } from "@/app/api/approvals/route";

describe("API input boundaries", () => {
  it.each(["../package.json", "brain/../package.json", "brain-extra/secret.md", ".env.local"])("denies brain path %s", async file => {
    expect((await brain(new Request(`http://localhost/api/brain?file=${encodeURIComponent(file)}`))).status).toBe(403);
  });
  it("rejects malformed records before persistence", async () => {
    const post = (body: unknown) => new Request("http://localhost/api/memory", { method: "POST", body: JSON.stringify(body) });
    expect((await memory(post(null))).status).toBe(400);
    expect((await memory(post({ agentId: "blaze", title: "Title", content: "Content", tags: [123] }))).status).toBe(400);
    expect((await approval(post({ agentId: "blaze", actionType: "test", title: "Title", description: "Details", payload: {}, riskLevel: "invalid" }))).status).toBe(400);
  });
});
