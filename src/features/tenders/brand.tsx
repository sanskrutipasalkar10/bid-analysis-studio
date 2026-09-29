import { Link } from "@tanstack/react-router";

export function Brand() {
  return <Link to="/" className="inline-flex shrink-0 items-center gap-2.5 font-semibold text-foreground" aria-label="Tender AI Platform dashboard"><span className="flex size-8 items-center justify-center rounded-[3px] bg-primary text-sm font-bold text-primary-foreground">T</span><span className="text-[15px]">Tender AI <span className="text-primary">Platform</span></span></Link>;
}
