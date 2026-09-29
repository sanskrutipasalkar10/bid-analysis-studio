import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/features/tenders/header";

type Profile = Record<string, string>;
const initial: Profile = { name: "C4i4 Lab (Centre for Industry 4.0)", capacity: "85", certifications: "SAMARTH Udyog Partner, ISO 9001", geography: "Maharashtra, Delhi, Gujarat, Punjab", sectors: "Manufacturing, Automotive, Logistics", cin: "U74999PN2017NPL172629", roc: "172629", license: "110090", incorporated: "2017-09-20", pan: "AAZCS2482C", gstin: "27AAZCS2482C1ZX", udyam: "UDYAM-MH-26-0843671", ngo: "MH/2018/0190409", authorised: "", paid: "", networth: "" };
const sections = [
  { title: "Company basics", fields: [["name", "Company name"], ["capacity", "Max bidding capacity (%)"], ["certifications", "Certifications (comma-separated)"], ["geography", "Geographic presence (states)"], ["sectors", "Sectors"]] },
  { title: "Statutory identity", fields: [["cin", "CIN"], ["roc", "ROC number"], ["license", "Section 8 licence number"], ["incorporated", "Date of incorporation"], ["pan", "PAN"], ["gstin", "GSTIN"], ["udyam", "Udyam registration number"], ["ngo", "NGO Darpan ID"]] },
  { title: "Capital & net worth", fields: [["authorised", "Authorised capital (INR)"], ["paid", "Paid-up capital (INR)"], ["networth", "Net worth (INR)"]] },
];

export const Route = createFileRoute("/profiles")({ head: () => ({ meta: [
  { title: "Company Profiles — Tender AI Platform" }, { name: "description", content: "Manage company credentials used to assess tender eligibility." },
  { property: "og:title", content: "Company Profiles — Tender AI Platform" }, { property: "og:description", content: "Manage company credentials used to assess tender eligibility." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: ProfilesPage });

function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([initial]);
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(false);
  const current = profiles[selected] ?? initial;
  function update(key: string, value: string) { setProfiles((previous) => previous.map((profile, index) => index === selected ? { ...profile, [key]: value } : profile)); setSaved(false); }
  function addProfile() { setProfiles((previous) => [...previous, Object.fromEntries(Object.keys(initial).map((key) => [key, ""]))]); setSelected(profiles.length); setSaved(false); }
  return <><Header /><main><section className="border-b border-border bg-surface"><div className="mx-auto max-w-[1220px] px-5 pb-9 pt-12 md:px-8 md:pt-15"><p className="eyebrow mb-3">ORGANISATION / ELIGIBILITY</p><h1 className="font-display text-4xl font-semibold md:text-[48px]">Company profiles<span className="text-primary">.</span></h1><p className="mt-3 text-muted-foreground">The credentials behind every Go/No-Go assessment.</p></div></section><section className="mx-auto grid max-w-[1220px] gap-8 px-5 py-10 md:grid-cols-[235px_minmax(0,1fr)] md:px-8"><aside><p className="eyebrow mb-4">YOUR PROFILES</p><div className="border-y border-border">{profiles.map((profile, index) => <Button key={index} variant="ghost" onClick={() => { setSelected(index); setSaved(false); }} className={`my-1 w-full justify-start overflow-hidden text-left ${selected === index ? "bg-accent text-primary" : ""}`}><Building2 className="shrink-0" /><span className="truncate">{profile.name || "New profile"}</span></Button>)}</div><Button variant="outline" className="mt-4 w-full justify-start" onClick={addProfile}><Plus /> New profile</Button><p className="mt-5 text-xs leading-relaxed text-muted-foreground">Profile edits in this preview are not saved after a refresh.</p></aside><div className="min-w-0"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-display text-2xl font-semibold">{current.name || "New company profile"}</h2><p className="mt-1 text-sm text-muted-foreground">Company details for tender eligibility reviews</p></div><Button onClick={() => setSaved(true)}><Save /> Save changes</Button></div>{saved && <p role="status" className="mb-4 border-l-2 border-primary bg-accent p-3 text-sm text-primary">Changes kept for this browser session.</p>}{sections.map((section, sectionIndex) => <section key={section.title} className="border-t border-border pb-9 pt-6"><div className="mb-6 flex items-center gap-3"><span className="step-number">0{sectionIndex + 1}</span><h3 className="font-display text-lg font-semibold">{section.title}</h3></div><div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">{section.fields.map(([key, label]) => <label key={key} className={key === "name" ? "block sm:col-span-2" : "block"}><span className="mb-2 block text-xs font-semibold text-muted-foreground">{label}</span><Input value={current[key] ?? ""} onChange={(event) => update(key, event.target.value)} className="h-10" /></label>)}</div></section>)}<p className="text-xs text-muted-foreground">Return to the <Link to="/upload" className="font-semibold text-primary hover:underline">upload page</Link> to select a company profile for a tender.</p></div></section></main></>;
}
