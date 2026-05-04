import { useQuery } from "@tanstack/react-query";
import { AdminApi } from "@/lib/api/services";
import { ApiErrorBanner } from "../internships/InternshipsList";

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-stats"], queryFn: AdminApi.stats });

  return (
    <>
      <div className="mono-label text-muted-foreground">Aggregated stats</div>
      <h1 className="editorial-display text-5xl md:text-6xl mt-1">Platform overview</h1>

      {isLoading && <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="brutal-card h-28 animate-pulse bg-muted/30" />)}
      </div>}

      {error && <ApiErrorBanner error={error} />}

      {data && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <Stat label="Students" value={data.total_students} />
            <Stat label="Companies" value={data.total_companies} />
            <Stat label="Active internships" value={data.active_internships} accent />
            <Stat label="Applications" value={data.total_applications} />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="brutal-card p-6">
              <div className="mono-label text-muted-foreground">Applications by status</div>
              <div className="mt-4 space-y-3">
                {Object.entries(data.applications_by_status ?? {}).map(([k, v]) => {
                  const total = Object.values(data.applications_by_status ?? {}).reduce((a, b) => a + b, 0);
                  const pct = total ? Math.round((v / total) * 100) : 0;
                  return (
                    <div key={k}>
                      <div className="flex items-center justify-between mono-label">
                        <span>{k}</span><span>{v} · {pct}%</span>
                      </div>
                      <div className="h-2 bg-secondary mt-1">
                        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="brutal-card p-6">
              <div className="mono-label text-muted-foreground">Applications · last 30 days</div>
              <Sparkline data={data.applications_last_30_days ?? []} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            <div className="brutal-card p-6">
              <div className="mono-label text-muted-foreground">Total internships</div>
              <div className="font-display text-4xl font-black mt-2">{data.total_internships}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="brutal-card p-6">
      <div className="mono-label text-muted-foreground">{label}</div>
      <div className={`font-display text-4xl font-black mt-2 ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function Sparkline({ data }: { data: { date: string; count: number }[] }) {
  if (!data.length) return <div className="text-sm text-muted-foreground mt-3">No data yet.</div>;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="mt-4 flex items-end gap-1 h-32">
      {data.map((d) => (
        <div key={d.date} className="flex-1 bg-primary/80 hover:bg-accent transition-colors" style={{ height: `${(d.count / max) * 100}%` }} title={`${d.date}: ${d.count}`} />
      ))}
    </div>
  );
}
