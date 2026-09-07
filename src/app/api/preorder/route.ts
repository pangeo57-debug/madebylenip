import { NextRequest, NextResponse } from "next/server";
import { preorderSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { savePreorder } from "@/lib/storage";
import { notifyOwnerOfPreorder, sendCustomerConfirmation } from "@/lib/email";
import { decodeArtwork, type DecodedArtwork } from "@/lib/artwork";
import { siteConfig } from "@/lib/site-config";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = preorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Honeypot tripped — pretend success so bots don't learn to adapt.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const order = parsed.data;

  // The schema only checks the shape of the data URL; this confirms the bytes
  // really are the image type they claim to be before we store or send them.
  let artwork: DecodedArtwork | undefined;
  if (order.artwork) {
    const decoded = decodeArtwork(order.artwork.dataUrl);
    if (!decoded.ok) {
      return NextResponse.json({ error: decoded.reason }, { status: 400 });
    }
    artwork = decoded.artwork;
  }

  const saved = await savePreorder(order, artwork);

  let emailed = false;
  try {
    emailed = await notifyOwnerOfPreorder(order, artwork);
    if (emailed) await sendCustomerConfirmation(order);
  } catch (error) {
    console.error("[preorder] Email notification failed:", error);
  }

  // On a serverless host the filesystem is read-only, so `saved` is false and
  // email is the only real delivery channel. If neither worked, the order
  // reached nobody — say so instead of showing a confirmation for an order
  // that doesn't exist.
  if (!saved && !emailed) {
    console.error("[preorder] Order could not be delivered — no storage, no email.");
    return NextResponse.json(
      {
        error: `We couldn't record your order just now. Please email ${siteConfig.contactEmail} and we'll sort it out right away.`,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
