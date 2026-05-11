import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { InternshipsApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import type { Internship } from "@/lib/api/types";

type Form = {
  title: string;
  description: string;
  location: string;
  remote: boolean;
  duration_months: string;
  stipend: string;
  required_skills: string;
  deadline: string;
};

const empty: Form = { title: "", description: "", location: "", remote: false, duration_months: "", stipend: "", required_skills: "", deadline: "" };

export default function CompanyInternshipForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const { data: existing } = useQuery({
    queryKey: ["internship", id],
    queryFn: () => InternshipsApi.show(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title ?? "",
        description: existing.description ?? "",
        location: existing.location ?? "",
        remote: !!existing.remote,
        duration_months: existing.duration_months?.toString() ?? "",
        stipend: existing.stipend?.toString() ?? "",
        required_skills: (existing.required_skills ?? []).join(", "),
        deadline: existing.deadline ?? "",
      });
    }
  }, [existing]);

  const buildPayload = (): Partial<Internship> => ({
    title: form.title.trim(),
    description: form.description.trim(),
    location: form.location.trim() || null,
    remote: form.remote,
    duration_months: form.duration_months ? Number(form.duration_months) : null,
    stipend: form.stipend ? Number(form.stipend) : null,
    required_skills: form.required_skills.split(",").map((s) => s.trim()).filter(Boolean),
    deadline: form.deadline || null,
  });

  const save = useMutation({
    mutationFn: () => isEdit ? InternshipsApi.update(Number(id), buildPayload()) : InternshipsApi.create(buildPayload()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["company-internships"] });
      toast({ title: isEdit ? "Internship updated" : "Internship posted", variant: "success" });
      navigate("/company");
    },
    onError: (e) => {
      if (e instanceof ApiError && e.errors) setErrors(e.errors);
      toast({ title: "Save failed", description: e instanceof ApiError ? e.message : "", variant: "destructive" });
    },
  });

  return (
    <>
      <div className="mono-label text-muted-foreground">{isEdit ? "Edit role" : "New role"}</div>
      <h1 className="editorial-display text-5xl md:text-6xl mt-1">{isEdit ? "Update internship" : "Post internship"}</h1>

      <form className="brutal-card p-8 mt-10 space-y-5 max-w-3xl" onSubmit={(e) => { e.preventDefault(); setErrors({}); save.mutate(); }}>
        <Field label="Title" err={errors.title}>
          <Input required maxLength={150} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description" err={errors.description}>
          <Textarea required rows={8} maxLength={5000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Location" err={errors.location}>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} maxLength={120} />
          </Field>
          <Field label="Remote">
            <div className="h-10 flex items-center gap-3">
              <Switch checked={form.remote} onCheckedChange={(v) => setForm({ ...form, remote: v })} />
              <span className="text-sm text-muted-foreground">{form.remote ? "Remote allowed" : "On-site"}</span>
            </div>
          </Field>
          <Field label="Duration (months)" err={errors.duration_months}>
            <Input type="number" min={1} max={24} value={form.duration_months} onChange={(e) => setForm({ ...form, duration_months: e.target.value })} />
          </Field>
          <Field label="Stipend (per month)" err={errors.stipend}>
            <Input type="number" min={0} value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} />
          </Field>
          <Field label="Application deadline">
            <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </Field>
        </div>
        <Field label="Required skills (comma separated)">
          <Input value={form.required_skills} onChange={(e) => setForm({ ...form, required_skills: e.target.value })} placeholder="React, SQL, Figma" />
        </Field>

        <div className="flex gap-3">
          <Button type="submit" disabled={save.isPending} className="shadow-brutal-sm">
            {save.isPending ? "Saving…" : isEdit ? "Update internship" : "Publish internship"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/company")}>Cancel</Button>
        </div>
      </form>
    </>
  );
}

function Field({ label, children, err }: { label: string; children: React.ReactNode; err?: string[] }) {
  return (
    <div>
      <Label className="mono-label">{label}</Label>
      <div className="mt-2">{children}</div>
      {err?.length ? <p className="text-xs text-destructive mt-1">{err[0]}</p> : null}
    </div>
  );
}
