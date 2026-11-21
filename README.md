# Prathmesh More — Portfolio v2

**One developer. Two experiences.**

A single Next.js application with two completely different visitor experiences:

| | Recruiter (default) | Freelance |
|---|---|---|
| URL | `/?viewer=recruiter` | `/?viewer=freelance` |
| Theme | Premium light — off-white, charcoal, blue accent, serif-italic accents | Premium dark — near-black, violet + emerald, bold editorial display type |
| Goal | Trust in engineering experience, scannable in seconds | Make services obvious, memorable, convert to an inquiry |
| Sections | Hero → Engineering highlights → Experience → Featured projects → Skills → Education & more → Let's Connect | Hero → Services → Selected work → How I work → Why work with me → Project inquiry |

Built from scratch — the previous HTML portfolio was used only as an information source.

---

## Tech stack

- **Next.js 16.4** (App Router, Turbopack, Cache Components) + **React 19.3**
- **TypeScript** (strict)
- **Tailwind CSS v4** (design tokens as CSS variables, `recruiter:` / `freelance:` variants)
- **Framer Motion** (scroll reveals, shared-layout indicators, tabs/accordions)
- **Lucide React** icons (+ small inline brand marks for GitHub / LinkedIn / Google Play)
- Fonts via `next/font` (self-hosted): Geist, Geist Mono, Instrument Serif, Bricolage Grotesque

No other runtime dependencies.

## Getting started

Requires **Node.js 20.9+**.

```bash
npm install
npm run dev
```

Open <http://localhost:3000/?viewer=recruiter> or <http://localhost:3000/?viewer=freelance>.

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (both experiences are statically prerendered) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js + React Compiler rules) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check` | typecheck + lint + build |

## How the two modes work

- `/` serves the **Recruiter** page (also used for missing or invalid `viewer` values).
- `/?viewer=freelance` is **rewritten** (in `next.config.ts`) to the statically prerendered `/freelance` route, so the correct experience, theme and metadata are in the very first HTML — no flash, no client-side guessing. Visiting `/freelance` directly redirects to `/?viewer=freelance`.
- Switching modes on the client (`src/components/mode/ModeProvider.tsx`):
  - pushes `?viewer=…` with `history.pushState` (integrated with the Next.js router — no reload, no server round-trip),
  - swaps the experience inside a **View Transition** (circular reveal from the clicked control), falling back to a fade where unsupported, and an instant swap for `prefers-reduced-motion`,
  - updates `document.title`, `<meta name="theme-color">`, and announces the change to screen readers.
- Back/forward buttons follow the URL (`popstate`), refresh keeps the mode, and a URL without `viewer` is normalised to `?viewer=recruiter` with `replaceState` (no extra history entry).
- Theme tokens live on `:root` and swap via `:root:has([data-mode="freelance"])` (with a wrapper-level fallback), so the page background, scrollbars and form controls follow the active experience.

## Project structure

```
src/
  app/                 layout, the two static pages (/, /freelance), OG images, icons, robots, sitemap, 404, error
  assets/              optimised images (portrait, Vibe Tribe Travels screenshots)
  components/
    app/               PortfolioApp — client root (MotionConfig, ModeProvider, header/main/footer)
    mode/              ModeProvider (state + URL sync + transitions), ModeSwitch, ModeCue
    layout/            SiteHeader, MobileMenu, SiteFooter, ScrollProgress
    recruiter/         Recruiter experience sections
    freelance/         Freelance experience sections (+ interactive HeroComposer)
    contact/           Project inquiry section + form
    projects/          ProjectVisual (abstract illustrations), ProjectLinks
    shared/            Section, SectionHeading, Reveal/Stagger, Button, Chip, ArrowLink, CopyButton, brand icons
    terminal/          Optional terminal easter egg (press ` or use the footer button)
  data/                ALL content — edit these files to update the site
  hooks/               useActiveSection, useScrolled
  lib/                 viewer parsing, metadata, scrolling, motion presets, inquiry validation/delivery
  types/               shared TypeScript types
public/resume/         Prathmesh-More-Resume.pdf (served for "Download résumé")
```

## Editing content

Everything visible on the site comes from `src/data/`:

| File | Content |
|---|---|
| `profile.ts` | Name, title, location, email, links, current role, summary, portrait |
| `experience.ts` | Timeline (set `hidden: true` on an entry to hide it) |
| `projects.ts` | Projects, links, which projects appear where |
| `skills.ts` | Skill groups (grouped by where they were used — no proficiency bars) |
| `highlights.ts` | Recruiter "Engineering highlights" |
| `education.ts` | Degree + additional information (NCC, certification, languages, interests) |
| `services.ts` | Freelance services, process steps, "why work with me" |
| `inquiry.ts` | Inquiry form options (project types, budget ranges) and limits |
| `site.ts` | Per-mode titles/descriptions/navigation, hero and contact copy, section ids |

To update the résumé, replace `public/resume/Prathmesh-More-Resume.pdf` (keep the file name or update `profile.ts`).

**Portrait (currently hidden).** The photo is commented out for now and the cards show the PM monogram instead. To bring it back, uncomment the marked `Image` blocks (and their `Image` imports) in `src/components/recruiter/parts/HeroProfileCard.tsx` and `src/components/freelance/WhySection.tsx`. The images themselves stay in `src/assets/profile/` and `profile.ts`.

Once a year, bump `brand.copyrightYear` in `site.ts` and `LAST_UPDATED` in `src/app/sitemap.ts` (the build intentionally never reads the clock — Cache Components forbids it during prerendering).

## Project inquiry form

The Freelance inquiry form validates input on the client and then delivers it in one of two ways:

1. **Default — mailto draft (works today, no setup).** It opens the visitor's email app with a pre-filled subject and body addressed to you. The UI says so honestly; nothing is claimed as "sent".
2. **Direct sending via EmailJS (optional).** Set these environment variables (see `.env.example`) and redeploy:

   ```bash
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
   ```

   The EmailJS public key is designed to be exposed to browsers, but you should restrict **Allowed origins** to your production domain and enable spam protection in the EmailJS dashboard. The template can use `{{name}}`, `{{email}}`, `{{reply_to}}`, `{{subject}}`, `{{message}}`, `{{project_type}}`, `{{budget}}`.

## Deploying to Vercel

1. Create a new GitHub repository and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Portfolio v2"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In Vercel: **Add New → Project → Import** the repository. The Next.js preset is detected automatically (build `next build`, output handled by Vercel).
3. (Optional) **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` — your final URL (e.g. a custom domain). Without it, Vercel's production URL is used for canonical/Open Graph links.
   - The three `NEXT_PUBLIC_EMAILJS_*` variables to enable direct inquiry sending.
4. Deploy, then (optionally) add a custom domain under **Settings → Domains** and set `NEXT_PUBLIC_SITE_URL` to it.

## Security & privacy

- Production responses send a Content-Security-Policy (same-origin only, plus `api.emailjs.com` for the optional form delivery), `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy and a restrictive Permissions-Policy (`next.config.ts`).
- No analytics, trackers, cookies or third-party scripts/fonts. No visitor data is collected.
- No phone number is published; contact is via email, LinkedIn and GitHub.
- Form input is normalised and length-limited, rendered only as text, and never logged.
- Professional projects use abstract illustrations instead of app screenshots and are labelled as team-owned client products.

## Accessibility & performance

- Semantic landmarks, one `h1` per experience, labelled sections, skip link, visible focus states, native `<dialog>` for the menu and terminal, keyboard-operable tabs/accordions.
- `prefers-reduced-motion` is respected everywhere (Framer Motion + a global CSS safety net); content stays visible without JavaScript.
- Both experiences are static HTML (CDN-cacheable); images are optimised with `next/image`; fonts are self-hosted and subset.
