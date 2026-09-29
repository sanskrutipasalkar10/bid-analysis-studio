import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, LogOut, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./brand";

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = (path: string) => pathname === path || (path === "/" && pathname.startsWith("/tenders/"));
  return <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm"><div className="mx-auto flex min-h-16 max-w-[1220px] flex-wrap items-center justify-between gap-x-5 gap-y-2 px-5 py-2 md:px-8">
    <div className="flex flex-wrap items-center gap-x-9 gap-y-2"><Brand /><nav className="flex items-center gap-1" aria-label="Main navigation"><Link to="/" className={`nav-link ${active("/") ? "nav-link-active" : ""}`}>Dashboard</Link><Link to="/profiles" className={`nav-link ${active("/profiles") ? "nav-link-active" : ""}`}>Company profiles</Link></nav></div>
    <div className="flex items-center gap-2"><Button variant="ink" size="sm" asChild><Link to="/upload"><Upload /> <span>Upload tender</span></Link></Button><Button variant="ghost" size="sm" title="Sign out is unavailable in this preview" className="hidden sm:inline-flex" disabled><LogOut /> Log out</Button></div>
  </div></header>;
}
