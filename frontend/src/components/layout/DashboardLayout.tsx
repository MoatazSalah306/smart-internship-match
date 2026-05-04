import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

type NavItem = { to: string; label: string; icon?: ReactNode };

export default function DashboardLayout({
  title,
  nav,
  scope,
}: {
  title: string;
  nav: NavItem[];
  scope: "student" | "company" | "admin";
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <aside className="md:w-64 md:min-h-screen border-b-2 md:border-b-0 md:border-r-2 border-primary bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b-2 border-sidebar-border">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="block h-3 w-3 bg-accent" />
            <span className="font-display text-xl font-black">Internly</span>
          </NavLink>
          <div className="mono-label mt-3 text-sidebar-foreground/60">{scope} console</div>
          <div className="font-display text-2xl mt-1">{title}</div>
        </div>
        <nav className="flex-1 p-3 flex md:flex-col gap-1 overflow-x-auto">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              className={({ isActive }) =>
                `mono-label whitespace-nowrap px-3 py-2 border-2 transition ${
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-transparent text-sidebar-foreground/80 hover:border-sidebar-border hover:text-sidebar-foreground"
                }`
              }
            >
              <span className="flex items-center gap-2">
                {n.icon}
                {n.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t-2 border-sidebar-border hidden md:block">
          <div className="text-sm font-semibold">{user?.name}</div>
          <div className="mono-label text-sidebar-foreground/60 truncate">{user?.email}</div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={async () => { await logout(); navigate("/"); }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
