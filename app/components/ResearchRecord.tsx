import {
  dimensionLabels,
  formatDate,
  humanize,
  type ResearchSource,
  type ReviewMeta,
} from "@/app/lib/research";

export function DimensionGrid({ dimensions }: { dimensions: Record<string, string> }) {
  return (
    <dl className="dimension-grid" aria-label="Dimensional assessment">
      {Object.entries(dimensions).map(([key, value]) => (
        <div key={key}>
          <dt>{dimensionLabels[key] ?? humanize(key)}</dt>
          <dd>{humanize(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SourceList({ sources }: { sources: ResearchSource[] }) {
  return (
    <ol className="source-list">
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.title || source.label}
            <span aria-hidden="true"> ↗</span>
          </a>
          <span>
            {source.publisher} · {humanize(source.sourceType)} · {source.evidenceRole}
            {source.accessedAt ? ` · accessed ${formatDate(source.accessedAt)}` : ""}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function RecordReview({ reviewedAt, nextReviewAt, reviewer }: ReviewMeta) {
  return (
    <div className="record-review">
      <span>Reviewed {formatDate(reviewedAt)}</span>
      <span>Next review {formatDate(nextReviewAt)}</span>
      <span>{reviewer}</span>
    </div>
  );
}
