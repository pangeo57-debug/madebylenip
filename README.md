# Made by Lenip

A landing page + preorder form for a custom t-shirt printing shop. Built with
Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

Right now the site **does not process any payments**. It collects preorders
(name, contact info, design, size, quantity) so the shop owner can follow up
personally before any money changes hands. See [Payments roadmap](#payments-roadmap)
below for how that grows over time.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The preorder form works
out of the box with **zero configuration** — submissions are logged to the
server console and appended to `data/preorders.jsonl` (git-ignored, since it
can contain customer info).

To also get email notifications, copy `.env.example` to `.env.local` and fill
in a [Resend](https://resend.com) API key + your email:

```bash
cp .env.example .env.local
```

| Variable         | Purpose                                                             |
| ---------------- | -------------------------------------------------------------------- |
| `RESEND_API_KEY` | Sends you an email + a confirmation email to the customer on preorder |
| `OWNER_EMAIL`    | Where preorder notifications are sent                                |
| `FROM_EMAIL`     | Must be a domain verified with Resend once you send real email       |

## Project structure

- `src/app/page.tsx` — assembles the landing page from the components below
- `src/components/` — `Hero`, `ShowcaseGallery`, `HowItWorks`, `WhyUs`,
  `PreorderForm`, `Faq`, `Footer`, etc.
- `src/app/api/preorder/route.ts` — validates and handles preorder
  submissions
- `src/lib/validation.ts` — the single source of truth for what a valid
  preorder looks like (shared shape used by the form's dropdown options too)
- `src/lib/storage.ts` — local dev persistence (swap for a real DB later)
- `src/lib/email.ts` — Resend integration, no-ops if not configured
- `src/lib/rate-limit.ts` — basic in-memory abuse protection

The t-shirt "photos" on the site are stylized SVG mockups
(`src/components/TshirtMock.tsx`), not real product photos — swap in real
photography once you have it, no design changes needed elsewhere.

## Deploying

The easiest path is [Vercel](https://vercel.com/new) — connect the repo,
add the environment variables above in the project settings, deploy.

**Important:** on most serverless hosts (Vercel included) the filesystem is
read-only in production, so `data/preorders.jsonl` won't persist there. In
production, email (via `RESEND_API_KEY` + `OWNER_EMAIL`) is the reliable
channel for now. Once order volume grows, swap `src/lib/storage.ts` for a
real database (Postgres, a hosted sheet like Airtable, etc.) — everything
else in the app is written to make that a small, contained change.

## Security notes

- The preorder API validates and sanitizes everything server-side with
  [Zod](https://zod.dev) — never trust the client.
- A hidden honeypot field + a basic per-IP rate limit deter simple bots and
  spam. Neither is bulletproof; if abuse becomes a real problem, add a proper
  CAPTCHA (e.g. Cloudflare Turnstile) and a shared rate-limit store (Upstash
  Redis / Vercel KV).
- Basic security headers (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, a locked-down `Permissions-Policy`) are set in
  `next.config.ts`.
- **No payment or card data is collected or stored anywhere in this app.**
  That's intentional — see the roadmap below for how payments get added
  safely, one verified step at a time.
- Secrets (`RESEND_API_KEY`, etc.) only ever live in environment variables,
  never in code or in the repo. `.env*` is git-ignored.

## Payments roadmap

The plan is to layer payments in carefully, only turning on a method once
it's actually understood and tested — never rushing straight to taking real
customer money:

1. **Now — preorder only.** No payment happens on the site. Every order is
   confirmed by a real person before anything is charged. This is also the
   best anti-scam protection there is: customers never get asked to pay a
   site they don't recognize, and the shop owner never has to store card
   numbers.
2. **Stripe Payment Links.** Once a preorder is confirmed, send the
   customer a [Stripe Payment Link](https://stripe.com/payments/payment-links)
   — a hosted, PCI-compliant Stripe checkout page. Requires zero payment
   code in this repo; Stripe handles the card data entirely off our servers.
   This is the safest possible way to start actually accepting cards.
3. **Venmo (manual).** Share a Venmo handle/QR for customers who prefer it,
   confirmed manually the same way. Note Venmo purchase protection is
   limited for "friends & family" — always use "goods & services" so both
   sides have recourse, and say so explicitly to customers.
4. **Stripe Checkout, embedded.** Once comfortable with Stripe, move to
   [Stripe Checkout](https://stripe.com/payments/checkout) launched directly
   from this site (still Stripe-hosted, still no card data touches this
   server) so customers can pay without leaving the page.
5. **Apple Pay (via Stripe).** Apple Pay is enabled as a payment method
   *inside* Stripe Checkout / Stripe Elements — it isn't a separate
   integration. This becomes a config toggle once step 4 is in place.

**Ground rule for every step above:** this app should never directly handle
or store raw card numbers. Always use a PCI-compliant processor (Stripe)
for anything card-based, and always let the customer verify who they're
paying (a Stripe Payment Link shows your registered business name; a Venmo
request shows your verified handle) before they send money.
