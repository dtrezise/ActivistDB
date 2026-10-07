"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import claimsJson from "@/app/data/claims.json";
import policyJson from "@/app/data/policy-context.json";
import metaJson from "@/app/data/project-meta.json";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import {
  DimensionGrid,
  RecordReview,
  SourceList,
} from "@/app/components/ResearchRecord";
import { formatDate, type ResearchSource } from "@/app/lib/research";

type Verdict =
  | "supported"
  | "supported-context"
  | "mixed"
  | "misleading"
  | "unsupported"
  | "pending";

type Claim = {
  id: string;
  number: number;
  title: string;
  quote: string;
  period: string;
  region: string;
  category: string;
  verdict: Verdict;
  confidence: string;
  actors: string;
  ideology: string;
  finding: string;
  context: string;
  legalStatus: string;
  sources: ResearchSource[];
  reviewedAt: string;
  nextReviewAt: string;
  reviewer: string;
  dimensions: Record<string, string>;
};

const claims = claimsJson as Claim[];

type PolicyContext = {
  id: string;
  claim: string;
  verdict: Verdict;
  finding: string;
  significance: string;
  sources: ResearchSource[];
  reviewedAt: string;
  nextReviewAt: string;
  reviewer: string;
};

const policyContext = policyJson as PolicyContext[];

const verdictMeta: Record<
  Verdict,
  { label: string; short: string; description: string }
> = {
  supported: {
    label: "Supported",
    short: "Supported",
    description: "The central factual claim is borne out by the evidence.",
  },
  "supported-context": {
    label: "Supported · context missing",
    short: "Needs context",
    description:
      "The number or event is real, but an omitted denominator or fact changes its meaning.",
  },
  mixed: {
    label: "Mixed",
    short: "Mixed",
    description:
      "Some elements are supported while a material part is unproven or overstated.",
  },
  misleading: {
    label: "Misleading",
    short: "Misleading",
    description:
      "The framing produces an inference that the underlying evidence does not support.",
  },
  unsupported: {
    label: "Unsupported",
    short: "Unsupported",
    description: "No public evidence located substantiates the central claim.",
  },
  pending: {
    label: "Pending",
    short: "Pending",
    description:
      "The event is recent or the case unresolved; attribution should remain provisional.",
  },
};

const verdictOrder: Verdict[] = [
  "supported",
  "supported-context",
  "mixed",
  "misleading",
  "unsupported",
  "pending",
];

function ClaimCard({ claim }: { claim: Claim }) {
  const meta = verdictMeta[claim.verdict];

  return (
    <article className="claim-card" id={claim.id}>
      <div className="claim-topline">
        <span className="claim-number">
          {String(claim.number).padStart(2, "0")}
        </span>
        <span className={`verdict verdict-${claim.verdict}`}>{meta.label}</span>
        <span className="claim-period">{claim.period}</span>
      </div>
      <h3>{claim.title}</h3>
      <blockquote>“{claim.quote}”</blockquote>
      <p className="finding">{claim.finding}</p>
      <DimensionGrid dimensions={claim.dimensions} />
      <details>
        <summary>Open evidence record</summary>
        <div className="record-grid">
          <div>
            <span className="record-label">Who is actually involved</span>
            <p>{claim.actors}</p>
          </div>
          <div>
            <span className="record-label">Political position / ideology</span>
            <p>{claim.ideology}</p>
          </div>
          <div>
            <span className="record-label">Missing or corrective context</span>
            <p>{claim.context}</p>
          </div>
          <div>
            <span className="record-label">Case status</span>
            <p>{claim.legalStatus}</p>
          </div>
        </div>
        <div className="source-row">
          <span className="record-label">Sources and evidentiary role</span>
          <SourceList sources={claim.sources} />
        </div>
        <p className="confidence">Assessment confidence: {claim.confidence}</p>
        <RecordReview
          reviewedAt={claim.reviewedAt}
          nextReviewAt={claim.nextReviewAt}
          reviewer={claim.reviewer}
        />
      </details>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [verdict, setVerdict] = useState<"all" | Verdict>("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => [...new Set(claims.map((claim) => claim.category))].sort(),
    [],
  );

  const counts = useMemo(
    () =>
      verdictOrder.reduce(
        (result, item) => {
          result[item] = claims.filter((claim) => claim.verdict === item).length;
          return result;
        },
        {} as Record<Verdict, number>,
      ),
    [],
  );

  const visibleClaims = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return claims.filter((claim) => {
      const matchesText =
        !normalized ||
        [
          claim.title,
          claim.quote,
          claim.region,
          claim.actors,
          claim.ideology,
          claim.finding,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesVerdict =
        verdict === "all" || claim.verdict === verdict;
      const matchesCategory =
        category === "all" || claim.category === category;
      return matchesText && matchesVerdict && matchesCategory;
    });
  }, [category, query, verdict]);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                ActivistDB investigation · Evidence through {formatDate(metaJson.evidenceThrough)}
              </p>
              <h1>
                Rubio’s terrorism case,
                <br />
                <em>tested claim by claim.</em>
              </h1>
              <p className="hero-dek">
                On July 16, Secretary of State Marco Rubio argued that a
                resurgent, transnational far-left terrorist network now
                threatens the West. We separated 30 testable claims from the
                rhetoric, identified the actual actors, and checked each
                inference against public evidence.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#claims">
                  Explore the claims
                </a>
                <Link className="button button-secondary" href="/antifa/">
                  Read the ANTIFA dossier
                </Link>
              </div>
              <p className="source-note">
                Claim extraction uses the preserved user-supplied transcript,
                anchored to the official State Department video. Court records,
                official data, and independent reporting are linked by role in
                every entry.
              </p>
            </div>
            <aside className="finding-panel" aria-label="Central finding">
              <p className="panel-kicker">The finding</p>
              <p className="panel-number">01</p>
              <h2>History is real. The present-day network case is not made.</h2>
              <p>
                Rubio names several genuine far-left terrorist organizations
                from the 1970s–1990s. His contemporary case is weaker: it mixes
                proven cells, unresolved crimes, lone actors, personal identity,
                and ideological speculation—then treats the bundle as one
                coordinated global system.
              </p>
              <div className="finding-rule" />
              <p className="finding-small">
                The record supports vigilance toward violence from the left. It
                does not support assigning every cited act—or all of
                “Antifa”—to a single organization.
              </p>
            </aside>
          </div>
        </section>

        <section className="freshness-strip" aria-label="Research status">
          <div className="shell freshness-grid">
            <div>
              <span>Evidence through</span>
              <strong>{formatDate(metaJson.evidenceThrough)}</strong>
            </div>
            <div>
              <span>Method</span>
              <strong>Six-dimensional claim testing</strong>
            </div>
            <div>
              <span>Disclosure</span>
              <strong>Independent human review pending</strong>
            </div>
            <Link href="/methodology/">Read the standard →</Link>
          </div>
        </section>

        <section className="verdict-section" aria-labelledby="verdict-heading">
          <div className="shell">
            <div className="section-heading compact-heading">
              <div>
                <p className="eyebrow">At a glance</p>
                <h2 id="verdict-heading">What survived scrutiny</h2>
              </div>
              <p>
                A “supported” rating validates a specific claim—not the speech’s
                larger theory.
              </p>
            </div>
            <div className="verdict-grid">
              {verdictOrder.map((item) => (
                <button
                  className={`verdict-stat verdict-stat-${item}`}
                  key={item}
                  onClick={() => {
                    setVerdict(item);
                    document
                      .getElementById("claims")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <strong>{counts[item]}</strong>
                  <span>{verdictMeta[item].short}</span>
                </button>
              ))}
            </div>
            <div className="signal-grid">
              <div>
                <span className="signal-index">A</span>
                <h3>Historical core</h3>
                <p>
                  Red Brigades, RAF, 17 November, Shining Path, the BLA, and the
                  SLA are accurately identified as violent revolutionary-left
                  actors.
                </p>
              </div>
              <div>
                <span className="signal-index">B</span>
                <h3>Current uptick</h3>
                <p>
                  Some recent left-coded violence is real, but it rose from a
                  low base and remains less lethal than modern far-right and
                  jihadist violence in the principal U.S. comparisons.
                </p>
              </div>
              <div>
                <span className="signal-index">C</span>
                <h3>Network leap</h3>
                <p>
                  Public evidence does not show the common command, money,
                  training, safe houses, or Iran-linked infrastructure alleged
                  in the speech.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="antifa-promo">
          <div className="shell promo-grid">
            <div>
              <p className="eyebrow">New research dossier</p>
              <h2>Is ANTIFA an organization?</h2>
            </div>
            <div>
              <p>
                The accurate answer is more demanding than “yes” or “no.” There
                is no demonstrated U.S. national command, but named local groups,
                temporary cells, and specific European organizations do exist.
                Our dossier audits confirmed violence, pending allegations, and
                durable false attributions.
              </p>
              <Link href="/antifa/" className="text-link">
                Open the full ANTIFA research file <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="claims-section" id="claims">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">The evidence ledger</p>
                <h2>30 testable claims</h2>
              </div>
              <p>
                Search a name or place. Filter by evidentiary result. Open any
                card for actor, ideology, legal status, context, and sources.
              </p>
            </div>
            <div className="filters" aria-label="Filter claims">
              <label className="search-field">
                <span className="sr-only">Search claims</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search people, groups, places…"
                />
              </label>
              <label>
                <span className="sr-only">Filter by verdict</span>
                <select
                  value={verdict}
                  onChange={(event) =>
                    setVerdict(event.target.value as "all" | Verdict)
                  }
                >
                  <option value="all">All verdicts</option>
                  {verdictOrder.map((item) => (
                    <option value={item} key={item}>
                      {verdictMeta[item].label} ({counts[item]})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Filter by category</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              {(query || verdict !== "all" || category !== "all") && (
                <button
                  className="clear-button"
                  onClick={() => {
                    setQuery("");
                    setVerdict("all");
                    setCategory("all");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="results-line" aria-live="polite">
              Showing {visibleClaims.length} of {claims.length} records
            </div>
            <div className="claims-grid">
              {visibleClaims.map((claim) => (
                <ClaimCard claim={claim} key={claim.id} />
              ))}
            </div>
            {visibleClaims.length === 0 && (
              <div className="empty-state">
                No claim matches these filters. Try a broader search.
              </div>
            )}
          </div>
        </section>

        <section className="policy-section" id="policy">
          <div className="shell">
            <div className="section-heading inverse">
              <div>
                <p className="eyebrow">The administration’s push</p>
                <h2>From campaign frame to enforcement architecture</h2>
              </div>
              <p>
                The political category expands beyond people accused of
                violence. Two days before Rubio’s summit, House leadership
                framed democratic-socialist candidates as communist enemies
                already inside the country.
              </p>
            </div>
            <article className="framing-brief">
              <div>
                <time>July 14, 2026</time>
                <p className="panel-kicker">The missing starting document</p>
                <h3>“The barbarians are inside the gate.”</h3>
              </div>
              <div>
                <p>
                  Speaker Mike Johnson’s official release is not a terrorism
                  assessment. It is evidence of the electoral frame surrounding
                  the policy push. Johnson accurately quotes several radical
                  proposals in DSA’s new program, then conflates democratic
                  socialism with communism, treats policy advocacy as an
                  internal civilizational threat, and offers no evidence tying
                  DSA candidates to terrorist violence.
                </p>
                <div className="source-links">
                  <a
                    href="https://mikejohnson.house.gov/news/documentsingle.aspx?DocumentID=2917"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Speaker Johnson’s release ↗
                  </a>
                  <a
                    href="https://program.dsausa.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read the DSA program ↗
                  </a>
                  <a
                    href="https://apnews.com/article/5381c24e8eb4235ae993e812ad45ffbd"
                    target="_blank"
                    rel="noreferrer"
                  >
                    AP — Midterm messaging context ↗
                  </a>
                </div>
              </div>
            </article>
            <div className="policy-audit-grid">
              {policyContext.map((item) => (
                <article key={item.id}>
                  <span className={`verdict verdict-${item.verdict}`}>
                    {verdictMeta[item.verdict].label}
                  </span>
                  <h3>{item.claim}</h3>
                  <p>{item.finding}</p>
                  <details>
                    <summary>Why the distinction matters</summary>
                    <p>{item.significance}</p>
                    <SourceList sources={item.sources} />
                    <RecordReview
                      reviewedAt={item.reviewedAt}
                      nextReviewAt={item.nextReviewAt}
                      reviewer={item.reviewer}
                    />
                  </details>
                </article>
              ))}
            </div>
            <p className="timeline-label">Enforcement timeline</p>
            <div className="timeline">
              <article>
                <time>Sep. 2025</time>
                <span className="timeline-dot" />
                <h3>White House “designates” Antifa</h3>
                <p>
                  An executive order calls Antifa a domestic terrorist
                  organization. Federal law still provides no domestic
                  equivalent to the State Department’s foreign-terrorist list.
                </p>
                <a
                  href="https://www.whitehouse.gov/presidential-actions/2025/09/designating-antifa-as-a-domestic-terrorist-organization/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the order ↗
                </a>
              </article>
              <article>
                <time>Sep. 2025</time>
                <span className="timeline-dot" />
                <h3>NSPM-7 widens the frame</h3>
                <p>
                  The memorandum links violence to “anti-capitalism,”
                  “anti-Christianity,” and views on migration, race, and gender,
                  raising First Amendment and overbreadth concerns.
                </p>
                <a
                  href="https://www.whitehouse.gov/presidential-actions/2025/09/countering-domestic-terrorism-and-organized-political-violence/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read NSPM-7 ↗
                </a>
              </article>
              <article>
                <time>Nov.–Dec. 2025</time>
                <span className="timeline-dot" />
                <h3>Four foreign groups, $10 million reward</h3>
                <p>
                  State designates four European militant groups and offers a
                  reward for financing information. AP found little public
                  evidence that the four share resources.
                </p>
                <a
                  href="https://apnews.com/article/a4f0b5f733e9a105101107b0c80d482e"
                  target="_blank"
                  rel="noreferrer"
                >
                  Review the evidence ↗
                </a>
              </article>
              <article>
                <time>Jul. 2026</time>
                <span className="timeline-dot" />
                <h3>Global ministerial and Rubio’s thesis</h3>
                <p>
                  Officials from more than 60 countries convene as State argues
                  for coordinated intelligence, financial targeting, and new
                  designations.
                </p>
                <a
                  href="https://apnews.com/article/e1dad3924bd1b018e43d5b89ac07bb0b"
                  target="_blank"
                  rel="noreferrer"
                >
                  AP conference report ↗
                </a>
              </article>
              <article>
                <time>Jul. 2026</time>
                <span className="timeline-dot" />
                <h3>Visa restrictions broaden the enforcement perimeter</h3>
                <p>
                  State announces restrictions covering members and supporters
                  accused of incitement, logistics, financing, violent crime,
                  and broadly described economic sabotage.
                </p>
                <a
                  href="https://ebs.publicnow.com/view/594EC5E4BA763F565AF8E7CD49E08061796F055B"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the policy ↗
                </a>
              </article>
              <article>
                <time>Aug. 2026</time>
                <span className="timeline-dot" />
                <h3>Treasury sanctions groups and digital infrastructure</h3>
                <p>
                  OFAC sanctions Autistici/Inventati, Palestine Action, Masar
                  Badil, and two leaders. The action is legally consequential;
                  the public notice supplies allegations, not an adjudicated
                  criminal record.
                </p>
                <a
                  href="https://home.treasury.gov/news/press-releases/sb0616/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read Treasury’s notice ↗
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="method-section" id="method">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Method & limits</p>
                <h2>Five questions, in order</h2>
              </div>
              <p>
                The investigation does not infer ideology from a target,
                demographic identity, or social-media slogan alone.
              </p>
            </div>
            <ol className="method-grid">
              <li>
                <span>01</span>
                <h3>Did the event happen?</h3>
                <p>Verify date, casualties, target, conduct, and source quality.</p>
              </li>
              <li>
                <span>02</span>
                <h3>Who did it?</h3>
                <p>
                  Separate conviction, charge, official attribution, claim of
                  responsibility, and speculation.
                </p>
              </li>
              <li>
                <span>03</span>
                <h3>What was the ideology?</h3>
                <p>
                  Use an actor’s program, communications, affiliations, and
                  target selection—not personal identity.
                </p>
              </li>
              <li>
                <span>04</span>
                <h3>Was it terrorism?</h3>
                <p>
                  Test violence plus political coercion. Not every riot, hate
                  crime, murder, or act of sabotage meets the same legal test.
                </p>
              </li>
              <li>
                <span>05</span>
                <h3>What does it prove?</h3>
                <p>
                  A left-motivated act proves that act. A network claim needs
                  evidence of coordination, direction, finance, or logistics.
                </p>
              </li>
            </ol>
            <div className="method-notes">
              <div>
                <h3>Source hierarchy</h3>
                <p>
                  Court records and official statistics first; independent
                  conflict and terrorism datasets next; credible reporting for
                  facts not yet adjudicated. Government documents establish
                  what a government did or alleged—not automatically that the
                  allegation is true.
                </p>
              </div>
              <div>
                <h3>Living record</h3>
                <p>
                  Recent cases are marked pending and defendants are presumed
                  innocent. Ratings should change when charges, judgments, or
                  credible new evidence change the record. Every entry now shows
                  its review date and next scheduled review.
                </p>
              </div>
              <div>
                <h3>Get the data</h3>
                <p>
                  Download the{" "}
                  <a href={`${basePath}/data/claims.json`}>JSON</a>,{" "}
                  <a href={`${basePath}/data/claims.csv`}>CSV</a>, or{" "}
                  <a href={`${basePath}/data/rubio-speech-transcript.txt`}>
                    source transcript
                  </a>
                  . Corrections can be filed in the public repository.
                </p>
              </div>
              <div>
                <h3>Governance</h3>
                <p>
                  Read the full <Link href="/methodology/">verdict rubric,
                  sampling limits, review disclosure, and corrections log</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
