# Claim / Cause

Claim / Cause is a public, source-led audit of Secretary of State Marco Rubio’s
July 16, 2026 speech on the “resurgence of political terrorism.” It separates
each testable claim into:

- the underlying event;
- the responsible or accused actor;
- the actor’s evidenced political ideology;
- the legal and investigative status;
- the context needed to judge whether the event supports a broader claim of
  far-left terrorism.

The project also includes a dedicated ANTIFA dossier. It distinguishes
antifascism as a tradition, the decentralized U.S. movement, named local cells,
and specific foreign organizations. A separate attribution ledger tracks
confirmed cases, qualified attributions, pending allegations, and documented
false claims.

## Public data

- `public/data/claims.json` — all 30 speech-claim records
- `public/data/claims.csv` — generated spreadsheet-ready export
- `public/data/antifa-attributions.json` — ANTIFA attribution audit
- `public/data/policy-context.json` — political-framing and policy audit
- `public/data/rubio-speech-transcript.txt` — supplied source transcript

Each record links to its supporting sources. Recent defendants are presumed
innocent unless and until convicted, and unresolved records are explicitly
marked pending.

## Method

The audit asks five questions in order:

1. Did the event happen?
2. Who did it?
3. What evidence establishes ideology?
4. Does the conduct meet a defensible terrorism threshold?
5. What larger inference does the evidence actually support?

Court records and official statistics receive priority. Independent terrorism
and conflict datasets are used for comparisons. Government documents establish
what a government did or alleged; they do not automatically validate the
allegation.

## Development

Requires Node.js 22 or later and pnpm.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm test
```

`pnpm build` creates the Sites/Vinext production build. `pnpm build:pages`
creates the static GitHub Pages export under `out/`.

The `main` branch deploys automatically through
`.github/workflows/deploy-pages.yml`.

## Corrections

Open an issue with the record ID, the disputed language, and a primary or
high-quality source. A correction should update the structured data and the
assessment together so that the site and downloads remain synchronized.
