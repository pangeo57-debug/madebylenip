import { Resend } from "resend";
import type { PreorderInput } from "./validation";
import type { DecodedArtwork } from "./artwork";

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

function shippingAddress(order: PreorderInput) {
  return [
    order.address1,
    order.address2 || null,
    `${order.city}, ${order.region} ${order.postalCode}`,
    order.country,
  ]
    .filter(Boolean)
    .join("\n");
}

// If email isn't configured yet, we no-op instead of failing the request —
// the order is still saved locally (see lib/storage.ts) and logged to the
// server console so nothing is silently lost during setup.
export async function notifyOwnerOfPreorder(
  order: PreorderInput,
  artwork?: DecodedArtwork
) {
  if (!resend || !ownerEmail) {
    console.log(
      "[email] RESEND_API_KEY / OWNER_EMAIL not set — skipping owner notification.",
      { ...order, artwork: order.artwork ? "[image attached]" : null }
    );
    return;
  }

  const rows: [string, string][] = [
    ["Design", order.layout],
    ["Name to print", order.printName || "—"],
    ["Second line", order.subtitle || "—"],
    ["Artwork", artwork ? `Attached (${order.artwork?.fileName ?? "image"})` : "—"],
    ["Design brief", order.artworkBrief || "—"],
    ["Garment", `${order.garmentColor} ${order.garment}`],
    ["Size", order.size],
    ["Quantity", String(order.quantity)],
    ["Print", `${order.printColor} · ${order.finish} · ${order.font} · ${order.orientation}`],
    ["Customer", order.customerName],
    ["Email", order.email],
    ["Phone", order.phone || "—"],
    ["Ship to", shippingAddress(order)],
    ["Notes", order.notes || "—"],
  ];

  const html = `
    <h2>New order — Made by Lenip</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="font-weight:600;vertical-align:top">${escapeHtml(
              label
            )}</td><td style="white-space:pre-line">${escapeHtml(value)}</td></tr>`
        )
        .join("")}
    </table>
    <p>Reply directly to the customer's email above to confirm the design, the
    total and shipping before any payment is taken.</p>
  `;

  const subjectDesign = order.printName || order.artwork?.fileName || "custom artwork";

  await resend.emails.send({
    from: fromEmail,
    to: ownerEmail,
    replyTo: order.email,
    subject: `New order: "${subjectDesign}" — ${order.garment} (${order.size}) — ${order.customerName}`,
    html,
    attachments: artwork
      ? [
          {
            filename: `artwork.${artwork.extension}`,
            content: artwork.bytes.toString("base64"),
          },
        ]
      : undefined,
  });
}

export async function sendCustomerConfirmation(order: PreorderInput) {
  if (!resend) return;

  await resend.emails.send({
    from: fromEmail,
    to: order.email,
    subject: "We got your order — Made by Lenip",
    html: `
      <p>Hey ${escapeHtml(order.customerName)},</p>
      <p>Thanks for your order! Here's what we've got:</p>
      <ul>
        ${
          order.printName
            ? `<li><strong>${escapeHtml(order.printName)}</strong>${
                order.subtitle ? ` / ${escapeHtml(order.subtitle)}` : ""
              } in ${escapeHtml(order.printColor)} ${escapeHtml(
                order.finish.toLowerCase()
              )}, ${escapeHtml(order.font)} lettering</li>`
            : ""
        }
        ${order.artwork ? `<li>Your artwork: ${escapeHtml(order.artwork.fileName)}</li>` : ""}
        ${
          order.artworkBrief
            ? `<li>Design request: ${escapeHtml(order.artworkBrief)}</li>`
            : ""
        }
        <li>${escapeHtml(order.garmentColor)} ${escapeHtml(
          order.garment
        )}, size ${escapeHtml(order.size)}, quantity ${order.quantity}</li>
      </ul>
      <p><strong>No payment has been taken.</strong> Lenip will reply from this
      address to confirm everything — including the total and shipping — before
      anything is charged. If you get a payment request from anywhere else
      claiming to be us, it isn't us.</p>
      <p>— Made by Lenip</p>
    `,
  });
}
