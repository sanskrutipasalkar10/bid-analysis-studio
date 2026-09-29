import { createContext, useContext, useState, type ReactNode } from "react";

export type Tender = {
  id: string;
  name: string;
  pages?: number;
  authority: string;
  status: "Ready" | "Uploaded";
  decision?: "Go" | "No-Go" | "Conditional Go";
  date: string;
  score?: number;
};

export const sampleTenders: Tender[] = [
  { id: "gem-7399567", name: "GeM-Bidding-7399567.pdf", pages: 68, authority: "Government e-Marketplace", status: "Ready", decision: "Go", date: "28 Sep 2026", score: 87 },
  { id: "gem-9003429", name: "GeM-Bidding-9003429.pdf", pages: 75, authority: "Government e-Marketplace", status: "Ready", decision: "Go", date: "28 Sep 2026", score: 82 },
  { id: "gem-8051120", name: "GeM-Bidding-8051120.pdf", pages: 110, authority: "Government e-Marketplace", status: "Ready", decision: "No-Go", date: "28 Sep 2026", score: 38 },
  { id: "gem-7399567-partner", name: "GeM-Bidding-7399567-Addendum.pdf", pages: 68, authority: "Government e-Marketplace", status: "Ready", decision: "Conditional Go", date: "24 Sep 2026", score: 71 },
  { id: "national-data", name: "5-National_Data_&_Analytics_Consultant.pdf", pages: 189, authority: "National Data Office", status: "Ready", decision: "Go", date: "23 Sep 2026", score: 91 },
  { id: "heavy-equipment", name: "1-Heavy_Equipment_Repair_Plant.pdf", pages: 146, authority: "Industrial Development Board", status: "Ready", decision: "No-Go", date: "22 Sep 2026", score: 43 },
  { id: "gem-9003429-new", name: "GeM-Bidding-9003429-Revision.pdf", authority: "—", status: "Uploaded", date: "28 Sep 2026" },
];

type Workspace = {
  tenders: Tender[];
  addTender: (file: File) => void;
};

const WorkspaceContext = createContext<Workspace | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [uploaded, setUploaded] = useState<Tender[]>([]);
  const addTender = (file: File) => {
    setUploaded((current) => [{ id: `local-${Date.now()}`, name: file.name, authority: "—", status: "Uploaded", date: new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()) }, ...current]);
  };
  return <WorkspaceContext.Provider value={{ tenders: [...uploaded, ...sampleTenders], addTender }}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("Workspace provider missing");
  return context;
}
