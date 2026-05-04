import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ApplicationsApi, InternshipsApi, StudentApi } from "@/lib/api/services";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { Button } from "@/components/ui/button";
import { ApiErrorBanner } from "../internships/InternshipsList";
import { ArrowUpRight, FileText, Sparkles } from "lucide-react";

export default function StudentDashboard() {
  const { data: profile } = useQuery({ queryKey: ["student-profile"], queryFn: StudentApi.getProfile });
  const { data: feed, isLoading, error } = useQuery({
    queryKey: ["internships", "feed"],
    queryFn: () => InternshipsApi.list(),
  });
  const { data: apps } = useQuery({ queryKey: ["my-applications"], queryFn: ApplicationsApi.myApplications });

  const items = Array.isArray(feed) ? feed : feed?.items ?? [];
  const top = [...items].sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0)).slice(0, 4);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono-label text-muted-foreground">Welcome back</div>
          <h1 className="editorial-display text-5xl md:text-6xl mt-1">{profile?.name ?? "Student"}.</h1>
        </div>
        <Button asChild variant="outline"><Link to="/student/profile">Edit profile</Link></Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-10">
        <Stat label="Applications" value={apps?.length ?? 0} />
        <Stat label="Top match" value={top[0]?.match_score ? `${Math.round(top[0].match_score)}%` : "—"} accent />
        <Stat label="CV uploaded" value={profile?.cv_url ? "Yes" : "No"} icon={<FileText className="h-4 w-4" />} />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-black flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> Top matches for you</h2>
          <Link to="/internships" className="mono-label inline-flex items-center gap-1 text-accent">All <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        {isLoading && <div className="mt-6 brutal-card h-40 animate-pulse bg-muted/30" />}
        {error && <ApiErrorBanner error={error} />}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {top.map((i) => <InternshipCard key={i.id} internship={i} />)}
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ label, value, accent, icon }: { label: string; value: React.ReactNode; accent?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="brutal-card p-6">
      <div className="mono-label text-muted-foreground flex items-center gap-2">{icon}{label}</div>
      <div className={`font-display text-4xl font-black mt-2 ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}
