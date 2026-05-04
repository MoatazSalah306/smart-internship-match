import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicationsApi, InternshipsApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Application } from "@/lib/api/types";

const STATUSES: Application["status"][] = ["pending", "reviewed", "accepted", "rejected"];

export default function CompanyApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: internship } = useQuery({
    queryKey: ["internship", id],
    queryFn: () => InternshipsApi.show(id!),
    enabled: !!id,
  });

  const { data: apps, isLoading } = useQuery({
    queryKey: ["applicants", id],
    queryFn: () => InternshipsApi.applicants(Number(id)),
    enabled: !!id,
  });

  const setStatus = useMutation({
    mutationFn: ({ appId, status }: { appId: number; status: Application["status"] }) =>
      ApplicationsApi.updateStatus(appId, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["applicants", id] }); toast({ title: "Status updated" }); },
  });

  return (
    <>
      <button onClick={() => navigate(-1)} className="mono-label inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="mono-label text-muted-foreground mt-6">Applicants</div>
      <h1 className="editorial-display text-5xl md:text-6xl mt-1">{internship?.title ?? "Internship"}</h1>

      {isLoading && <div className="brutal-card h-40 mt-10 animate-pulse bg-muted/30" />}

      <div className="grid gap-4 mt-10">
        {apps?.map((a) => (
          <div key={a.id} className="brutal-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mono-label text-muted-foreground">{a.student?.university ?? ""} {a.student?.major ? `· ${a.student.major}` : ""}</div>
                <div className="font-display text-2xl font-black mt-1">{a.student?.name ?? `Student #${a.student_id}`}</div>
                <div className="mono-label text-muted-foreground mt-1">{a.student?.email}</div>
                {typeof a.match_score === "number" && (
                  <Badge className="mt-2 bg-accent text-accent-foreground">Match {Math.round(a.match_score)}%</Badge>
                )}
                {a.cover_letter && (
                  <p className="mt-3 text-sm whitespace-pre-line max-w-2xl">{a.cover_letter}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 min-w-44">
                {a.student?.cv_url && (
                  <a href={a.student.cv_url} target="_blank" rel="noreferrer" className="mono-label inline-flex items-center gap-1 text-accent">
                    <FileText className="h-4 w-4" /> View CV
                  </a>
                )}
                <Select
                  value={a.status}
                  onValueChange={(v) => setStatus.mutate({ appId: a.id, status: v as Application["status"] })}
                >
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && (apps?.length ?? 0) === 0 && (
          <div className="brutal-card p-12 text-center">
            <div className="mono-label text-muted-foreground">No applicants yet</div>
          </div>
        )}
      </div>
    </>
  );
}
