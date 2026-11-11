import fs from "fs";
import os from "os";
import path from "path";
import { afterAll } from "vitest";

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "agent-office-test-"));
process.env.OFFICE_DATA_DIR = testDirectory;
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
delete process.env.VERCEL;

afterAll(() => {
  const root = path.resolve(os.tmpdir()) + path.sep;
  if (!path.resolve(testDirectory).startsWith(root)) throw new Error("Unexpected test data directory.");
  fs.rmSync(testDirectory, { recursive: true, force: true });
});
