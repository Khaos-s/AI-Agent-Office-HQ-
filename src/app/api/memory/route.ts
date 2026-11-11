import { withOperator } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getMemories, addMemory } from "@/lib/memory-store";

export const dynamic = "force-dynamic";

async function handleGET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag") || undefined;
  const memories = await getMemories(tag);
  return NextResponse.json({ success: true, count: memories.length, memories });
}

async function handlePOST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
    const { agentId, title, content, tags } = body;

    if (typeof agentId !== "string" || !agentId.trim() || agentId.length > 80 || typeof title !== "string" || !title.trim() || title.length > 200 || typeof content !== "string" || !content.trim() || content.length > 20000 || (tags !== undefined && (!Array.isArray(tags) || tags.length > 20 || tags.some(tag => typeof tag !== "string" || tag.length > 80)))) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: agentId, title, and content." },
        { status: 400 }
      );
    }

    const created = await addMemory({
      agentId,
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ success: true, memory: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add memory." },
      { status: 500 }
    );
  }
}


export const GET = withOperator(handleGET);
export const POST = withOperator(handlePOST);
