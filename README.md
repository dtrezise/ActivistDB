# Claim / Cause

Claim / Cause is a public, source-led audit of Secretary of State Marco Rubio’s
July 16, 2026 speech on the “resurgence of political terrorism.” The site tests
30 discrete speech claims, documents 13 deliberately selected ANTIFA
attribution cases, and tracks the administration’s related policy campaign.

**Evidence current through October 7, 2026.** The October review was assisted
by OpenAI Codex. No independent human fact-check has yet been completed; that
limitation is disclosed on the site and in the machine-readable metadata.

## What is different about the evidence model

A true event does not automatically prove the identity, ideology,
organizational membership, terrorism classification, or international network
asserted around it. Each speech record therefore separates:

1. the underlying event;
2. actor attribution;
3. ideology attribution;
4. the terrorism threshold;
5. the organizational link; and
6. the larger network inference.

ANTIFA records separately score identity, conduct, motive, coordination,
command, network linkage, and adjudication. The 13 cases are a **purposive
sample of attribution problems**, not a prevalence sample and not a dataset
from which to infer how often an attribution is true or false.

## Public data

- `public/data/claims.json` and `claims.csv` — the 30 speech records
- `public/data/antifa-attributions.json` — the attribution audit
- `public/data/policy-context.json` — the political-framing audit
- `public/data/project-meta.json` — scope, provenance, review, and maintenance disclosures
- `public/data/research-log.json` — versioned editorial history
- `public/data/corrections.json` — public correction records
- `public/data/watchlist.json` — unresolved cases and review signals
- `public/data/rubio-speech-transcript.txt` — preserved supplied transcript

The transcript is anchored to the [official State Department video](https://www.youtube.com/watch?v=8Kv_XUGS0qs)
and its SHA-256 checksum is stored in `project-meta.json`.

## Source and legal-status policy

Court records and official statistics receive priority. Government releases
establish what a government did or alleged; they do not automatically prove an
underlying accusation. Indictments are allegations, probable-cause findings
are not verdicts, executive designations are not criminal convictions, and
unresolved defendants are presumed innocent.

Every source placement identifies its publisher, type, evidentiary role, and
access date. Every record has a last-review date, a next-review date, and a
reviewer disclosure. The full rubric and audit trail are published at
`/methodology/`.

## Daily maintenance

`.github/workflows/research-watch.yml` runs every day. It:

- validates the data and transcript checksum;
- checks unique source URLs for hard failures;
- queries a public news RSS index for recent candidate coverage on unresolved records;
- identifies records whose next-review date has arrived;
- uploads a complete report and refreshes one living editorial-review issue when attention is needed.

The monitor never changes a verdict. Candidate evidence must be checked against
the source hierarchy and edited through the normal reviewed Git workflow.

## Development

Requires Node.js 22 or later and pnpm.

```bash
pnpm install
pnpm dev
pnpm validate:data
pnpm lint
pnpm test
```

`pnpm build:pages` creates the GitHub Pages export under `out/`. The `main`
branch deploys through `.github/workflows/deploy-pages.yml` only after lint,
data validation, static export, and tests pass.

## Corrections and contributions

Open an issue with the record ID, disputed language, proposed correction, and a
primary or high-quality source. See [CONTRIBUTING.md](CONTRIBUTING.md). Material
changes must update both the structured record and the public research log.

## License

MIT. See [LICENSE](LICENSE).
