import type { Tender } from "./workspace";

export function Decision({ decision }: { decision?: Tender["decision"] }) {
  if (!decision) return <span className="text-muted-foreground">Not yet analyzed</span>;
  const kind = decision === "Go" ? "decision-go" : decision === "No-Go" ? "decision-no" : "decision-review";
  return <span className={`decision-pill ${kind}`}>{decision}</span>;
}
