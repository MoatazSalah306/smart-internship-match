import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SiteHeader() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const dashHref =
    role === "admin" ? "/admin" :
    role === "company" ? "/company" :
    role === "student" ? "/student" : "/";

  return (
    <header className="sticky top-0 z-40 border-b-2 border-primary bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="block h-3 w-3 bg-accent" />
          <span className="font-display text-xl font-black tracking-tight">Internly</span>
          <span className="mono-label text-muted-foreground hidden sm:inline">/ vol.01</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/internships">Internships</NavItem>
          {user && <NavItem to={dashHref}>Dashboard</NavItem>}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign in</Button>
              <Button size="sm" className="shadow-brutal-sm" onClick={() => navigate("/register")}>
                Get started
              </Button>
            </>
          ) : (
            <>
              <span className="mono-label text-muted-foreground hidden sm:inline">{user.role}</span>
              <span className="text-sm font-semibold hidden sm:inline">{user.name}</span>
              <Button variant="outline" size="sm" onClick={async () => { await logout(); navigate("/"); }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `mono-label px-3 py-2 transition-colors ${isActive ? "text-accent" : "text-foreground hover:text-accent"}`
      }
    >
      {children}
    </NavLink>
  );
}
