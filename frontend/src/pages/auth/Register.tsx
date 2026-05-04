import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/hooks/use-toast";

type RoleR = "student" | "company";

export default function Register() {
  const [params] = useSearchParams();
  const initial = (params.get("role") as RoleR) || "student";
  const [role, setRole] = useState<RoleR>(initial);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    industry: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { registerStudent, registerCompany } = useAuth();
  const navigate = useNavigate();

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: ["Passwords do not match"] });
      return;
    }
    setSubmitting(true);
    try {
      if (role === "student") {
        await registerStudent({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.password_confirmation,
        });
        navigate("/student", { replace: true });
      } else {
        await registerCompany({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.password_confirmation,
          industry: form.industry || undefined,
          website: form.website || undefined,
        });
        navigate("/company", { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setErrors(err.errors);
        toast({ title: "Registration failed", description: err.message, variant: "destructive" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-xl py-16">
      <div className="mono-label text-muted-foreground">Join Internly</div>
      <h1 className="font-display text-5xl font-black mt-2">Create account</h1>

      <div className="mt-8 grid grid-cols-2 gap-2 border-2 border-primary p-1 bg-card">
        {(["student", "company"] as RoleR[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`mono-label py-2 transition ${role === r ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 brutal-card p-8 space-y-5">
        <div>
          <Label htmlFor="name">{role === "student" ? "Full name" : "Company name"}</Label>
          <Input id="name" required value={form.name} onChange={update("name")} className="mt-2" />
          <FieldError errs={errors.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={form.email} onChange={update("email")} className="mt-2" />
          <FieldError errs={errors.email} />
        </div>

        {role === "company" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" value={form.industry} onChange={update("industry")} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={form.website} onChange={update("website")} placeholder="https://" className="mt-2" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={form.password} onChange={update("password")} className="mt-2" />
            <FieldError errs={errors.password} />
          </div>
          <div>
            <Label htmlFor="password_confirmation">Confirm</Label>
            <Input id="password_confirmation" type="password" required value={form.password_confirmation} onChange={update("password_confirmation")} className="mt-2" />
            <FieldError errs={errors.password_confirmation} />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full shadow-brutal-sm">
          {submitting ? "Creating…" : `Create ${role} account`}
        </Button>
        <p className="mono-label text-center text-muted-foreground">
          Have an account? <Link to="/login" className="text-accent">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

function FieldError({ errs }: { errs?: string[] }) {
  if (!errs?.length) return null;
  return <p className="text-xs text-destructive mt-1">{errs[0]}</p>;
}
