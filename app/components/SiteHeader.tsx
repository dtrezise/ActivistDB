import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="wordmark" aria-label="Claim / Cause home">
          CLAIM <span>/</span> CAUSE
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/#claims">Claims ledger</Link>
          <Link href="/antifa/">ANTIFA dossier</Link>
          <Link href="/#policy">Policy push</Link>
          <Link href="/methodology/">Method & corrections</Link>
        </nav>
      </div>
    </header>
  );
}
