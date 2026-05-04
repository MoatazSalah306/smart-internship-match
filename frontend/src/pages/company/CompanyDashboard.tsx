import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import { InternshipsApi } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { Archive, ArchiveRestore, Pencil, Plus, Trash2, Users } from "lucide-react";

export default function CompanyDashboard() {
  const qc = useQueryClient();
  const [showArchived, setShowArchived] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["company-internships", showArchived],
    queryFn: () => InternshipsApi.myList({ archived: showArchived }),
  });

  const items = Array.isArray(data) ? data : data?.items ?? [];

  const archive = useMutation({
    mutationFn: (id: number) => InternshipsApi.archive(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["company-internships"] }); toast({ title: "Internship archived" }); },
  });
  const restore = useMutation({
    mutationFn: (id: number) => InternshipsApi.restore(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["company-internships"] }); toast({ title: "Restored" }); },
  });
  const remove = useMutation({
    mutationFn: (id: number) => InternshipsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["company-internships"] }); toast({ title: "Deleted" }); },
    onError: (e) => toast({ title: "Delete failed", description: e instanceof ApiError ? e.message : "", variant: "destructive" }),
  });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono-label text-muted-foreground">Hiring console</div>
          <h1 className="editorial-display text-5xl md:text-6xl mt-1">{showArchived ? "Archived roles" : "Your internships"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowArchived((v) => !v)}>
            {showArchived ? "Show active" : "Show archived"}
          </Button>
          <Button asChild className="shadow-brutal-sm"><Link to="/company/internships/new"><Plus className="h-4 w-4 mr-1" /> New internship</Link></Button>
        </div>
      </div>

      {isLoading && <div className="brutal-card h-40 mt-10 animate-pulse bg-muted/30" />}
      {error && (
        <div className="border-2 border-destructive bg-destructive/10 p-4 mt-10">
          <div className="mono-label text-destructive">API error</div>
          <div className="text-sm text-destructive mt-1">{(error as Error).message}</div>
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="brutal-card p-12 mt-10 text-center">
          <div className="mono-label text-muted-foreground">Nothing here</div>
          <h3 className="font-display text-2xl mt-2">{showArchived ? "No archived internships." : "Post your first role."}</h3>
        </div>
      )}

      <div className="grid gap-4 mt-10">
        {items.map((i) => (
          <div key={i.id} className="brutal-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mono-label text-muted-foreground">
                  {i.location ?? "—"} · {i.duration_months ?? "?"} mo
                  {i.archived_at && <> · <Badge variant="outline">archived</Badge></>}
                </div>
                <Link to={`/internships/${i.id}`} className="font-display text-2xl font-black hover:text-accent">{i.title}</Link>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-2xl">{i.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Button asChild variant="outline" size="sm"><Link to={`/company/internships/${i.id}/applicants`}><Users className="h-4 w-4 mr-1" /> {i.applications_count ?? 0}</Link></Button>
                <Button asChild variant="outline" size="sm"><Link to={`/company/internships/${i.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                {i.archived_at ? (
                  <Button variant="outline" size="sm" onClick={() => restore.mutate(i.id)}><ArchiveRestore className="h-4 w-4" /></Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => archive.mutate(i.id)}><Archive className="h-4 w-4" /></Button>
                )}
                <Button
                  variant="outline" size="sm"
                  onClick={() => { if (confirm("Delete this internship? It can be restored from archived view.")) remove.mutate(i.id); }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
