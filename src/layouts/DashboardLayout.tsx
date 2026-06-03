import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Bell,
  Bot,
  ChartSpline,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  ShieldAlert,
  Sun,
  UserRoundCog,
  Users
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { signOut } from "@/services/authService";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Borrowers", href: "/app/borrowers", icon: Users },
  { label: "Loans", href: "/app/loans", icon: FileText },
  { label: "EMI Tracking", href: "/app/emi-tracking", icon: ChartSpline },
  { label: "Payments", href: "/app/payments", icon: CreditCard },
  { label: "Escalations", href: "/app/escalations", icon: ShieldAlert },
  { label: "AI Assistant", href: "/app/ai-assistant", icon: Bot },
  { label: "Communication", href: "/app/communication", icon: MessageSquare },
  { label: "Reports", href: "/app/reports", icon: ChartSpline },
  { label: "Users", href: "/app/users", icon: UserRoundCog },
  { label: "Notifications", href: "/app/notifications", icon: Bell },
  { label: "Settings", href: "/app/settings", icon: Settings }
];

export function DashboardLayout() {
  const { sidebarCollapsed, toggleSidebar, darkMode, toggleDarkMode } = useAppStore();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Unable to complete remote sign out", error);
    } finally {
      setIsSigningOut(false);
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-surface text-foreground dark:bg-navy dark:text-white">
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 p-4 lg:hidden" role="dialog" aria-modal="true">
          <div className="flex h-full flex-col rounded-3xl bg-white p-4 dark:bg-navy">
            <div className="flex items-center justify-between">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <nav className="mt-6 grid gap-2 overflow-y-auto">
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === "/app"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-secondary transition hover:bg-hover hover:text-navy dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                      isActive && "bg-navy text-white hover:bg-navy hover:text-white dark:bg-mint dark:text-navy"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto flex gap-3 pt-4">
              <Button variant="secondary" size="sm" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {darkMode ? "Light" : "Dark"} mode
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  void handleSignOut();
                }}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-white transition-all lg:block dark:border-white/10 dark:bg-navy",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <Logo compact={sidebarCollapsed} />
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="space-y-1 px-3">
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/app"}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-secondary transition hover:bg-hover hover:text-navy dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                  isActive && "bg-navy text-white hover:bg-navy hover:text-white dark:bg-mint dark:text-navy"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={cn("transition-all", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}>
        <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur dark:border-white/10 dark:bg-navy/95">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-sm font-semibold text-mint">Single-company workspace</p>
                <h1 className="text-xl font-bold text-navy dark:text-white">Settlie AI Operations</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="secondary" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => void handleSignOut()} disabled={isSigningOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{isSigningOut ? "Signing out" : "Sign out"}</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
