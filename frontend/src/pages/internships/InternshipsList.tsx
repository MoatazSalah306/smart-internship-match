import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { InternshipsApi } from "@/lib/api/services";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ApiError } from "@/lib/api/client";

export default function InternshipsList() {
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["internships", submitted],
    queryFn: () => InternshipsApi.list({ search: submitted || undefined }),
  });

  const items = Array.isArray(data) ? data : data?.items ?? [];

  return (
    <div className="container py-12">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-primary pb-8">
        <div>
          <div className="mono-label text-muted-foreground">The index</div>
          <h1 className="editorial-display text-6xl md:text-8xl">Internships</h1>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(search); }}
          className="flex gap-2 w-full md:w-auto"
        >
          <div className="relative flex-1 md:w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, skill…" className="pl-9" />
          </div>
          <Button type="submit" className="shadow-brutal-sm">Search</Button>
        </form>
      </div>

      {isLoading && <ListSkeleton />}
      {error && <ApiErrorBanner error={error} />}
      {!isLoading && !error && (
        items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {items.map((i) => <InternshipCard key={i.id} internship={i} />)}
          </div>
        )
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="brutal-card p-6 animate-pulse h-44 bg-muted/30" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="brutal-card mt-10 p-12 text-center">
      <div className="mono-label text-muted-foreground">No results</div>
      <h3 className="font-display text-3xl mt-2">Nothing matches yet.</h3>
      <p className="text-muted-foreground mt-2">Try a broader search, or check back soon as new roles are posted.</p>
    </div>
  );
}

export function ApiErrorBanner({ error }: { error: unknown }) {
  const message = error instanceof ApiError ? error.message : (error as Error)?.message ?? "Something went wrong";
  return (
    <div className="border-2 border-destructive bg-destructive/10 p-4 mt-10">
      <div className="mono-label text-destructive">API error</div>
      <div className="text-sm text-destructive mt-1">{message}</div>
    </div>
  );
}
