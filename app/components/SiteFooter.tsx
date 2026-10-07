import Link from "next/link";
import metaJson from "@/app/data/project-meta.json";
import { formatDate } from "@/app/lib/research";

export function SiteFooter() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="wordmark footer-mark">
            CLAIM <span>/</span> CAUSE
          </p>
          <p className="footer-copy">
            A public-interest evidence ledger. Version {metaJson.version} ·
            Evidence through {formatDate(metaJson.evidenceThrough)}.
          </p>
          <p className="footer-disclosure">
            AI-assisted editorial review; independent human review pending.
          </p>
        </div>
        <div className="footer-links">
          <a href={`${basePath}/data/claims.json`}>Claims JSON</a>
          <a href={`${basePath}/data/claims.csv`}>Claims CSV</a>
          <a href={`${basePath}/data/antifa-attributions.json`}>
            ANTIFA attribution data
          </a>
          <a href={`${basePath}/data/policy-context.json`}>
            Political framing data
          </a>
          <a href={`${basePath}/data/project-meta.json`}>Project metadata</a>
          <a href={`${basePath}/data/research-log.json`}>Research log</a>
          <a href={`${basePath}/data/corrections.json`}>Corrections data</a>
          <Link href="/methodology/">Method & corrections</Link>
          <a
            href="https://github.com/dtrezise/ActivistDB"
            target="_blank"
            rel="noreferrer"
          >
            Source & corrections
          </a>
        </div>
      </div>
    </footer>
  );
}
