import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { Upload, FileText, Trash2 } from "lucide-react";
import type { Student } from "@/lib/api/types";

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB

export default function StudentProfile() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["student-profile"], queryFn: StudentApi.getProfile });
  const [form, setForm] = useState<Partial<Student>>({});
  const [skillsText, setSkillsText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        university: data.university ?? "",
        major: data.major ?? "",
        graduation_year: data.graduation_year ?? undefined,
        bio: data.bio ?? "",
      });
      setSkillsText((data.skills ?? []).join(", "));
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => StudentApi.updateProfile({
      ...form,
      skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student-profile"] });
      toast({ title: "Profile saved" });
    },
    onError: (e) => toast({ title: "Save failed", description: e instanceof ApiError ? e.message : "", variant: "destructive" }),
  });

  const upload = useMutation({
    mutationFn: (f: File) => StudentApi.uploadCv(f),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["student-profile"] }); toast({ title: "CV uploaded" }); },
    onError: (e) => toast({ title: "Upload failed", description: e instanceof ApiError ? e.message : "", variant: "destructive" }),
  });

  const removeCv = useMutation({
    mutationFn: () => StudentApi.deleteCv(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["student-profile"] }); toast({ title: "CV removed" }); },
  });

  const onFile = (file: File) => {
    if (!/\.(pdf|docx?)$/i.test(file.name)) {
      toast({ title: "Use PDF or Word", variant: "destructive" });
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    upload.mutate(file);
  };

  if (isLoading) return <div className="brutal-card h-64 animate-pulse bg-muted/30" />;

  return (
    <>
      <div className="mono-label text-muted-foreground">Your profile</div>
      <h1 className="editorial-display text-5xl md:text-6xl mt-1">Tell your story.</h1>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <form
          className="md:col-span-2 brutal-card p-8 space-y-5"
          onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <Input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required maxLength={120} />
            </Field>
            <Field label="University">
              <Input value={form.university ?? ""} onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))} maxLength={150} />
            </Field>
            <Field label="Major">
              <Input value={form.major ?? ""} onChange={(e) => setForm((f) => ({ ...f, major: e.target.value }))} maxLength={120} />
            </Field>
            <Field label="Graduation year">
              <Input type="number" min={2000} max={2100} value={form.graduation_year ?? ""} onChange={(e) => setForm((f) => ({ ...f, graduation_year: e.target.value ? Number(e.target.value) : undefined }))} />
            </Field>
          </div>

          <Field label="Bio">
            <Textarea rows={4} value={form.bio ?? ""} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} maxLength={1000} />
          </Field>

          <Field label="Skills (comma separated)">
            <Input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, TypeScript, Figma" />
          </Field>

          <Button type="submit" disabled={save.isPending} className="shadow-brutal-sm">
            {save.isPending ? "Saving…" : "Save profile"}
          </Button>
        </form>

        <div className="brutal-card p-8">
          <div className="mono-label text-muted-foreground">CV</div>
          <h2 className="font-display text-2xl font-black mt-1">Your resume</h2>
          {data?.cv_url ? (
            <div className="mt-4">
              <a href={data.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-accent">
                <FileText className="h-4 w-4" /> {data.cv_filename ?? "Current CV"}
              </a>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => removeCv.mutate()} disabled={removeCv.isPending}>
                <Trash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No CV uploaded yet.</p>
          )}
          <div className="mt-4">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
            />
            <Button onClick={() => fileRef.current?.click()} disabled={upload.isPending} className="w-full shadow-brutal-sm">
              <Upload className="h-4 w-4 mr-2" />{upload.isPending ? "Uploading…" : data?.cv_url ? "Replace CV" : "Upload CV"}
            </Button>
            <p className="mono-label text-muted-foreground mt-2">PDF or Word, up to 5MB.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mono-label">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
