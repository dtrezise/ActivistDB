import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dtrezise.github.io/ActivistDB/"),
  title: {
    default: "Claim / Cause — Rubio’s terrorism speech, audited",
    template: "%s — Claim / Cause",
  },
  description:
    "A source-led audit of claims about far-left terrorism, the actors involved, their ideologies, and the evidence for—or against—each attribution.",
  alternates: {
    canonical: "https://dtrezise.github.io/ActivistDB/",
  },
  openGraph: {
    title: "Claim / Cause",
    description: "Rubio’s terrorism speech, audited claim by claim.",
    type: "website",
    url: "https://dtrezise.github.io/ActivistDB/",
    images: [
      {
        url: "https://dtrezise.github.io/ActivistDB/og-claim-cause.png",
        width: 1731,
        height: 909,
        alt: "Claim / Cause — Rubio’s terrorism speech, audited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claim / Cause",
    description: "Rubio’s terrorism speech, audited claim by claim.",
    images: ["https://dtrezise.github.io/ActivistDB/og-claim-cause.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe6",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
