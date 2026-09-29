import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/features/tenders/header";
import { Decision } from "@/features/tenders/decision";
import { useWorkspace } from "@/features/tenders/workspace";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Tender Dashboard — Tender AI Platform" },
    { name: "description", content: "Review tender documents and their Go/No-Go decisions in the Tender AI workspace." },
    { property: "og:title", content: "Tender Dashboard — Tender AI Platform" },
    { property: "og:description", content: "Review tender documents and their Go/No-Go decisions in the Tender AI workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const { tenders } = useWorkspace();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => tenders.filter((t) => `${t.name} ${t.authority} ${t.decision ?? ""}`.toLowerCase().includes(search.toLowerCase())), [tenders, search]);
  const ready = tenders.filter((t) => t.status === "Ready").length;
  const go = tenders.filter((t) => t.decision === "Go").length;
  const review = tenders.filter((t) => t.decision === "Conditional Go").length;
  return <><Header /><main>
    <section className="border-b border-border bg-surface"><div className="mx-auto max-w-[1220px] px-5 pb-9 pt-12 md:px-8 md:pt-15">
      <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow mb-4">BID TEAM INTELLIGENCE / WORKSPACE</p><h1 className="font-display text-4xl font-semibold leading-tight md:text-[48px]">Tender dashboard<span className="text-primary">.</span></h1><p className="mt-3 max-w-xl text-base text-muted-foreground">Your documents, decisions, and next steps — all in one place.</p></div><Button size="lg" asChild><Link to="/upload"><Upload /> Upload tender <ArrowRight /></Link></Button></div>
    </div></section>
    <section className="mx-auto max-w-[1220px] px-5 py-9 md:px-8"><div className="grid grid-cols-2 gap-0 border-y border-border md:grid-cols-4"><Metric label="TOTAL TENDERS" value={String(tenders.length).padStart(2, "0")} note="In this workspace" /><Metric label="READY TO REVIEW" value={String(ready).padStart(2, "0")} note="Analysis available" /><Metric label="GO DECISIONS" value={String(go).padStart(2, "0")} note="Eligible to pursue" /><Metric label="NEEDS REVIEW" value={String(review).padStart(2, "0")} note="Conditional decisions" /></div>
      <div className="mb-5 mt-12 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">DOCUMENT LIBRARY</p><h2 className="mt-2 font-display text-2xl font-semibold md:text-[28px]">Previous tenders</h2></div><label className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-muted-foreground focus-within:ring-1 focus-within:ring-ring sm:w-72"><Search size={17} /><input aria-label="Search tenders" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tenders" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" /></label></div>
      <div className="hidden overflow-x-auto border border-border bg-background md:block"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead className="bg-surface text-[11px] font-bold text-muted-foreground"><tr><th className="px-5 py-4 font-semibold">TENDER DOCUMENT</th><th className="px-4 py-4 font-semibold">ISSUING AUTHORITY</th><th className="px-4 py-4 font-semibold">STATUS</th><th className="px-4 py-4 font-semibold">GO / NO-GO</th><th className="px-4 py-4 font-semibold">UPLOADED</th><th className="w-10"><span className="sr-only">Open</span></th></tr></thead><tbody>{filtered.map((tender) => <tr key={tender.id} className="group border-t border-border transition-colors hover:bg-surface"><td className="px-5 py-4"><Link to="/tenders/$id" params={{ id: tender.id }} className="flex items-start gap-3 text-foreground focus-visible:outline-primary"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm bg-accent text-primary"><FileText size={16} /></span><span className="min-w-0"><span className="block max-w-[250px] break-words font-semibold group-hover:text-primary">{tender.name}</span><span className="mt-1 block text-xs text-muted-foreground">{tender.pages ? `${tender.pages} pages · PDF` : "PDF · Awaiting analysis"}</span></span></Link></td><td className="px-4 py-4 text-muted-foreground">{tender.authority}</td><td className="px-4 py-4"><span className={tender.status === "Ready" ? "status-ready" : "status-uploaded"}>{tender.status}</span></td><td className="px-4 py-4"><Decision decision={tender.decision} /></td><td className="px-4 py-4 text-muted-foreground">{tender.date}</td><td className="pr-5 text-primary"><Link to="/tenders/$id" params={{ id: tender.id }} aria-label={`View ${tender.name}`}><ArrowRight size={17} /></Link></td></tr>)}</tbody></table></div>
      <div className="divide-y divide-border border-y border-border md:hidden">{filtered.map((tender) => <Link key={tender.id} to="/tenders/$id" params={{ id: tender.id }} className="block py-5"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-accent text-primary"><FileText size={17} /></span><div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{tender.name}</p><p className="mt-1 text-xs text-muted-foreground">{tender.pages ? `${tender.pages} pages · ` : ""}{tender.date}</p></div><ArrowRight size={17} className="mt-2 shrink-0 text-primary" /></div><div className="mt-3 flex items-center gap-2 pl-12"><span className={tender.status === "Ready" ? "status-ready" : "status-uploaded"}>{tender.status}</span><Decision decision={tender.decision} /></div></Link>)}</div>
      {filtered.length === 0 && <div className="border border-border px-5 py-12 text-center text-muted-foreground">No tenders match your search.</div>}
      <p className="mt-4 text-xs text-muted-foreground">Sample records are shown for the redesign. New uploads are held in this browser session; analysis requires a connected processing service.</p>
    </section>
  </main></>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="border-r border-border px-4 py-5 last:border-r-0 first:pl-0 max-md:nth-[2]:border-r-0 md:px-7"><p className="text-[10px] font-bold text-muted-foreground">{label}</p><p className="mt-3 font-display text-4xl font-semibold leading-none text-foreground">{value}</p><p className="mt-2 text-xs text-muted-foreground">{note}</p></div>;
}
