import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const isChatbotPage = pathname === "/chatbot";

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex min-h-0 flex-1 flex-col ${isChatbotPage ? "pb-6 pt-4" : "pb-10 pt-6"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
