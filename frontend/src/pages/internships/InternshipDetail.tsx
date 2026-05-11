import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ApplicationsApi, InternshipsApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/hooks/use-toast";
import { ApiErrorBanner } from "../internships/InternshipsList";
import { ArrowLeft, MapPin, Clock, Briefcase } from "lucide-react";

export default function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [coverLetter, setCoverLetter] = useState("");

  const { data: internship, isLoading, error } = useQuery({
    queryKey: ["internship", id],
    queryFn: () => InternshipsApi.show(id!),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: () => ApplicationsApi.apply(Number(id), { cover_letter: coverLetter || undefined }),
    onSuccess: () => {
      toast({ title: "Application sent", description: "We'll notify you when the company responds.", variant: "success" });
      setCoverLetter("");
      qc.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (e) => {
      toast({ title: "Could not apply", description: e instanceof ApiError ? e.message : "Try again", variant: "destructive" });
    },
  });

  return (
    <div className="container py-10 max-w-4xl">
      <button onClick={() => navigate(-1)} className="mono-label inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {isLoading && <div className="brutal-card p-10 mt-6 animate-pulse h-64 bg-muted/30" />}
      {error && <ApiErrorBanner error={error} />}

      {internship && (
        <article className="mt-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mono-label text-muted-foreground">{internship.company?.name ?? "Company"}</div>
              <h1 className="editorial-display text-5xl md:text-7xl mt-2">{internship.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {internship.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{internship.location}</span>}
                {internship.remote && <Badge variant="secondary">Remote</Badge>}
                {internship.duration_months && <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{internship.duration_months} months</span>}
                {internship.stipend != null && <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" />${internship.stipend}/mo</span>}
              </div>
            </div>
            {typeof internship.match_score === "number" && (
              <div className="brutal-card p-5 text-center shrink-0">
                <div className="font-display text-5xl font-black text-accent leading-none">{Math.round(internship.match_score)}%</div>
                <div className="mono-label text-muted-foreground mt-1">match</div>
              </div>
            )}
          </div>

          <div className="mt-10 prose prose-neutral max-w-none">
            <p className="whitespace-pre-line text-foreground/90">{internship.description}</p>
          </div>

          {internship.required_skills?.length ? (
            <div className="mt-8">
              <div className="mono-label text-muted-foreground">Required skills</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {internship.required_skills.map((s) => (
                  <span key={s} className="mono-label border-2 border-primary px-3 py-1">{s}</span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-12 brutal-card p-8">
            <h2 className="font-display text-3xl font-black">Apply</h2>
            {!user && (
              <p className="mt-3 text-muted-foreground">
                <Link to="/login?role=student" className="text-accent">Sign in as a student</Link> to apply.
              </p>
            )}
            {user && user.role !== "student" && (
              <p className="mt-3 text-muted-foreground">Only student accounts can apply to internships.</p>
            )}
            {user?.role === "student" && (
              internship.has_applied ? (
                <div className="mt-4 p-4 border-2 border-success bg-success/10 rounded-sm">
                  <p className="text-success font-bold text-lg">You have already submitted an application for this role.</p>
                  <Link to="/student/applications" className="text-accent underline mt-2 block font-bold">Track your application status →</Link>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); applyMutation.mutate(); }}
                  className="mt-4 space-y-4"
                >
                  <Textarea
                    rows={6}
                    placeholder="Cover letter (optional) — tell them why you're a fit."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    maxLength={2000}
                  />
                  <Button type="submit" disabled={applyMutation.isPending} className="shadow-brutal-sm">
                    {applyMutation.isPending ? "Sending…" : "Submit application"}
                  </Button>
                </form>
              )
            )}
          </div>
        </article>
      )}
    </div>
  );
}
