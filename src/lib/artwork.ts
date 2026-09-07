import { ARTWORK_TYPES, MAX_ARTWORK_BYTES } from "./catalog";

export type DecodedArtwork = {
  mime: (typeof ARTWORK_TYPES)[number];
  bytes: Buffer;
  extension: string;
};

const DATA_URL = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/;

const EXTENSIONS: Record<(typeof ARTWORK_TYPES)[number], string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

/**
 * Confirm the bytes really are the image type they claim to be. A declared
 * MIME type is just a string the client sent us — the file signature is the
 * part an attacker can't rename their way past.
 */
function signatureMatches(mime: string, bytes: Buffer): boolean {
  if (bytes.length < 12) return false;

  if (mime === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (mime === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mime === "image/webp") {
    return (
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}

/**
 * Turn a client-supplied data URL into verified bytes, or explain why not.
 * Never throws — callers get a plain result to act on.
 */
export function decodeArtwork(
  dataUrl: string
): { ok: true; artwork: DecodedArtwork } | { ok: false; reason: string } {
  const match = DATA_URL.exec(dataUrl);
  if (!match) {
    return { ok: false, reason: "Artwork must be a PNG, JPEG or WebP image." };
  }

  const mime = match[1] as (typeof ARTWORK_TYPES)[number];

  let bytes: Buffer;
  try {
    bytes = Buffer.from(match[2], "base64");
  } catch {
    return { ok: false, reason: "That image couldn't be read. Try uploading it again." };
  }

  if (bytes.length === 0) {
    return { ok: false, reason: "That image file is empty." };
  }

  if (bytes.length > MAX_ARTWORK_BYTES) {
    const mb = (MAX_ARTWORK_BYTES / (1024 * 1024)).toFixed(0);
    return { ok: false, reason: `Artwork needs to be under ${mb} MB.` };
  }

  if (!signatureMatches(mime, bytes)) {
    return { ok: false, reason: "That file isn't a valid image." };
  }

  return { ok: true, artwork: { mime, bytes, extension: EXTENSIONS[mime] } };
}
