import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Beranda", to: "/" },
  { label: "Event", to: "/events" },
  { label: "Pendaftaran", to: "/register" },
  { label: "Dokumentasi", to: "/documentation" },
  { label: "Kontak", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-[#0a1628] via-[#0d2847] to-[#1e3a5f] shadow-xl shadow-blue-900/20"
          : "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center transition-all hover:scale-105"
        >
          <img
            src="/logo.png"
            alt="COCONUT CC"
            className="h-10 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-110 brightness-0 invert"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`group relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  isActive ? "text-[#60a5fa]" : "text-gray-300 hover:text-white"
                }`}
              >
                {/* Active indicator with organic shape and glow */}
                {isActive && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3b82f6]/25 to-[#60a5fa]/25 scale-105" />
                    <span
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 blur-md"
                      style={{ boxShadow: "0 0 25px rgba(96, 165, 250, 0.4)" }}
                    />
                  </>
                )}

                {/* Hover background with pill shape and gradient */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />

                {/* Animated glow border on hover */}
                <span className="absolute inset-0 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3b82f6]/40 via-[#60a5fa]/40 to-[#3b82f6]/40 blur-lg scale-110" />
                </span>

                {/* Text */}
                <span className="relative z-10">{link.label}</span>

                {/* Bottom accent - curved glowing line */}
                <span
                  className={`absolute -bottom-1 left-1/2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent transition-all duration-300 ${
                    isActive
                      ? "w-3/4 -translate-x-1/2 opacity-100"
                      : "w-0 -translate-x-1/2 opacity-0 group-hover:w-1/2 group-hover:opacity-100"
                  }`}
                  style={{
                    boxShadow: isActive
                      ? "0 2px 12px rgba(96, 165, 250, 0.8), 0 0 20px rgba(96, 165, 250, 0.4)"
                      : "",
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
          ) : (
            <Menu className="h-6 w-6 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? "max-h-96 border-t border-blue-500/20" : "max-h-0"
        }`}
      >
        <div className="bg-gradient-to-b from-[#0a1628]/95 to-[#0d2847]/95 backdrop-blur-xl px-4 pb-4 pt-2">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`group relative block overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 animate-slide-up ${
                  isActive ? "text-[#60a5fa]" : "text-gray-300"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Active/Hover background with rounded shape */}
                <span
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#3b82f6]/25 to-[#60a5fa]/25 opacity-100"
                      : "bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 group-hover:opacity-100"
                  }`}
                  style={
                    isActive
                      ? { boxShadow: "0 0 20px rgba(96, 165, 250, 0.3)" }
                      : {}
                  }
                />

                {/* Left accent - organic pill shape */}
                <span
                  className={`absolute left-1 top-1/2 h-0 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#3b82f6] to-[#60a5fa] transition-all duration-300 ${
                    isActive ? "h-3/5" : "group-hover:h-2/5"
                  }`}
                  style={
                    isActive
                      ? {
                          boxShadow:
                            "0 0 10px rgba(96, 165, 250, 0.8), 2px 0 15px rgba(96, 165, 250, 0.4)",
                        }
                      : {}
                  }
                />

                {/* Text */}
                <span className="relative ml-2 z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
