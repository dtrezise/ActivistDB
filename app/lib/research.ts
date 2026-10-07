export type ResearchSource = {
  label: string;
  title: string;
  url: string;
  publisher: string;
  sourceType: string;
  evidenceRole: string;
  accessedAt: string;
  publishedAt?: string;
  locator?: string;
  archivedUrl?: string;
};

export type ReviewMeta = {
  reviewedAt: string;
  nextReviewAt: string;
  reviewer: string;
};

export const dimensionLabels: Record<string, string> = {
  event: "Event",
  actorAttribution: "Actor",
  ideologyAttribution: "Ideology",
  terrorismThreshold: "Terrorism threshold",
  organizationalLink: "Organization",
  networkInference: "Network inference",
  identity: "Identity",
  conduct: "Conduct",
  motive: "Motive",
  coordination: "Coordination",
  command: "Command",
  networkLink: "Network link",
  adjudication: "Adjudication",
};

export function humanize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}
