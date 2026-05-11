import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Internship } from "@/lib/api/types";
import { MapPin, Clock, Briefcase } from "lucide-react";

export function InternshipCard({ internship, hrefBase = "/internships" }: { internship: Internship; hrefBase?: string }) {
  const i = internship;
  return (
    <Link to={`${hrefBase}/${i.id}`} className="brutal-card p-6 block group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mono-label text-muted-foreground truncate">
            {i.company?.name ?? "Company"} {i.company?.industry ? `· ${i.company.industry}` : ""}
          </div>
          <h3 className="font-display text-2xl font-black mt-1 group-hover:text-accent truncate">{i.title}</h3>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {i.has_applied && <Badge variant="success">Applied</Badge>}
          {typeof i.match_score === "number" && (
            <div className="text-right">
              <div className="font-display text-3xl font-black text-accent leading-none">{Math.round(i.match_score)}%</div>
              <div className="mono-label text-muted-foreground">match</div>
            </div>
          )}
        </div>
      </div>

      <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">{i.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {i.location && (<span className="inline-flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" />{i.location}</span>)}
        {i.remote && <Badge variant="secondary">Remote</Badge>}
        {i.duration_months && (<span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" />{i.duration_months} mo</span>)}
        {i.stipend != null && (<span className="inline-flex items-center gap-1.5 text-muted-foreground"><Briefcase className="h-4 w-4" />${i.stipend}/mo</span>)}
      </div>

      {i.required_skills?.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {i.required_skills.slice(0, 5).map((s) => (
            <span key={s} className="mono-label border border-border px-2 py-0.5">{s}</span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
