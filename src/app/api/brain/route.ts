import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const BRAIN_ROOT = path.resolve(process.cwd(), "brain");
const AGENTS_ROOT = path.resolve(process.cwd(), "agents");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (file) {
    // Read specific file safely
    const safePath = path.normalize(file).replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.resolve(process.cwd(), safePath);

    if (
      !fullPath.startsWith(BRAIN_ROOT) &&
      !fullPath.startsWith(AGENTS_ROOT) &&
      !fullPath.endsWith(".md")
    ) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    try {
      if (!fs.existsSync(fullPath)) {
        return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
      }
      const content = fs.readFileSync(fullPath, "utf-8");
      return NextResponse.json({ success: true, file: safePath, content });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  // List summary of available brain files
  const sections: { category: string; files: string[] }[] = [];

  const getFiles = (dir: string, base: string) => {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.endsWith(".md"))
      .map((d) => path.join(base, d.name).replace(/\\/g, "/"));
  };

  sections.push({ category: "7-Agent Core Suite", files: getFiles(AGENTS_ROOT, "agents") });
  sections.push({ category: "01 Identity & Operating Principles", files: getFiles(path.join(BRAIN_ROOT, "01-identity"), "brain/01-identity") });
  sections.push({ category: "02 Domain Rules", files: getFiles(path.join(BRAIN_ROOT, "02-domains"), "brain/02-domains") });
  sections.push({ category: "03 Heuristics & Patterns", files: getFiles(path.join(BRAIN_ROOT, "03-heuristics"), "brain/03-heuristics") });
  sections.push({ category: "08 Workflows & Commands", files: getFiles(path.join(BRAIN_ROOT, "08-workflows"), "brain/08-workflows") });

  return NextResponse.json({ success: true, sections });
}

