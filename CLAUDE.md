@AGENTS.md

# Made by Lenip — project context

Read this before making changes. It's the stuff that isn't obvious from the
code and that has already caused one full rebuild when it was missing.

## What this business actually is

Lenip makes **personalized name apparel**: sweatshirts, t-shirts and hoodies
with a name cut from heat-transfer vinyl and pressed on by hand. Mostly for
kids (her market started with friends' children), but adult sizes sell too.
She has an Etsy shop, `madebylenip`. She is one person, working from home.

It is **not** a graphic-tee brand with seasonal collections. If a change
implies mass-produced designs or a monthly "drop", it's wrong.

## Constraints that decide designs

- **Vinyl cutting only, for now.** A cutter follows outlines, one color per
  layer. Names and simple shapes: fine. A full-color illustration: not
  printable on her current setup — that needs DTF transfers or print-on-demand.
  Don't promise on the site what her kit can't produce.
- **No payments on this site.** Orders are confirmed by message, then paid via
  Stripe link / Venmo / Etsy. This app must never handle or store card data.
  See the payments roadmap in README.md before touching anything payment-shaped.
- **An order must never be silently lost.** On a serverless host the local file
  fallback doesn't persist, so email is the real delivery channel. If neither
  works, the API returns an error — never a confirmation screen for an order
  nobody received. Don't "simplify" that away.
- **Customer artwork needs human review.** People upload brand logos and
  cartoon characters; printing those is her legal problem. Never automate
  straight from upload to print.

## Where things live

- `src/lib/catalog.ts` — single source of truth for garments, colors, sizes,
  fonts, limits. The UI, the previews and the validation all read from it.
  Adding a color or size means editing this file only.
- `src/lib/validation.ts` — the server-side schema. Never trust the client.
- `src/components/GarmentMock.tsx` — draws the garment and composes the name
  and artwork. Coordinates are in a 240×270 box.
- `src/components/Customizer.tsx` — the live preview plus the order form.
- `src/lib/site-config.ts` — contact details, Etsy link and flags.

## Conventions

- Copy is **American English** ("color", "customize") — she and her customers
  are US-based.
- **Never invent prices, reviews, testimonials, or an Instagram/Etsy link that
  hasn't been confirmed live.** Placeholders get flagged, not faked.
- Controls that don't apply to the current state are hidden, not left inert.
- Product images are SVG mockups, not photos. If real photos arrive, they
  replace the gallery, not the customizer preview.

## Before pushing

```bash
npx tsc --noEmit && npx eslint . && npm run build
```

`data/` holds real names, addresses and uploaded images. It's git-ignored —
never paste its contents anywhere.
