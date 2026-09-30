import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/features/tenders/header";
import { AnalysisPreview } from "@/features/tenders/analysis-preview";
import { useWorkspace } from "@/features/tenders/workspace";

export const Route = createFileRoute("/tenders/$id")({ head: () => ({ meta: [
  { title: "Tender Analysis — Tender AI Platform" }, { name: "description", content: "Explore tender decisions, synopsis, company checklist, and risk review." },
  { property: "og:title", content: "Tender Analysis — Tender AI Platform" }, { property: "og:description", content: "Explore tender decisions, synopsis, company checklist, and risk review." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: TenderDetail });

function TenderDetail() {
  const { id } = Route.useParams();
  const { tenders } = useWorkspace();
  const tender = tenders.find((entry) => entry.id === id);
  if (!tender) return <><Header /><main className="mx-auto max-w-[1220px] px-5 py-20 md:px-8"><h1 className="font-display text-3xl font-semibold">Tender not found</h1><Link to="/" className="mt-5 inline-flex items-center gap-2 text-primary"><ArrowLeft size={16} /> Back to dashboard</Link></main></>;
  return <><Header /><main>
    <section className="border-b border-border bg-surface"><div className="mx-auto max-w-[1220px] px-5 pb-8 pt-10 md:px-8 md:pt-12"><Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> All tenders</Link><p className="eyebrow mb-3">TENDER / REVIEW</p><div className="flex flex-wrap items-center gap-x-4 gap-y-3"><h1 className="font-display text-3xl font-semibold leading-tight md:text-[42px]">Tender analysis<span className="text-primary">.</span></h1><span className={tender.status === "Ready" ? "status-ready" : "status-uploaded"}>{tender.status}</span>{tender.pages && <span className="text-sm text-muted-foreground">{tender.pages}/{tender.pages} pages in sample</span>}</div><p className="mt-3 break-words text-sm text-muted-foreground">{tender.name} · {tender.authority} · Uploaded {tender.date}</p></div></section>
    <section className="mx-auto max-w-[1220px] px-5 py-8 md:px-8 md:py-10"><AnalysisPreview tender={tender} /></section>
  </main></>;
}