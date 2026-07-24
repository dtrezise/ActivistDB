import type { Metadata } from "next";
import Link from "next/link";
import attributionsJson from "@/app/data/antifa-attributions.json";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";

type Status = "confirmed" | "supported" | "mixed" | "pending" | "false";
type Source = { label: string; url: string };
type Attribution = {
  id: string;
  date: string;
  title: string;
  status: Status;
  claim: string;
  evidence: string;
  attribution: string;
  scope: string;
  sources: Source[];
};

const attributions = attributionsJson as Attribution[];

const statusLabel: Record<Status, string> = {
  confirmed: "Confirmed",
  supported: "Supported, qualified",
  mixed: "Mixed attribution",
  pending: "Pending",
  false: "False",
};

export const metadata: Metadata = {
  title: "The ANTIFA file",
  description:
    "What public evidence shows about Antifa as a movement, local organization, label, and source of correctly and falsely attributed political violence.",
  alternates: {
    canonical: "https://dtrezise.github.io/ActivistDB/antifa/",
  },
};

export default function AntifaPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="dossier-hero">
          <div className="shell dossier-hero-grid">
            <div>
              <p className="eyebrow">Research dossier · Evidence through July 24, 2026</p>
              <h1>
                The ANTIFA file:
                <br />
                <em>movement, groups, and myth.</em>
              </h1>
              <p className="hero-dek">
                “Antifa” can name a political tradition, a loose movement,
                specific local groups, a protest identity, or—in a few
                countries—a particular violent organization. Confusing those
                levels is the source of both denial and exaggeration.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#attributions">
                  Audit the attributions
                </a>
                <Link className="button button-secondary" href="/#claims">
                  Return to Rubio’s claims
                </Link>
              </div>
            </div>
            <aside className="dossier-answer">
              <p className="panel-kicker">Bottom line</p>
              <h2>Antifa is not one thing.</h2>
              <p>
                No public evidence establishes a U.S. national organization
                with central leaders, formal membership, a treasury, or a chain
                of command. Named local groups and ad hoc cells do organize,
                sometimes across cities. Some antifascist individuals and cells
                have committed serious violence. Specific European groups using
                the label are more cohesive and have carried out coordinated
                attacks.
              </p>
              <p>
                So “Antifa does not exist” is wrong. “Antifa is a unified global
                terrorist organization” is also unsupported.
              </p>
            </aside>
          </div>
        </section>

        <section className="definition-section">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Start with the noun</p>
                <h2>Four different things called “Antifa”</h2>
              </div>
              <p>
                An attribution is only as sound as the level it can actually
                prove.
              </p>
            </div>
            <div className="level-stack" aria-label="Levels of Antifa organization">
              <article>
                <span className="level-code">01 / tradition</span>
                <h3>Antifascism</h3>
                <p>
                  A century-old political tradition opposed to fascism. It
                  includes liberals, socialists, anarchists, communists, union
                  organizers, and people with no group affiliation. Most
                  antifascist activity is lawful.
                </p>
              </article>
              <article>
                <span className="level-code">02 / movement</span>
                <h3>U.S. “antifa”</h3>
                <p>
                  A decentralized militant tendency, usually radical-left and
                  anti-authoritarian. It has no verified national officers,
                  membership roll, headquarters, or single platform. FBI
                  Director Christopher Wray described it as more ideology or
                  movement than organization.
                </p>
              </article>
              <article>
                <span className="level-code">03 / groups & cells</span>
                <h3>Local organization</h3>
                <p>
                  Rose City Antifa, local affinity groups, Direct Action
                  Minnesota, and the Prairieland cell illustrate that
                  decentralized does not mean unorganized. People can plan,
                  share intelligence, raise money, and conspire locally without
                  answering to a national command.
                </p>
              </article>
              <article>
                <span className="level-code">04 / named foreign groups</span>
                <h3>Specific organizations</h3>
                <p>
                  Antifa Ost is a discrete German network accused of coordinated
                  cross-border assaults. It is analytically different from
                  treating every masked U.S. counterprotester as a member of the
                  same body.
                </p>
              </article>
            </div>
            <div className="definition-source">
              <p>
                <strong>Best-supported formulation:</strong> Antifa in the
                United States is a decentralized movement made up of autonomous
                individuals, affinity groups, and some named local
                organizations. Shared ideology and tactics do not, without more
                evidence, establish shared command or financing.
              </p>
              <div>
                <a
                  href="https://www.congress.gov/crs-product/IF10839"
                  target="_blank"
                  rel="noreferrer"
                >
                  Congressional Research Service ↗
                </a>
                <a
                  href="https://www.isdglobal.org/isd-explainer/us-antifa-groups/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Institute for Strategic Dialogue ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="practice-section">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">What participants actually do</p>
                <h2>A spectrum, not a single tactic</h2>
              </div>
              <p>
                The same label is used for public-source research, protest,
                confrontation, and occasionally serious crime.
              </p>
            </div>
            <div className="practice-grid">
              <article>
                <span>Common and lawful</span>
                <h3>Research & exposure</h3>
                <p>
                  Monitoring far-right forums, identifying participants,
                  publishing dossiers, warning venues or employers, and sharing
                  information with journalists or law enforcement.
                </p>
              </article>
              <article>
                <span>Common and lawful</span>
                <h3>Protest & mutual defense</h3>
                <p>
                  Counterdemonstrations, escorting targeted communities,
                  de-escalation, first aid, mutual aid, and efforts to deny
                  fascist groups public platforms.
                </p>
              </article>
              <article>
                <span>Contentious</span>
                <h3>Doxxing & deplatforming</h3>
                <p>
                  Publishing personal information and pressuring employers,
                  hosts, or platforms. These acts can be lawful, tortious, or
                  criminal depending on threats, accuracy, intent, and the data
                  disclosed.
                </p>
              </article>
              <article>
                <span>Tactic, not membership</span>
                <h3>Black bloc</h3>
                <p>
                  Coordinated black clothing and face covering can provide
                  anonymity and solidarity. Anarchists and other protesters also
                  use it. Clothing is evidence of a tactic, not proof of Antifa
                  membership.
                </p>
              </article>
              <article>
                <span>Unlawful</span>
                <h3>Assault & destruction</h3>
                <p>
                  Some self-identified militants have assaulted opponents,
                  damaged property, committed arson, and attacked government
                  facilities. Those acts should be attributed to proven actors,
                  cells, and conspiracies.
                </p>
              </article>
              <article>
                <span>Rare but grave</span>
                <h3>Lethal violence</h3>
                <p>
                  U.S. examples include Willem Van Spronsen’s failed ICE-facility
                  attack and Michael Reinoehl’s suspected killing of Aaron
                  Danielson. Neither reveals a national order or command chain.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="evidence-section">
          <div className="shell">
            <div className="section-heading inverse">
              <div>
                <p className="eyebrow">How to prove an attribution</p>
                <h2>Evidence must match the claim’s scale</h2>
              </div>
              <p>
                A self-label can establish individual affinity. It cannot, by
                itself, prove who directed or financed an act.
              </p>
            </div>
            <div className="evidence-ladder">
              <div>
                <span>Weak</span>
                <strong>Appearance</strong>
                <p>Black clothing, mask, symbol, target, or political identity.</p>
              </div>
              <div>
                <span>Relevant</span>
                <strong>Expression</strong>
                <p>Self-identification, manifesto, message, chant, or motive.</p>
              </div>
              <div>
                <span>Strong</span>
                <strong>Coordination</strong>
                <p>Planning chats, task assignments, shared logistics, money.</p>
              </div>
              <div>
                <span>Strongest</span>
                <strong>Adjudication</strong>
                <p>Tested evidence, conviction, authenticated records, findings.</p>
              </div>
            </div>
            <div className="evidence-warning">
              <strong>The recurring category error</strong>
              <p>
                Event → individual → local group → national movement → global
                network are five separate inferences. Evidence at one level does
                not automatically travel up the chain.
              </p>
            </div>
          </div>
        </section>

        <section className="attribution-section" id="attributions">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Attribution audit</p>
                <h2>What was correctly—and falsely—assigned</h2>
              </div>
              <p>
                Thirteen representative cases show the difference between a
                proven cell, a self-identified actor, a mixed crowd, and a
                viral rumor.
              </p>
            </div>
            <div className="attribution-key" aria-label="Attribution status legend">
              {(["confirmed", "supported", "mixed", "pending", "false"] as Status[]).map(
                (status) => (
                  <span className={`attribution-chip status-${status}`} key={status}>
                    {statusLabel[status]}
                  </span>
                ),
              )}
            </div>
            <div className="attribution-list">
              {attributions.map((item) => (
                <article className="attribution-card" key={item.id} id={item.id}>
                  <div className="attribution-meta">
                    <time>{item.date}</time>
                    <span className={`attribution-chip status-${item.status}`}>
                      {statusLabel[item.status]}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <div className="attribution-body">
                    <div>
                      <span className="record-label">Claim examined</span>
                      <p>{item.claim}</p>
                    </div>
                    <div>
                      <span className="record-label">Public evidence</span>
                      <p>{item.evidence}</p>
                    </div>
                    <div className="attribution-conclusion">
                      <span className="record-label">Assessment</span>
                      <p>{item.attribution}</p>
                      <span className="scope-label">{item.scope}</span>
                    </div>
                  </div>
                  <div className="source-links">
                    {item.sources.map((source) => (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        key={source.url}
                      >
                        {source.label} ↗
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="law-section">
          <div className="shell law-grid">
            <div>
              <p className="eyebrow">Law and labels</p>
              <h2>What the U.S. “designation” changes</h2>
            </div>
            <div className="law-copy">
              <p className="law-lead">
                The September 2025 executive order calls Antifa a “domestic
                terrorist organization.” Congress has not created a domestic
                designation list equivalent to the foreign-terrorist-
                organization statute.
              </p>
              <div className="law-points">
                <div>
                  <h3>Conduct is prosecutable</h3>
                  <p>
                    Arson, assault, threats, conspiracy, weapons offenses,
                    stalking, and material support for specified terrorist
                    crimes can already be charged when evidence satisfies the
                    statute.
                  </p>
                </div>
                <div>
                  <h3>Belief is protected</h3>
                  <p>
                    Anti-capitalist, anarchist, communist, antifascist, or
                    anti-government views are not crimes. The First Amendment
                    protects abstract advocacy and association, including
                    unpopular or radical ideas.
                  </p>
                </div>
                <div>
                  <h3>A label is not evidence</h3>
                  <p>
                    The executive order directs enforcement priorities but
                    cannot authenticate a membership list that does not exist or
                    prove that an accused person belongs to a national entity.
                  </p>
                </div>
              </div>
              <div className="source-links">
                <a
                  href="https://www.congress.gov/crs-product/R46829"
                  target="_blank"
                  rel="noreferrer"
                >
                  CRS — Federal law and constitutional issues ↗
                </a>
                <a
                  href="https://apnews.com/article/6ea07143e10bb811aa88b9da5aa26765"
                  target="_blank"
                  rel="noreferrer"
                >
                  AP — What the designation can do ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="takeaway-section">
          <div className="shell takeaway-grid">
            <div>
              <p className="eyebrow">Research judgment</p>
              <h2>What can responsibly be said</h2>
            </div>
            <div className="takeaway-copy">
              <p>
                Antifa-aligned political violence exists. In the United States
                it has usually come from individuals, affinity groups, or
                temporary local formations rather than a durable national
                hierarchy. The Prairieland case is important counterevidence to
                any claim that Antifa is “only an idea”: a jury found an
                organized local cell committed serious crimes.
              </p>
              <p>
                But the inverse leap remains unsupported. Local organization
                does not prove an American national command; a national movement
                label does not prove global integration; and the existence of
                Antifa Ost does not make every antifascist protester its member.
              </p>
              <p>
                The most accurate public description is therefore
                <strong> decentralized but sometimes organized</strong>,
                <strong> ideologically related but not uniformly directed</strong>,
                and <strong>capable of both lawful activism and real violence</strong>.
              </p>
              <a
                className="button button-primary"
                href={`${basePath}/data/antifa-attributions.json`}
              >
                Download the attribution data
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
