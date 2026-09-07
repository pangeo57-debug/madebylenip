import { NextRequest, NextResponse } from "next/server";
import { preorderSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { savePreorder } from "@/lib/storage";
import { notifyOwnerOfPreorder, sendCustomerConfirmation } from "@/lib/email";

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

  await savePreorder(order);

  try {
    await notifyOwnerOfPreorder(order);
    await sendCustomerConfirmation(order);
  } catch (error) {
    // The order is already saved — don't fail the customer's request just
    // because the notification email had a hiccup.
    console.error("[preorder] Email notification failed:", error);
  }

  return NextResponse.json({ ok: true });
}
