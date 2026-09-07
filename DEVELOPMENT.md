# Working on this site

How to make a change, see it, check it, and get it live.

## The short version

You do **not** need git or Netlify to see your changes. You run the site on
your own machine, edit a file, and the browser updates instantly. Git is how
you save and share work. Netlify is only the last step.

```
edit on your Mac  →  see it at localhost:3000  →  happy?  →  commit + push  →  Netlify
   (seconds)              (instant)                          (save point)      (live)
```

## 1. Run it on your Mac

One-time setup:

```bash
# Node 20.9 or newer is required (check with: node -v)
# If you don't have it: https://nodejs.org  (pick the LTS version)

git clone https://github.com/pangeo57-debug/madebylenip.git
cd madebylenip
npm install
cp .env.example .env.local   # fill in what you have; it runs fine empty
```

Every time you work:

```bash
npm run dev
```

Open **http://localhost:3000**. Edit any file in `src/`, hit save, and the
browser updates on its own. No refresh, no build, no git, no deploy.

Stop the server with `Ctrl + C`.

> Running locally with an empty `.env.local` is fine — orders get written to
> `data/preorders.jsonl` instead of emailed, which is usually what you want
> while testing. Delete that file when you're done; it holds real addresses.

## 2. See what's wrong

Three places tell you, and they tell you different things:

| Where | What it shows |
| --- | --- |
| **The terminal running `npm run dev`** | Server errors, failed API calls, anything `console.log` prints from the server |
| **Browser DevTools console** (`Cmd + Option + I`) | Errors in the page itself — a broken component, a failed fetch |
| **The page** | Next.js prints the error straight onto the screen in development, with the file and line |

## 3. Check it before you push

These are the same checks that would fail a Netlify build — running them
locally takes seconds and saves you a broken deploy:

```bash
npx tsc --noEmit   # types: catches typos and wrong shapes
npx eslint .       # style and common mistakes
npm run build      # the real build — if this passes, Netlify will too
```

If `npm run build` passes on your machine, the deploy will almost certainly
work. If it fails, read the first error only — the rest are usually knock-ons.

## 4. Save your work (git)

```bash
git checkout -b some-change   # a branch per piece of work
# ...edit, test locally...
git add -A
git commit -m "Say what changed and why"
git push -u origin some-change
```

A branch means you can try something, and throw it away if it's bad, without
touching what's live.

## 5. The three places the site exists

| | Where | Who sees it | What it's for |
| --- | --- | --- | --- |
| **Local** | `localhost:3000` on your Mac | Only you | Everyday work. 95% of the time you're here. |
| **Deploy preview** | A Netlify URL per branch | Anyone you send the link to | Showing Elena a change before it's live. Netlify builds one automatically for every branch you push. |
| **Production** | The real site | Customers | Only what's finished. |

Deploy previews are the piece worth knowing about: push a branch, and Netlify
gives that branch its own URL. You can send Elena a link to a change and, if
she hates it, production never saw it.

## 6. Recommended branch setup

Right now `claude/custom-tshirt-site-0f7vvt` is both the default branch and the
one Netlify deploys, which means **every push goes straight to the live site**.
Worth changing to:

- `main` → what's live. You only merge into it when something is finished.
- Any other branch → gets a preview URL, never touches production.

Steps: create `main` from the current branch, set it as the default on GitHub
(Settings → General → Default branch), then point Netlify at it
(Site configuration → Build & deploy → Branches → Production branch).

## Common problems

**`command not found: npm`** — Node isn't installed. https://nodejs.org, LTS.

**Port 3000 already in use** — a server is still running from last time.
`npm run dev -- -p 3001`, or find and stop the old one.

**Changes don't show up** — check the terminal for an error; a file that fails
to compile keeps showing the previous version.

**Works locally, fails on Netlify** — nearly always a missing environment
variable. Netlify doesn't see your `.env.local`; those have to be set in
Site configuration → Environment variables.
