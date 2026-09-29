import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, FileText, UploadCloud, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/features/tenders/header";
import { useWorkspace } from "@/features/tenders/workspace";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [
    { title: "Upload a Tender — Tender AI Platform" },
    { name: "description", content: "Add a tender PDF to the Tender AI workspace for review." },
    { property: "og:title", content: "Upload a Tender — Tender AI Platform" },
    { property: "og:description", content: "Add a tender PDF to the Tender AI workspace for review." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: UploadPage,
});

function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragged, setDragged] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState("none");
  const { addTender } = useWorkspace();
  const navigate = useNavigate();
  function choose(candidate?: File) {
    if (!candidate) return;
    if (candidate.type !== "application/pdf" && !candidate.name.toLowerCase().endsWith(".pdf")) { setError("Choose a PDF document."); setFile(null); return; }
    setError(""); setFile(candidate);
  }
  function onChange(event: ChangeEvent<HTMLInputElement>) { choose(event.target.files?.[0]); }
  function onDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragged(false); choose(event.dataTransfer.files[0]); }
  function submit() { if (!file) return; addTender(file); navigate({ to: "/" }); }
  return <><Header /><main><section className="border-b border-border bg-surface"><div className="mx-auto max-w-[1220px] px-5 pb-9 pt-12 md:px-8 md:pt-15"><Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Back to dashboard</Link><p className="eyebrow mb-3">NEW DOCUMENT / TENDER REVIEW</p><h1 className="font-display text-4xl font-semibold md:text-[48px]">Upload a tender<span className="text-primary">.</span></h1><p className="mt-3 text-muted-foreground">Bring a new document into your team's review workflow.</p></div></section>
  <section className="mx-auto grid max-w-[1220px] gap-12 px-5 py-12 md:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.85fr)] md:px-8"><div><div className="mb-5 flex items-center gap-3"><span className="step-number">01</span><div><p className="eyebrow">YOUR DOCUMENT</p><h2 className="font-display text-xl font-semibold">Select tender PDF</h2></div></div><input ref={inputRef} type="file" accept=".pdf,application/pdf" className="sr-only" onChange={onChange} aria-label="Choose tender PDF" />
    <div onDragOver={(event) => { event.preventDefault(); setDragged(true); }} onDragLeave={() => setDragged(false)} onDrop={onDrop} className={`flex min-h-[280px] flex-col items-center justify-center border border-dashed px-6 py-8 text-center transition-colors ${dragged ? "border-primary bg-accent" : "border-dropzone bg-surface"}`}><span className="mb-5 flex size-14 items-center justify-center rounded-md bg-accent text-primary"><UploadCloud size={26} strokeWidth={1.8} /></span><p className="font-display text-lg font-semibold">Drag and drop your tender here</p><p className="mt-1 text-sm text-muted-foreground">or choose a file from your device</p><Button variant="outline" className="mt-6" onClick={() => inputRef.current?.click()}>Browse files <ArrowRight /></Button><p className="mt-5 text-xs text-muted-foreground">PDF format</p></div>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}{file && <div className="mt-4 flex items-center gap-3 border border-border bg-background p-4"><FileText size={22} className="shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{file.name}</p><p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to add</p></div><Button variant="ghost" size="icon" aria-label="Remove selected file" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}><X /></Button></div>}
    <div className="mt-9 border-t border-border pt-7"><div className="mb-4 flex items-center gap-3"><span className="step-number">02</span><div><p className="eyebrow">ELIGIBILITY CONTEXT</p><h2 className="font-display text-xl font-semibold">Company profile</h2></div></div><label htmlFor="profile" className="mb-2 block text-sm font-medium">Evaluate against a company profile</label><select id="profile" value={profile} onChange={(event) => setProfile(event.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"><option value="none">No company profile (skip Go/No-Go for now)</option><option value="c4i4">C4i4 Lab (Centre for Industry 4.0)</option></select><p className="mt-2 text-xs text-muted-foreground">Profiles help compare tender requirements with your organisation's credentials.</p></div>
    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-7"><Button size="lg" disabled={!file} onClick={submit}><UploadCloud /> Add tender to dashboard <ArrowRight /></Button><p className="max-w-xs text-xs leading-relaxed text-muted-foreground">This preview adds the document name to your current browser session. It does not upload or analyze the PDF.</p></div>
  </div><aside className="md:border-l md:border-border md:pl-10"><p className="eyebrow mb-3">THE REVIEW PROCESS</p><h2 className="font-display text-2xl font-semibold leading-tight">From document to decision.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">A clear path through every tender, with the original pages close at hand.</p><div className="mt-8 space-y-0">{[{ n: "01", title: "Upload", text: "Start with the complete tender document." }, { n: "02", title: "Analyze", text: "Review eligibility, key terms, and potential risks." }, { n: "03", title: "Verify", text: "Trace each finding back to its source page." }, { n: "04", title: "Decide", text: "Make the final bid or no-bid call with your team." }].map((step) => <div key={step.n} className="flex gap-4 border-t border-border py-5"><span className="font-display text-lg font-semibold text-primary">{step.n}</span><div><h3 className="font-semibold">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p></div></div>)}</div><div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary"><Check size={16} /> Built for detailed tender review</div></aside></section>
  </main></>;
}
