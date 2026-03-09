import { Link, useLocation } from "react-router-dom";
import { Cross, Pill, Home, Receipt, Package, MessageCircle, Info } from "lucide-react";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Billing", path: "/billing", icon: Receipt },
  { label: "Stock", path: "/stock", icon: Package },
  { label: "Chatbot", path: "/chatbot", icon: MessageCircle },
  { label: "About", path: "/about", icon: Info },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Pill className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">
            MagizhHealDesk
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
