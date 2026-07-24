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
            A public-interest evidence ledger. Version 1.0 · Updated July 24,
            2026.
          </p>
        </div>
        <div className="footer-links">
          <a href={`${basePath}/data/claims.json`}>Claims JSON</a>
          <a href={`${basePath}/data/claims.csv`}>Claims CSV</a>
          <a href={`${basePath}/data/antifa-attributions.json`}>
            ANTIFA attribution data
          </a>
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
