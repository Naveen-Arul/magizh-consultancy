import { Pill, Target, Users, Lightbulb, Code, GraduationCap } from "lucide-react";

const About = () => {
  return (
    <div className="container py-10">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Pill className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">About MagizhHealDesk</h1>
      </div>

      {/* Overview */}
      <section className="mb-10 rounded-xl border bg-card p-8 shadow-card">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">What is MagizhHealDesk?</h2>
        <p className="text-muted-foreground leading-relaxed">
          MagizhHealDesk is an internal pharmacy management system designed exclusively for pharmacy staff. It digitizes billing with auto-price lookup, manages medicine inventory with expiry and batch tracking, and provides an instant stock enquiry chatbot — all in one clean, professional interface.
        </p>
      </section>

      {/* Objectives */}
      <section className="mb-10">
        <h2 className="mb-6 font-heading text-xl font-bold text-foreground">System Objectives</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Target, title: "Accurate Billing", desc: "Eliminate manual price entry errors with auto-fetched medicine prices and calculated totals." },
            { icon: Pill, title: "Expiry Tracking", desc: "Track multiple batches of the same medicine with different expiry dates to prevent losses." },
            { icon: Users, title: "Staff Efficiency", desc: "Chatbot enables instant stock enquiry without navigating complex inventory tables." },
            { icon: Lightbulb, title: "Smart Alerts", desc: "Visual indicators for low stock and near-expiry medicines to enable proactive management." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 font-heading font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-10 rounded-xl border bg-card p-8 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Code className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-xl font-bold text-foreground">Technology Stack</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "Tailwind CSS", "React Router", "Lucide Icons", "Vite"].map((t) => (
            <span key={t} className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Project Context */}
      <section className="rounded-xl border bg-accent/50 p-8">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-xl font-bold text-foreground">Project Context</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          MagizhHealDesk showcases a complete pharmacy workflow UI — from billing to stock management to staff-facing chatbot — utilizing modern web technologies and best practices.
        </p>
      </section>
    </div>
  );
};

export default About;
