import { Link, Outlet, NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const nav = [
  ["About", "/about"],
  ["Features", "/features"],
  ["Solutions", "/solutions"],
  ["Pricing", "/pricing"],
  ["Contact", "/contact"]
];

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="page-shell flex h-20 items-center justify-between">
          <Link to="/" aria-label="Settlie AI home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map(([label, href]) => (
              <NavLink key={href} to={href} className="text-sm font-semibold text-secondary hover:text-navy">
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/demo">
                <ShieldCheck className="h-4 w-4" />
                Request demo
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
