# PLP Changi · Singapore concept

This is the independent Changi front-end based on the **Pueblo La Perla Boracay** visual design language. It does not change the Boracay application or its live data.

- Source reference: https://plp-boracay.vercel.app/
- Designated repository: https://github.com/besfeng23/cbc
- Target production URL: https://plp-changi.vercel.app/
- Destination information source: https://changibc.org.sg/
- Planning source: CBC research document in Google Drive.

## What works

Static, responsive public multi-route preview with home, club heritage, stay, dining, recreation, 60+ chapter information and proposed activity themes, separate CBC membership explainer, events, gallery and contact. Mobile drawer, back/forward routing, accessible lightbox and an **email-draft-only** interest form are included.

## Explicit commercial and legal limits

**No PLP-CBC partnership is confirmed.** CBC's existing memberships are not PLP memberships. The Singapore PLP Club chapter is a proposal; the initial active PLP Club work is in Boracay. No rates, official PLP Changi enrolment, venue bookings, paid members, payment processing, activity sessions or chapter-specific privileges are represented as available.

The site uses Changi-area photographs from Wikimedia Commons with documented CC BY-SA or CC0 licensing and links to their creators and licenses in the site footer. They are **not photographs of Changi Beach Club facilities**. Real room, dining and sports facility images are replaced with clearly marked neutral placeholders until approved originals are supplied. A local `coastline.svg` fallback prevents a broken external image from leaving a blank hero. The site remains a concept preview with `noindex,nofollow` and must not imply a confirmed PLP–CBC partnership.

## Development

Pure static HTML/CSS/JS (no build dependencies). Vercel deploys the repository root; \`vercel.json\` rewrites page routes to \`index.html\`. Interactions are client-side, and the email interest form does not store personal data or submit it to an API. Verify every public route and mobile layout after deployment.

Production extensions should reuse the PLP Boracay membership API model only after Singapore-local privacy, venue, consent and identity safeguards are in place. Do not point Singapore at Boracay's production Supabase service role, member list or booking APIs.

## Verified mobile-image remediation — 2026-11-21

- **Observed failure:** Screenshot from a real mobile device showed a large red STOP graphic behind the PLP Changi hero, originating from an unverified CBC image URL. The fixed bottom action bar also crowded the mobile hero's CTA area.
- **Cause:** The first site version embedded speculative third-party `changibc.org.sg/wp-content/uploads/...` image paths without visually verifying the returned pictures. An image URL returning HTTP 200 is not proof that it is the intended photograph.
- **Correction:** All 26 speculative CBC image references were removed. Real Changi-area imagery uses licensed Commons sources with visible attribution; facility-specific images instead show honest placeholders. The mobile bottom action bar was removed, hero spacing and preview bar tightened, and the authentic PLP Boracay favicon reused. A locally hosted original illustrated coastline is the image-loading fallback.
- **Deployment lesson:** A GitHub `create_tree` call without `base_tree_sha` silently dropped `vercel.json` and README from the resulting commit even though its parent was correct; this caused direct `/club`, `/stay` and `/gallery` links to return 404. Recovered by restoring both files and verifying every direct route. For future multi-file updates, **always supply the current tree SHA as `base_tree_sha`**, or supply the entire intended tree; verify the final tree's file inventory before promoting it.
- **Verification evidence:** Vercel production deployment `dpl_AQ2rwphajk5wVtt6YRJ7guLWRLW4` at SHA `4431ef14e465c853a639abc7981b7eec1994dbb1` was READY. Homepage, nine secondary page paths, CSS, JS, both SVG assets returned HTTP 200. This is deployment/source verification; **a post-fix visual mobile screenshot and browser interaction QA remain outstanding**.
- **Security/operations:** No Supabase or Boracay production data modified. No CBC partnership, current membership benefits or scheduled Singapore activities should be asserted without approval.


## Shared editorial PLP crest (uploaded owner brand pack, 2026-11-21)

The original PLP Editorial Brand Pack is the source of truth. This repository now includes the **exact source bytes** of the brown-on-ivory vector crest, reversed ivory crest, web PNG/WebP, 512px app icon, 32/64px favicons, 180px Apple touch icon, and their author-provided USAGE instructions. Every asset was checked against the ZIP source via Git blob SHA-1. The global navigation swaps reversed ivory on dark photo backgrounds for the master brown vector on pale headers. The footer displays reversed ivory; browser/PWA icons use the supplied file variants. The text label 'Changi' is independent of the crest. No other PLP location's identity or images are reused.


## Oval-only browser / mobile icon correction — 2026-11-21

The owner's mobile screenshot showed a pale **square tile** surrounding the true oval monogram in Chrome's address suggestions. The original uploaded favicon-32.png, favicon-64.png and apple-touch-icon-180.png files were opaque across their entire square backgrounds. All browser/PWA PNG variants have now been **derived from the owner-supplied 4K transparent PLP master artwork**: alpha bounds cropped, oval faithfully resampled and proportionally centered on a square but fully transparent canvas. The oval artwork has not been redesigned.

Transparent RGBA replacements: 16/32/64px favicons, 180px Apple touch icon, 192px Android/PWA icon and 512px square app icon. Also added a transparent legacy favicon.ico. All have transparent RGBA=(0,0,0,0) corners. The existing original master SVG favicon stays transparent and unchanged. HTML icon/manifest links and manifest icon src now use a version query (`?v=oval-only-20261121`) so mobile browser caching is less likely to retain the previous square artwork. OS/browser-created tile frames are outside website control; the supplied assets no longer contain a cream background square.

PLP Boracay uses the identical derived set. This was an icon-only modification; the Singapore concept page, Club status, and Boracay data are unchanged.
