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

All photographs are hotlinked as design references from CBC's existing website. Written permission to use or republish images and brand assets must be confirmed before an unrestricted commercial launch. This preview is marked \`noindex,nofollow\`.

## Development

Pure static HTML/CSS/JS (no build dependencies). Vercel deploys the repository root; \`vercel.json\` rewrites page routes to \`index.html\`. Interactions are client-side, and the email interest form does not store personal data or submit it to an API. Verify every public route and mobile layout after deployment.

Production extensions should reuse the PLP Boracay membership API model only after Singapore-local privacy, venue, consent and identity safeguards are in place. Do not point Singapore at Boracay's production Supabase service role, member list or booking APIs.