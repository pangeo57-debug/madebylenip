import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PreorderInput } from "./validation";
import type { DecodedArtwork } from "./artwork";

// Best-effort local persistence for development. On most serverless hosts
// (Vercel, etc.) the filesystem is read-only or ephemeral in production, so
// this is a convenience for local runs / self-hosted deployments — the
// email notification in lib/email.ts is the reliable channel in production.
// Swap this for a real database (Postgres, SQLite on a persistent volume,
// Airtable, etc.) once order volume grows.

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "preorders.jsonl");
const ARTWORK_DIR = path.join(DATA_DIR, "artwork");

/**
 * Filesystem-safe, can't climb out of the artwork directory, and without the
 * original extension — the caller appends the one we actually verified.
 */
function safeFileName(name: string) {
  const base = path.basename(name, path.extname(name));
  return (base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "artwork");
}

export async function savePreorder(order: PreorderInput, artwork?: DecodedArtwork) {
  try {
    await mkdir(DATA_DIR, { recursive: true });

    let artworkFile: string | null = null;

    if (artwork && order.artwork) {
      await mkdir(ARTWORK_DIR, { recursive: true });
      artworkFile = `${Date.now()}-${safeFileName(order.artwork.fileName)}.${artwork.extension}`;
      await writeFile(path.join(ARTWORK_DIR, artworkFile), artwork.bytes);
    }

    // The image lives on disk, not inline — a base64 blob per line would make
    // the log unreadable and enormous.
    const record = {
      ...order,
      artwork: undefined,
      artworkFile,
      artworkBytes: artwork?.bytes.length ?? null,
      receivedAt: new Date().toISOString(),
    };

    await appendFile(DATA_FILE, JSON.stringify(record) + "\n", "utf8");
    return true;
  } catch (error) {
    console.error("[storage] Failed to persist order locally:", error);
    return false;
  }
}
