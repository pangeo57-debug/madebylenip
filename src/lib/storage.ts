import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { PreorderInput } from "./validation";

// Best-effort local persistence for development. On most serverless hosts
// (Vercel, etc.) the filesystem is read-only or ephemeral in production, so
// this is a convenience for local runs / self-hosted deployments — the
// email notification in lib/email.ts is the reliable channel in production.
// Swap this for a real database (Postgres, SQLite on a persistent volume,
// Airtable, etc.) once order volume grows.

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "preorders.jsonl");

export async function savePreorder(order: PreorderInput) {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    const record = { ...order, receivedAt: new Date().toISOString() };
    await appendFile(DATA_FILE, JSON.stringify(record) + "\n", "utf8");
    return true;
  } catch (error) {
    console.error("[storage] Failed to persist preorder locally:", error);
    return false;
  }
}
