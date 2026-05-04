import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ApplicationsApi } from "@/lib/api/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "secondary",
  reviewed: "outline",
  accepted: "default",
  rejected: "destructive",
};

export default function StudentApplications() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["my-applications"], queryFn: ApplicationsApi.myApplications });

  const withdraw = useMutation({
    mutationFn: (id: number) => ApplicationsApi.withdraw(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-applications"] }); toast({ title: "Application withdrawn" }); },
  });

  return (
    <>
      <div className="mono-label text-muted-foreground">Tracker</div>
      <h1 className="editorial-display text-5xl md:text-6xl mt-1">My applications</h1>

      {isLoading && <div className="brutal-card h-40 mt-10 animate-pulse bg-muted/30" />}

      {!isLoading && (data?.length ?? 0) === 0 && (
        <div className="brutal-card p-12 mt-10 text-center">
          <div className="mono-label text-muted-foreground">Empty</div>
          <h3 className="font-display text-2xl mt-2">No applications yet.</h3>
          <Button asChild className="mt-4"><Link to="/internships">Browse internships</Link></Button>
        </div>
      )}

      <div className="grid gap-4 mt-10">
        {data?.map((a) => (
          <div key={a.id} className="brutal-card p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="mono-label text-muted-foreground">{a.internship?.company?.name ?? "Company"}</div>
              <Link to={`/internships/${a.internship_id}`} className="font-display text-2xl font-black hover:text-accent">
                {a.internship?.title ?? `Internship #${a.internship_id}`}
              </Link>
              <div className="mono-label text-muted-foreground mt-1">
                {a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}
                {typeof a.match_score === "number" && <> · Match {Math.round(a.match_score)}%</>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={STATUS_VARIANT[a.status] ?? "secondary"}>{a.status}</Badge>
              {a.status === "pending" && (
                <Button variant="outline" size="sm" onClick={() => withdraw.mutate(a.id)} disabled={withdraw.isPending}>
                  Withdraw
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
