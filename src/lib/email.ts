import { Resend } from "resend";
import type { PreorderInput } from "./validation";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const resendApiKey = process.env.RESEND_API_KEY;
const ownerEmail = process.env.OWNER_EMAIL;
const fromEmail = process.env.FROM_EMAIL ?? "orders@madebylenip.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// If email isn't configured yet, we no-op instead of failing the request —
// the preorder is still saved locally (see lib/storage.ts) and logged to
// the server console so nothing is silently lost during setup.
export async function notifyOwnerOfPreorder(order: PreorderInput) {
  if (!resend || !ownerEmail) {
    console.log(
      "[email] RESEND_API_KEY / OWNER_EMAIL not set — skipping owner notification. Preorder:",
      order
    );
    return;
  }

  const rows: [string, string][] = [
    ["Name", order.name],
    ["Email", order.email],
    ["Phone", order.phone || "—"],
    ["Design", order.design],
    ["Size", order.size],
    ["Quantity", String(order.quantity)],
    ["Notes", order.notes || "—"],
  ];

  const html = `
    <h2>New preorder — Made by Lenip</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="font-weight:600">${escapeHtml(label)}</td><td>${escapeHtml(
              value
            )}</td></tr>`
        )
        .join("")}
    </table>
    <p>Reply directly to the customer's email above to confirm before any payment is taken.</p>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: ownerEmail,
    replyTo: order.email,
    subject: `New preorder: ${order.design} (${order.size}) — ${order.name}`,
    html,
  });
}

export async function sendCustomerConfirmation(order: PreorderInput) {
  if (!resend) return;

  await resend.emails.send({
    from: fromEmail,
    to: order.email,
    subject: "We got your preorder — Made by Lenip",
    html: `
      <p>Hey ${escapeHtml(order.name)},</p>
      <p>Thanks for reserving a <strong>${escapeHtml(order.design)}</strong> tee
      (size ${escapeHtml(order.size)}, qty ${order.quantity}). This is a preorder
      only — <strong>no payment has been taken</strong>. We'll reach out from this
      same address to confirm details before anything is charged.</p>
      <p>— Made by Lenip</p>
    `,
  });
}
