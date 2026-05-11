import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, type Role } from "@/lib/api/client";
import { toast } from "@/hooks/use-toast";

const ROLE_TABS: { value: Role; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "company", label: "Company" },
  { value: "admin", label: "Admin" },
];

export default function Login() {
  const [params] = useSearchParams();
  const initialRole = (params.get("role") as Role) || "student";
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(role, email.trim(), password);
      const dest = location.state?.from || (user.role === "admin" ? "/admin" : user.role === "company" ? "/company" : "/student");
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Sign in failed";
      toast({ title: "Sign in failed", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-xl py-16">
      <div className="mono-label text-muted-foreground">Welcome back</div>
      <h1 className="font-display text-5xl font-black mt-2">Sign in</h1>
      <p className="text-muted-foreground mt-3">
        Choose your role to access your personalized internship dashboard.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-2 border-2 border-primary p-1 bg-card">
        {ROLE_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setRole(t.value)}
            className={`mono-label py-2 transition ${
              role === t.value ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 brutal-card p-8 space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
        </div>
        <Button type="submit" disabled={submitting} className="w-full shadow-brutal-sm">
          {submitting ? "Signing in…" : `Sign in as ${role}`}
        </Button>
        {role !== "admin" && (
          <p className="mono-label text-center text-muted-foreground">
            No account?{" "}
            <Link to={`/register?role=${role}`} className="text-accent">Create one</Link>
          </p>
        )}
      </form>
    </div>
  );
}
