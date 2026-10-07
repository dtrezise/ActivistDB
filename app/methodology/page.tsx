import type { Metadata } from "next";
import correctionsJson from "@/app/data/corrections.json";
import metaJson from "@/app/data/project-meta.json";
import logJson from "@/app/data/research-log.json";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { formatDate } from "@/app/lib/research";

export const metadata: Metadata = {
  title: "Methodology, governance, and corrections",
  description:
    "The Claim / Cause evidence rubric, source policy, review disclosures, sampling limits, and public change record.",
  alternates: {
    canonical: "https://dtrezise.github.io/ActivistDB/methodology/",
  },
};

export default function MethodologyPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="methodology-hero">
          <div className="shell narrow-shell">
            <p className="eyebrow">Research standard · Version {metaJson.version}</p>
            <h1>Method, governance, and corrections</h1>
            <p className="hero-dek">
              This project is an evidence ledger, not a list of people to fear.
              It tests discrete public claims, records uncertainty, and keeps
              legal status separate from political characterization.
            </p>
            <div className="integrity-banner">
              <strong>Review disclosure</strong>
              <p>{metaJson.review.disclosure}</p>
              <p>
                Evidence current through {formatDate(metaJson.evidenceThrough)}.
                Maintainer: {metaJson.maintainer}.
              </p>
            </div>
          </div>
        </section>

        <section className="methodology-section">
          <div className="shell narrow-shell prose-grid">
            <article>
              <p className="eyebrow">Decision rule</p>
              <h2>Six questions, not one label</h2>
              <ol className="long-form-list">
                <li><strong>Event:</strong> Is the underlying event established?</li>
                <li><strong>Actor:</strong> Is responsibility adjudicated, corroborated, alleged, or unknown?</li>
                <li><strong>Ideology:</strong> What evidence—not identity or target alone—supports a political classification?</li>
                <li><strong>Terrorism threshold:</strong> Does the conduct meet a stated legal or analytic definition?</li>
                <li><strong>Organization:</strong> Is the actor an individual, temporary cell, named group, movement, or state?</li>
                <li><strong>Network:</strong> What proves command, financing, logistics, training, or operational coordination?</li>
              </ol>
              <p>
                The headline verdict summarizes the speech claim. The dimensional
                fields prevent a true event from laundering an unproven ideology,
                organizational tie, or global-network inference.
              </p>
            </article>

            <article>
              <p className="eyebrow">Source policy</p>
              <h2>What each source can prove</h2>
              <div className="policy-table" role="table" aria-label="Source hierarchy">
                <div role="row"><strong role="cell">Court records</strong><span role="cell">Pleadings, findings, judgments, and procedural status; an indictment remains an allegation.</span></div>
                <div role="row"><strong role="cell">Official statistics</strong><span role="cell">Counts under the issuing body’s definitions, which must be disclosed.</span></div>
                <div role="row"><strong role="cell">Government releases</strong><span role="cell">What the government did or alleged—not automatic proof of the allegation.</span></div>
                <div role="row"><strong role="cell">Independent reporting</strong><span role="cell">Corroborated facts, defense positions, and context absent from official accounts.</span></div>
                <div role="row"><strong role="cell">Research datasets</strong><span role="cell">Comparative patterns only after checking coding rules, denominators, and revisions.</span></div>
              </div>
            </article>

            <article>
              <p className="eyebrow">ANTIFA sampling</p>
              <h2>Representative of problems, not prevalence</h2>
              <p>{metaJson.scope.antifaSampling}</p>
              <p className="warning-copy">{metaJson.scope.prevalenceWarning}</p>
            </article>

            <article>
              <p className="eyebrow">Automation boundary</p>
              <h2>Monitor automatically; adjudicate deliberately</h2>
              <p>{metaJson.maintenance.automatedChecks}</p>
              <p>{metaJson.maintenance.editorialRule}</p>
              <p>
                Every structured record carries its last and next review dates.
                Validation fails if a record loses provenance, a dimension, or a
                presumption-of-innocence safeguard.
              </p>
            </article>

            <article>
              <p className="eyebrow">Primary record</p>
              <h2>Speech provenance</h2>
              <p>{metaJson.primarySpeech.transcriptProvenance}</p>
              <div className="source-links">
                <a href={metaJson.primarySpeech.officialVideo} target="_blank" rel="noreferrer">Official State Department video ↗</a>
                <a href={`${basePath}${metaJson.primarySpeech.localTranscript}`}>Local transcript</a>
              </div>
              <p className="hash-line">SHA-256: {metaJson.primarySpeech.transcriptSha256}</p>
            </article>
          </div>
        </section>

        <section className="change-section" id="corrections">
          <div className="shell narrow-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Public audit trail</p>
                <h2>Corrections and research log</h2>
              </div>
              <p>Substantive updates are recorded here and in Git history.</p>
            </div>
            <div className="change-grid">
              <div>
                <h3>Corrections</h3>
                {correctionsJson.map((item) => (
                  <article className="change-card" key={`${item.date}-${item.recordId}`}>
                    <time>{formatDate(item.date)}</time>
                    <strong>{item.recordId}</strong>
                    <p>{item.summary}</p>
                    <span>{item.changesAssessment ? "Assessment changed" : "Assessment unchanged"}</span>
                  </article>
                ))}
              </div>
              <div>
                <h3>Release history</h3>
                {logJson.map((item) => (
                  <article className="change-card" key={item.version}>
                    <time>{formatDate(item.date)}</time>
                    <strong>Version {item.version}</strong>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
