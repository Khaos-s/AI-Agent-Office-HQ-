import { NextResponse } from "next/server";
import { getMemories, addMemory } from "@/lib/memory-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag") || undefined;
  const memories = getMemories(tag);
  return NextResponse.json({ success: true, count: memories.length, memories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId, title, content, tags } = body;

    if (!agentId || !title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: agentId, title, and content." },
        { status: 400 }
      );
    }

    const created = addMemory({
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

