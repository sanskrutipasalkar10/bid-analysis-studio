import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Decision } from "./decision";
import type { Tender } from "./workspace";

const mainTabs = [
  { value: "go", label: "Go / No-Go" },
  { value: "synopsis", label: "Synopsis" },
  { value: "company", label: "Company Checklist" },
  { value: "risk", label: "Risk Finder" },
];

const factors = [
  ["PQ Eligibility", "30%", 80], ["Similar Experience", "20%", 95],
  ["Technical Capability", "15%", 95], ["Government/PSU Experience", "10%", 85],
  ["Key Manpower", "10%", 70], ["Financial Capability", "5%", 90],
  ["Strategic Relevance", "5%", 100], ["Partner/OEM Availability", "5%", 50],
] as const;

const criteria = [
  ["Legal entity / Section 8 eligibility", "Indian registered company or eligible legal entity", "Registered company", "Pass"],
  ["PAN", "Valid PAN registration", "PAN on company profile", "Pass"],
  ["GST registration", "Valid GST registration", "GSTIN on company profile", "Pass"],
  ["Average annual turnover", "Minimum turnover for the last three financial years", "Financial statements required", "Needs review"],
  ["Similar project experience", "Relevant completed work in the sector", "Supporting contracts required", "Needs review"],
] as const;

const documents = [
  "Certified audited balance sheets or a turnover certificate for the relevant period.",
  "Copies of relevant contracts or work orders supporting similar experience.",
  "Certificate of incorporation and current registration documents.",
  "PAN card and GST registration certificate.",
  "Signed declarations and other documents required by the tender.",
];

const qualification = [
  ["Similar Experience", "20%", 85], ["Government/PSU Experience", "10%", 60],
  ["Relevant Industry Experience", "10%", 95], ["Technical Solution / Methodology", "15%", 0],
  ["Understanding of Requirements", "10%", 0], ["Proposed Architecture / Solution", "5%", 0],
  ["Key Personnel", "10%", 30], ["Technology Capability", "5%", 90],
  ["Implementation Methodology", "5%", 0], ["Project Management Approach", "5%", 0],
] as const;

function SubTabs({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return <div role="tablist" aria-label="Analysis section" className="mb-5 flex gap-1 overflow-x-auto border-b border-border">
    {items.map((item) => <Button key={item} role="tab" aria-selected={value === item} variant="ghost" onClick={() => onChange(item)} className={`h-11 shrink-0 rounded-none border-b-2 px-3 text-xs font-medium shadow-none sm:text-sm ${value === item ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{item}</Button>)}
  </div>;
}

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-sm border border-border bg-background ${className}`}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold text-foreground">{children}</h3>;
}

function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return <Frame className="overflow-x-auto p-3 sm:p-5"><table className="w-full min-w-[600px] border-collapse text-left text-sm"><thead className="bg-surface text-xs font-semibold uppercase text-muted-foreground"><tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t border-border even:bg-surface/60">{row.map((cell, cellIndex) => <td key={cellIndex} className={`px-4 py-3 align-top ${cellIndex === 0 ? "font-medium text-primary" : "text-muted-foreground"}`}>{cell}</td>)}</tr>)}</tbody></table></Frame>;
}

function Score({ value, label, alert = false }: { value: number; label: string; alert?: boolean }) {
  return <div className="flex flex-col items-center gap-3"><div className={`flex size-32 items-center justify-center rounded-full border-[7px] ${alert ? "border-destructive" : "border-primary"}`}><div className="text-center"><span className="block font-display text-4xl font-semibold leading-none">{value}</span><span className="text-xs text-muted-foreground">/ 100</span></div></div><p className="text-sm text-muted-foreground">{label}</p></div>;
}

function GoNoGo({ tender }: { tender: Tender }) {
  const [view, setView] = useState("Overview");
  return <><SubTabs items={["Overview", "Details"]} value={view} onChange={setView} />
    {view === "Overview" ? <>
      <Frame className="flex min-h-52 flex-col items-center justify-center gap-8 p-7 sm:flex-row sm:gap-16"><Score value={tender.score ?? 0} label="Go/No-Go score" alert={tender.decision === "No-Go"} /><div className="max-w-sm text-center sm:text-left"><Decision decision={tender.decision} /><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Sample recommendation for this tender. Confirm all eligibility requirements against the original document before deciding to bid.</p></div></Frame>
      <div className="mt-7"><SectionTitle>Decision factors</SectionTitle><Frame className="space-y-3 p-5 sm:p-6">{factors.map(([name, weight, score]) => <div key={name} className="grid grid-cols-[110px_minmax(0,1fr)_54px] items-center gap-3 text-xs sm:grid-cols-[185px_minmax(0,1fr)_80px]"><span className="text-muted-foreground">{name}</span><div className="h-1.5 overflow-hidden rounded-full bg-accent"><div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} /></div><span className="text-right text-muted-foreground">{score} · {weight}</span></div>)}</Frame></div>
      <div className="mt-7"><SectionTitle>Gaps & blockers</SectionTitle><Frame className="border-destructive/30 bg-destructive/5 p-4 text-sm text-muted-foreground">Check mandatory experience, financial thresholds, and supporting documents before making a final bid decision.</Frame></div>
    </> : <>
      <SectionTitle>Factor breakdown</SectionTitle><DataTable headers={["Factor", "Weight", "Score"]} rows={factors.map(([name, weight, score]) => [name, weight, score])} />
      <div className="mt-7"><SectionTitle>Eligibility criteria</SectionTitle><DataTable headers={["Criterion", "Required", "Company value", "Status"]} rows={criteria.map(([name, required, value, status]) => [name, required, value, status])} /></div>
      <div className="mt-7"><SectionTitle>Recommended next steps</SectionTitle><div className="space-y-2">{documents.slice(0, 3).map((item, index) => <Frame key={item} className="flex gap-3 p-4 text-sm"><span className="font-semibold text-primary">{index + 1}.</span>{item}</Frame>)}</div></div>
    </>}
  </>;
}

function Synopsis() {
  const [view, setView] = useState("Summary");
  const [expanded, setExpanded] = useState(false);
  return <><SubTabs items={["Summary", "Checklist"]} value={view} onChange={setView} />
    {view === "Summary" ? <div className="space-y-4">
      <Frame className="p-5 text-sm italic text-muted-foreground">Document title and extracted terms are not available in this preview.</Frame>
      {["Scope of work", "Eligibility", "Payment terms"].map((title) => <Frame key={title} className="p-5"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Review the original tender document to confirm the {title.toLowerCase()} and its exact requirements. Verified text and page references will appear when analysis is connected.</p></Frame>)}
      <Frame><Button variant="ghost" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} className="flex h-14 w-full justify-between rounded-none px-5 text-sm font-semibold">Dates & figures <ChevronDown size={16} className={expanded ? "rotate-180" : ""} /></Button>{expanded && <div className="grid gap-5 border-t border-border p-5 sm:grid-cols-2"><div><SectionTitle>Key dates</SectionTitle><p className="text-sm text-muted-foreground">No verified dates available.</p></div><div><SectionTitle>Financials</SectionTitle><p className="text-sm text-muted-foreground">No verified financial figures available.</p></div></div>}</Frame>
    </div> : <><SectionTitle>Documents to submit</SectionTitle><div className="space-y-2">{documents.map((document) => <Frame key={document} className="flex gap-3 p-4 text-sm text-primary"><span aria-hidden="true">•</span><span>{document}</span></Frame>)}</div><p className="mt-3 text-xs text-muted-foreground">Illustrative checklist only. Check the tender for its actual submission requirements.</p></>}
  </>;
}

function CompanyChecklist() {
  const [view, setView] = useState("A. Pre-Qualification");
  return <><SubTabs items={["A. Pre-Qualification", "B. Technical Qualification", "C. Bid/No-Bid Decision", "D. Partner/OEM Route"]} value={view} onChange={setView} />
    {view === "A. Pre-Qualification" && <DataTable headers={["Category", "Tender requirement", "Company value", "Status"]} rows={criteria.map(([name, required, value, status]) => [name, required, value, status])} />}
    {view === "B. Technical Qualification" && <><Frame className="flex justify-center p-7"><Score value={42} label="Illustrative technical score" /></Frame><div className="mt-6"><SectionTitle>Factor breakdown</SectionTitle><DataTable headers={["Factor", "Weight", "Score"]} rows={qualification.map(([name, weight, score]) => [name, weight, score])} /></div></>}
    {view === "C. Bid/No-Bid Decision" && <Frame className="p-5 sm:p-7"><SectionTitle>Decision review</SectionTitle><dl className="text-sm">{[["PQ gate", "Review required"], ["Expected TQ score", "42 / 100 (illustrative)"], ["Commercial competitiveness", "Not assessed"], ["Bid preparation effort", "Not assessed"], ["Strategic relevance", "Needs review"], ["Partner required", "Not determined"], ["Final recommendation", "Confirm against source document"]].map(([term, value]) => <div key={term} className="grid gap-1 border-b border-border py-3 last:border-0 sm:grid-cols-[220px_1fr]"><dt className="text-muted-foreground">{term}</dt><dd className="font-medium">{value}</dd></div>)}</dl></Frame>}
    {view === "D. Partner/OEM Route" && <><Frame className="p-5 sm:p-7"><SectionTitle>Partner / OEM requirements</SectionTitle><p className="text-sm leading-relaxed text-muted-foreground">Check whether manufacturer authorisation, consortium eligibility, or a partner's technical credentials are required by this tender. No verified partner requirements are available in this preview.</p></Frame><div className="mt-7"><SectionTitle>Bid preparation checklist</SectionTitle><DataTable headers={["Item", "Required", "Company value"]} rows={[["Partner authorisation", "Confirm against tender", "Not assessed"], ["Technical credentials", "Confirm against tender", "Not assessed"], ["Supply and support", "Confirm against tender", "Not assessed"]]} /></div></>}
  </>;
}

function RiskFinder() {
  const [view, setView] = useState("Overview");
  return <><SubTabs items={["Overview", "Risk register"]} value={view} onChange={setView} />
    {view === "Overview" ? <><Frame className="p-6"><SectionTitle>Risk review</SectionTitle><p className="text-sm leading-relaxed text-muted-foreground">No verified risk findings are available for this sample document. Review eligibility, payment terms, delivery obligations, and penalties against the original tender.</p></Frame><div className="mt-7 grid gap-4 sm:grid-cols-3">{["Eligibility", "Commercial terms", "Delivery obligations"].map((title) => <Frame key={title} className="p-5"><FileText size={18} className="text-primary" /><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-2 text-xs text-muted-foreground">Awaiting source-verified review</p></Frame>)}</div></> : <><SectionTitle>Risk register</SectionTitle><DataTable headers={["Area", "Finding", "Source"]} rows={[["Eligibility", "Not yet verified", "—"], ["Commercial", "Not yet verified", "—"], ["Delivery", "Not yet verified", "—"]]} /></>}
  </>;
}

export function AnalysisPreview({ tender }: { tender: Tender }) {
  if (tender.status !== "Ready") return <Frame className="p-8 sm:p-12"><h2 className="font-display text-xl font-semibold">Awaiting analysis</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">This document has been added to the dashboard, but no analysis is available yet. The PDF has not been processed in this preview.</p></Frame>;
  return <><p className="mb-5 border-l-2 border-primary bg-surface px-4 py-3 text-xs text-muted-foreground">Illustrative preview only — scores and checklist examples are not extracted from this PDF. Verify all findings against the original tender.</p>
    <Tabs defaultValue="go"><TabsList aria-label="Analysis views" className="mb-5 flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-transparent p-0"><>{mainTabs.map(({ value, label }) => <TabsTrigger key={value} value={value} className="h-11 shrink-0 rounded-none border-b-2 border-transparent px-3 text-xs font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:px-4 sm:text-sm">{label}</TabsTrigger>)}</></TabsList>
      <TabsContent value="go" className="mt-0"><GoNoGo tender={tender} /></TabsContent>
      <TabsContent value="synopsis" className="mt-0"><Synopsis /></TabsContent>
      <TabsContent value="company" className="mt-0"><CompanyChecklist /></TabsContent>
      <TabsContent value="risk" className="mt-0"><RiskFinder /></TabsContent>
    </Tabs>
  </>;
}