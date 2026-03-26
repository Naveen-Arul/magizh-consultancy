import { ArrowRight, BarChart3, Heart, MessageCircle, Package, Pill, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { label: "Home", path: "/", icon: ArrowRight },
  { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { label: "Billing", path: "/billing", icon: Receipt },
  { label: "Stock Management", path: "/stock", icon: Package },
  { label: "Chatbot", path: "/chatbot", icon: MessageCircle },
];

const Footer = () => {
  return (
    <footer className="px-4 pb-6 pt-2 sm:px-6">
      <div className="page-surface mx-auto max-w-7xl overflow-hidden px-6 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[image:var(--hero-gradient)] text-primary-foreground">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <div className="font-heading text-lg font-bold text-foreground">MagizhHealDesk</div>
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Internal pharmacy platform</div>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              A connected workspace for billing, stock visibility, expiry control, and staff-facing AI enquiry workflows.
            </p>

            <div className="flex flex-wrap gap-2">
              {["Billing-first workflow", "Stock-aware alerts", "Fast staff navigation"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Explore
              </h4>
              <div className="mt-4 flex flex-col gap-2">
                {links.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Operating Notes
              </h4>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>Use Billing to complete a sale and print the invoice immediately.</p>
                <p>Use Stock to review shortages, expiry risk, and maintenance actions.</p>
                <p>Use Chatbot for quick, staff-friendly inventory answers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5">
            Built for pharmacy operations with <Heart className="h-3.5 w-3.5 text-destructive" /> by the MagizhHealDesk team
          </p>
          <p>Consistent billing, stock control, and enquiry workflows in one interface.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
