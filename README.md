# Made by Lenip

Website for a custom name apparel shop — personalized sweatshirts, t-shirts and
hoodies with a name pressed on in vinyl. Built with Next.js (App Router),
TypeScript, Tailwind CSS and Framer Motion.

The centerpiece is a **live customizer**: the customer types a name, picks the
garment, colors, lettering and finish, and sees a preview update as they go.

Right now the site **does not process any payments**. It collects orders
(customization + contact + shipping address) so Lenip can confirm the design
and the total personally before any money changes hands. See
[Payments roadmap](#payments-roadmap) for how that grows.

**New here?** [DEVELOPMENT.md](DEVELOPMENT.md) walks through running the site
locally, spotting what's broken, and getting a change live.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The order form works with
**zero configuration** — submissions are logged to the server console and
appended to `data/preorders.jsonl` (git-ignored, since it contains customer
names and addresses).

To also get email notifications, copy `.env.example` to `.env.local` and add a
[Resend](https://resend.com) API key + your email:

```bash
cp .env.example .env.local
```

| Variable         | Purpose                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `RESEND_API_KEY` | Emails you the order + sends the customer a confirmation           |
| `OWNER_EMAIL`    | Where order notifications are sent                                 |
| `FROM_EMAIL`     | Must be a domain verified with Resend once you send real email     |

## Things to fill in before launch

These are the spots that need Lenip's real details — all in one place each:

- **`src/lib/site-config.ts`** — contact email, Instagram URL, Etsy shop link,
  quoted turnaround time.
- **`src/lib/catalog.ts`** — the actual garment colors, vinyl colors, sizes and
  fonts she stocks. Right now these are sensible defaults; swap the names and
  hex values for the real blanks (Gildan, Bella+Canvas, whatever she buys) and
  everything on the site updates — the previews, the dropdowns and the
  validation all read from this one file.
- **Pricing** — deliberately not shown anywhere yet, because it hasn't been
  set. The site tells customers the total is confirmed by message, which is
  honest for made-to-order work. Add prices to `catalog.ts` when they exist.
- **Artwork handling** — uploads are downscaled to 1400px and emailed to Lenip
  as an attachment. That's a reference image, not a print file: at that size a
  12-inch print is far below the ~300dpi printing needs, so the confirmation
  message should ask the customer for the full-resolution original. If that
  becomes a chore, add blob storage (Vercel Blob, S3, Cloudinary) and accept
  the original directly — `src/lib/storage.ts` is the only place that changes.
- **A dragon breathing roses can't be cut from vinyl.** Layered HTV works for
  names and simple shapes; full-color artwork needs DTF transfers, sublimation
  or a print-on-demand partner. Worth settling before promising custom art on
  the site.
- **Real photos** — the garments are stylized SVG mockups
  (`src/components/GarmentMock.tsx`), not photographs. They're good enough to
  launch with and they update live with the customizer, but real product photos
  in the styles gallery will convert better once she has them.

## Project structure

- `src/app/page.tsx` — assembles the page from the sections below
- `src/components/Customizer.tsx` — the live preview + order form
- `src/components/GarmentMock.tsx` — the SVG garment, renders any name in the
  chosen font/color/finish/orientation
- `src/components/` — `Hero`, `ShowcaseGallery`, `HowItWorks`, `WhyUs`, `Faq`,
  `Footer`, `Navbar`, `Marquee`, `Sparkles`
- `src/lib/catalog.ts` — the product catalog (single source of truth for what
  can be ordered; imported by both the UI and the validation schema)
- `src/lib/validation.ts` — server-side Zod schema for an order
- `src/app/api/preorder/route.ts` — handles order submissions
- `src/lib/storage.ts` — local dev persistence (swap for a real DB later)
- `src/lib/email.ts` — Resend integration, no-ops if not configured
- `src/lib/rate-limit.ts` — basic in-memory abuse protection

## Deploying

Currently deployed on **Netlify**, which auto-detects Next.js and runs the
`/api/preorder` route as a function. [Vercel](https://vercel.com/new) works the
same way.

### Set the environment variables — the site does not work without them

On a serverless host the filesystem is read-only, so `data/preorders.jsonl`
**does not persist in production**. Email is the only real delivery channel
there, which makes `RESEND_API_KEY` and `OWNER_EMAIL` required, not optional.

Set them in **Netlify → Site configuration → Environment variables**, then
redeploy (env vars are read at request time, but a redeploy is the reliable
way to be sure).

Until they're set, the order form deliberately returns an error telling the
customer to email instead. That's on purpose: an order that reaches nobody must
never show a confirmation screen. `src/app/api/preorder/route.ts` enforces it.

Once order volume grows, swap `src/lib/storage.ts` for a real database —
everything else is written so that's a small, contained change.

## Security notes

- The order API validates and sanitizes everything server-side with
  [Zod](https://zod.dev) — never trust the client.
- A hidden honeypot field + a per-IP rate limit deter simple bots. Neither is
  bulletproof; if spam becomes a real problem, add a CAPTCHA (e.g. Cloudflare
  Turnstile) and a shared rate-limit store (Upstash Redis / Vercel KV).
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, a locked-down `Permissions-Policy`) are set in
  `next.config.ts`.
- **No payment or card data is collected or stored anywhere in this app.**
  That's intentional — see the roadmap below.
- Uploaded artwork is verified by **file signature**, not by the MIME type the
  browser claims (`src/lib/artwork.ts`) — a renamed script can't get through as
  a PNG. Size is capped at 2 MB, and the browser downscales before uploading so
  a phone photo doesn't blow past the ~4.5 MB serverless request limit.
- Orders contain real names, shipping addresses and uploaded images. Treat
  `data/preorders.jsonl` and `data/artwork/` as personal data: they're
  git-ignored, don't paste them into chats or issues, and delete them when
  you're done testing.
- **Customer-supplied artwork needs a human look before it's printed.** People
  will upload copyrighted characters and brand logos; printing and selling
  those is the shop's legal problem, not the customer's. Every order is
  reviewed by Lenip before anything is pressed — keep it that way if design
  generation is ever automated.
- Secrets only live in environment variables, never in code. `.env*` is
  git-ignored (except `.env.example`).

## Payments roadmap

Layer payments in carefully, turning on each method only once it's understood
and tested — never rushing straight to taking real customer money:

1. **Now — order requests only.** No payment happens on the site. Every order
   is confirmed by a real person first. This is also strong anti-scam
   protection: customers are never asked to pay a site they don't recognize,
   and Lenip never has to handle card numbers.
2. **Etsy (fastest safe way to actually get paid).** The shop already exists
   (`madebylenip`). Etsy handles the payment, the fraud checks, the sales tax
   and buyer protection — all the parts that are risky to build yourself. Set
   `etsyEnabled: true` in `src/lib/site-config.ts` once there are real
   listings, and the site will show "buy on Etsy" links alongside the
   customizer.
3. **Stripe Payment Links.** For orders that come through this site, send a
   [Stripe Payment Link](https://stripe.com/payments/payment-links) — a hosted,
   PCI-compliant checkout page — after confirming the order. Zero payment code
   in this repo; card data never touches our server.
4. **Venmo (manual).** For customers who prefer it. Use **goods & services**,
   not "friends & family", so both sides keep purchase protection — and say so
   to the customer.
5. **Stripe Checkout, on-site.** Once comfortable with Stripe, launch Checkout
   directly from the customizer (still Stripe-hosted, still no card data on our
   server) so customers don't leave the page.
6. **Apple Pay.** Enabled as a payment method *inside* Stripe Checkout — it's a
   config toggle once step 5 is in place, not a separate integration.

**Ground rule for every step:** this app should never directly handle or store
raw card numbers. Always use a PCI-compliant processor (Stripe) or a
marketplace that is one (Etsy), and always let the customer verify who they're
paying before they send money.
