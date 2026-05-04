import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BadgeCheck, Building2, GraduationCap, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b-2 border-primary overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="container relative py-20 md:py-32 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <div className="mono-label text-muted-foreground mb-6 flex items-center gap-3">
              <span>Issue 01</span>
              <span className="h-px w-12 bg-primary inline-block" />
              <span>Internships, reimagined</span>
            </div>
            <h1 className="editorial-display text-[clamp(3rem,9vw,9rem)]">
              Find the work
              <br />
              that <span className="text-accent italic">moves</span> you.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
              Internly is where ambitious students meet companies that take internships seriously.
              Browse roles, get matched, and build the career you actually want.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="shadow-brutal">
                <Link to="/register?role=student">
                  I'm a student <ArrowUpRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-primary shadow-brutal-sm bg-card">
                <Link to="/register?role=company">
                  Post an internship <ArrowUpRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="brutal-card p-6">
              <div className="mono-label text-muted-foreground">Featured</div>
              <div className="font-display text-3xl mt-2">7,400+ roles</div>
              <p className="text-muted-foreground mt-2">Live internships across engineering, design, marketing, and research.</p>
              <Link to="/internships" className="mono-label mt-6 inline-flex items-center gap-2 text-accent">
                Browse the index <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three roles */}
      <section className="container py-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: GraduationCap, title: "Students", body: "Build a profile, upload your CV, and track every application in one place.", to: "/register?role=student", cta: "Create profile" },
          { icon: Building2, title: "Companies", body: "Post roles, manage applicants, archive what's done. Soft delete keeps history.", to: "/register?role=company", cta: "Post a role" },
          { icon: BadgeCheck, title: "Admins", body: "Aggregated stats on applications and active internships across the platform.", to: "/login?role=admin", cta: "Open console" },
        ].map((c) => (
          <div key={c.title} className="brutal-card p-8 flex flex-col">
            <c.icon className="h-7 w-7" />
            <div className="mono-label mt-4 text-muted-foreground">For</div>
            <h3 className="font-display text-3xl font-black mt-1">{c.title}</h3>
            <p className="text-muted-foreground mt-3 flex-1">{c.body}</p>
            <Link to={c.to} className="mono-label mt-6 inline-flex items-center gap-2 text-accent">
              {c.cta} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </section>

      {/* Match */}
      <section className="border-y-2 border-primary bg-primary text-primary-foreground">
        <div className="container py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="mono-label text-primary-foreground/60 flex items-center gap-3">
              <Sparkles className="h-4 w-4" /> Match score
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-black mt-4">
              Smarter than <span className="italic text-highlight">keyword search.</span>
            </h2>
            <p className="mt-6 max-w-xl text-primary-foreground/80 text-lg">
              Our match engine compares your skills, major, and graduation year against each role.
              You see the percentage, and so does the company.
            </p>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            {[
              { v: "92%", l: "Avg top match" },
              { v: "3.4d", l: "Time to apply" },
              { v: "1.2k", l: "Companies hiring" },
              { v: "v1", l: "API version" },
            ].map((s) => (
              <div key={s.l} className="border-2 border-primary-foreground/20 p-6">
                <div className="font-display text-4xl font-black">{s.v}</div>
                <div className="mono-label text-primary-foreground/60 mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 text-center">
        <h2 className="editorial-display text-[clamp(2.5rem,7vw,6rem)]">
          Your next chapter <span className="text-accent">starts now.</span>
        </h2>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild size="lg" className="shadow-brutal">
            <Link to="/internships">Explore internships</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
