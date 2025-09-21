export function computeOverallScore(pages) {
  if (!pages || pages.length === 0) return 0;
  const totalViolations = pages.reduce(
    (sum, p) => sum + (p.counts?.violations || 0),
    0
  );
  const totalChecks = pages.reduce(
    (sum, p) =>
      sum +
      ((p.counts?.violations || 0) +
        (p.counts?.passes || 0) +
        (p.counts?.incomplete || 0) +
        (p.counts?.inapplicable || 0)),
    0
  );
  if (totalChecks === 0) return 0;
  return Math.round(((totalChecks - totalViolations) / totalChecks) * 100);
}
