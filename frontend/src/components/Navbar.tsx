import { BarChart3, Cross, Home, Info, MessageCircle, Package, Pill, Receipt } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { label: "Billing", path: "/billing", icon: Receipt },
  { label: "Stock", path: "/stock", icon: Package },
  { label: "Chatbot", path: "/chatbot", icon: MessageCircle },
  { label: "About", path: "/about", icon: Info },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="page-surface mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--hero-gradient)] text-primary-foreground shadow-card">
            <Pill className="h-5 w-5" />
            <Cross className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-white p-0.5 text-primary" />
          </div>
          <div>
            <div className="font-heading text-lg font-bold text-foreground">MagizhHealDesk</div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Pharmacy Ops Suite</div>
          </div>
        </Link>

        <div className="flex w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-border/70 bg-background/70 p-1 lg:w-auto lg:justify-start">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path;

            return (
              <Link
                key={path}
                to={path}
                className={`flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
