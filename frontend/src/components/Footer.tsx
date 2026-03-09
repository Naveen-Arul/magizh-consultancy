import { Pill, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Pill className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">
                MagizhHealDesk
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Internal pharmacy billing, inventory management, and stock enquiry assistant system designed for pharmacy staff.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "Billing", path: "/billing" },
                { label: "Stock Management", path: "/stock" },
                { label: "Chatbot", path: "/chatbot" },
                { label: "About", path: "/about" },
              ].map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t pt-6">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 text-destructive" /> MagizhHealDesk Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
