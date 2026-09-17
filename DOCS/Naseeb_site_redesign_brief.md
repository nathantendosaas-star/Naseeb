# Site Redesign Brief — Quiet Luxury Direction
**Reference case study:** Silver Pinewood Residences (Vide Infra) — restraint-as-aesthetic, not less-effort. The goal is premium through precision and whitespace, not effects.

## 1. Design Philosophy (apply everywhere)
- **Restraint is the feature.** One considered motion moment per section, not five simultaneous ones. If two effects compete for attention, cut one.
- **Flat, non-skeuomorphic UI.** No glassmorphism (no `backdrop-filter: blur`, no translucent frosted panels, no glass borders). Solid surfaces, real contrast, real shadows only where they earn their place (subtle, single-direction, low-opacity — not neumorphic).
- **No SVG icon set, no emojis.** Replace iconography with typography, whitespace, and photography/video doing the communicating. Where a functional icon is unavoidable (e.g. a chevron for a carousel), use a minimal inline-stroke icon from a single consistent icon set — not decorative SVG illustrations.
- **Typography carries hierarchy.** Large, confident type for headlines; a quiet, restrained body type. Generous letter/line spacing (the "give it air" move from AIR's brief, dialed back for restraint rather than futurism).
- **Muted, cohesive palette.** Pull 1 primary + 1-2 neutrals + 1 accent from the existing brand/photography — no gradient soup, no neon accents.
- **Scroll rhythm: even and unhurried.** Reveals should feel inevitable, not jarring. No competing parallax layers stacked on each other.

## 2. Motion (GSAP) — kept deliberately minimal
- Use GSAP + ScrollTrigger for **at most**:
  1. A single hero entrance sequence (video fade/scale-in + headline reveal)
  2. Section-level fade/slide-up on scroll-into-view (one consistent easing curve, reused everywhere — don't invent a new curve per section)
  3. One "hero moment" per page max (Silver Pinewood's "Territory section" equivalent) — a single scroll-triggered moment that's allowed to be a little more elaborate, e.g. a pinned section or a slow reveal tied to scroll position
- No scroll-jacking, no infinite marquees, no cursor-follower blobs, no simultaneous multi-axis parallax.
- Respect `prefers-reduced-motion`.

## 3. Hero Section (redo)
- Full-bleed background video (existing asset — do not replace with a placeholder or stock clip).
- Video delivered via the optimized GitHub-based approach in §5 — no new hosting service.
- `<video>` element: `autoplay muted loop playsinline`, with a poster frame (extracted still, WebP/AVIF) so the hero paints instantly before video weight arrives.
- Overlay: solid dark gradient (top/bottom only, no blur) at low opacity for text legibility — not a glass panel.
- **Preserve the existing hero headline text ("Masembe Companies")** — keep the copy as-is, but restyle it to fit the quiet-luxury direction: swap to a more restrained/refined typeface (large, confident, editorial — not the current styling), adjust weight/spacing/sizing to match the Silver Pinewood tone. Copy stays, presentation changes.
- Single CTA, no icon clutter.
- On load: hero video should lazy-init after first paint (poster shows immediately), so LCP isn't blocked by video weight.

## 3a. Loading Animation — preserve, do not remove
- The site's existing entry/loading animation stays in place. This is a UI + speed upgrade, not a removal of existing functional/brand elements.
- Restyle only if needed to match the new palette/typography (e.g. swap colors to the muted quiet-luxury palette) — but keep its existing motion behavior and trigger logic intact.
- Make sure it doesn't block or delay the hero video's lazy-init/poster paint described above — it should complete/dismiss cleanly into the redone hero.

## 4. Structure — unchanged
- Keep Car (Grid Motors Kla) and Real Estate (Masembe) as fully split pages/sections — same infrastructure, same routing.
- Keep current page/site infrastructure (React/Vite/Firebase stack, existing routes) — this is a UI + speed upgrade, not a rebuild.
- Keep all current real assets (photos, video). No placeholder imagery anywhere.

## 5. Video Delivery (speed fix — keep the existing video assets, no third-party stream host)
Stay with the video assets as they already are, in the repo. Raw `raw.githubusercontent.com` links directly are still the wrong move on their own — they're rate-limited and not fronted by a real CDN — but there's a way to get CDN-backed delivery from the exact same GitHub-hosted files without moving anything off-repo:

- **Front the existing GitHub assets with jsDelivr** instead of linking `raw.githubusercontent.com` directly:
  - `https://cdn.jsdelivr.net/gh/<user>/<repo>@<branch>/<path-to-video>`
  - jsDelivr pulls from the repo and serves it through an actual global CDN with proper caching — this is the "embed it like a YouTube link" pattern requested, just pointed at your own repo instead of a paid host.
  - Same pattern works for any other heavy static assets (images, fonts) currently loading slowly from the repo.
- **Compress the source video** before it's served (H.264/H.265 MP4, reasonable bitrate target for web — the goal is a materially smaller file, not just a different URL). This is the main lever — a CDN in front of an oversized file still loads slowly.
- Generate and ship a poster frame (extracted still) so the hero paints before the video arrives (see §3).
- Lazy-init the video after first paint rather than blocking on it.
- If a given video is large enough that even compressed-and-CDN'd it still feels slow, flag it back — chunked/adaptive streaming would need a dedicated video host, which is explicitly out of scope for this pass.

## 6. Explicit Don'ts
- No glassmorphism / frosted panels
- No decorative SVGs or emoji
- No new icon set beyond minimal functional glyphs
- No placeholder images/video — real assets only
- No restructuring of page infrastructure or routing
- No third-party video streaming service (Bunny/Cloudflare Stream, etc.) — stay on the existing repo-hosted assets, sped up via §5
- No removing the existing loading animation
- No rewriting the hero headline copy — restyle only
