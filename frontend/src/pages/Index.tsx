import { Link } from "react-router-dom";
import { Receipt, Package, MessageCircle, ShieldCheck, Clock, TrendingDown, Zap } from "lucide-react";
import heroImage from "@/assets/hero-pharmacy.jpg";

const features = [
  {
    icon: Receipt,
    title: "Billing Management",
    desc: "Digital bill generation with accurate calculation. Auto-fetches medicine prices and updates stock after billing.",
    path: "/billing",
  },
  {
    icon: Package,
    title: "Stock Management",
    desc: "Track medicine quantity & expiry. Supports multiple batches, low-stock warnings, and near-expiry alerts.",
    path: "/stock",
  },
  {
    icon: MessageCircle,
    title: "AI Stock Enquiry Chatbot",
    desc: "AI-powered assistant (Groq) with real-time inventory data. Instantly answers medicine availability, stock levels, and expiry queries.",
    path: "/chatbot",
  },
];

const benefits = [
  { icon: ShieldCheck, text: "Reduces manual billing errors" },
  { icon: Clock, text: "Prevents medicine expiry losses" },
  { icon: TrendingDown, text: "Avoids stock shortages" },
  { icon: Zap, text: "Improves pharmacy efficiency" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Pharmacy management"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        <div className="container relative z-10 py-24 md:py-36">
          <h1 className="font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl lg:text-6xl">
            MagizhHealDesk
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary-foreground/85">
            Internal Pharmacy Billing, Inventory Management, and AI-Powered Stock Enquiry Assistant
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to="/billing"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-shadow hover:shadow-card-hover"
            >
              <Receipt className="h-4 w-4" /> Start Billing
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground">About MagizhHealDesk</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            MagizhHealDesk is an internal pharmacy management system that digitizes billing, automates inventory tracking with expiry management, and provides an instant stock enquiry chatbot — reducing manual errors and improving efficiency for pharmacy staff.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container pb-16">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">Core Modules</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, path }) => (
            <Link
              key={path}
              to={path}
              className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why This System */}
      <section className="bg-accent/50 py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">Why This System?</h2>
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-card">
                <Icon className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium text-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="container py-16">
        <h2 className="mb-6 text-center font-heading text-2xl font-bold text-foreground">Workflow Overview</h2>
        <div className="mx-auto max-w-2xl space-y-3">
          {[
            "Billing reduces stock quantity automatically after each transaction.",
            "Stock updates are reflected in the chatbot for instant enquiry.",
            "Staff use the chatbot for quick availability & expiry checks.",
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-card">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{t}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
