export function SiteFooter() {
  return (
    <footer className="border-t-2 border-primary mt-24">
      <div className="container py-10 grid gap-6 md:grid-cols-3 items-end">
        <div>
          <div className="font-display text-3xl font-black">Internly</div>
          <p className="mono-label text-muted-foreground mt-2">A bold platform for student careers.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Connecting ambitious students with forward-thinking companies. The smart way to find your next internship.
        </div>
        <div className="mono-label text-right text-muted-foreground">© {new Date().getFullYear()} — Internly</div>
      </div>
    </footer>
  );
}
