import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  {
    icon: Facebook,
    href: "https://web.facebook.com/coconutcomputer/",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/coconutdotorg",
    label: "Instagram",
  },
  {
    icon: Twitter,
    href: "https://x.com/coconutdotorg",
    label: "Twitter",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/showcase/coconutdotorg",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "https://github.com/COCONUT-Compter-Club",
    label: "GitHub",
  },
];

const quickLinks = [
  { label: "Beranda", to: "/" },
  { label: "Event", to: "/events" },
  { label: "Pendaftaran", to: "/register" },
  { label: "Dokumentasi", to: "/documentation" },
  { label: "Kontak", to: "/contact" },
];

const Footer = () => (
  <footer className="relative overflow-hidden bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]">
    <div className="container relative mx-auto px-4 py-12">
      {/* Main Content */}
      <div className="grid gap-10 md:grid-cols-3 lg:gap-16">
        {/* Brand & Description */}
        <div className="md:col-span-1">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center transition-all hover:scale-105"
          >
            <img
              src="/logo.png"
              alt="COCONUT CC"
              className="h-10 md:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-110 brightness-0 invert"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-gray-400 max-w-sm">
            Komunitas teknologi informasi untuk pengembangan skill digital dan
            networking profesional.
          </p>

          {/* Social Links */}
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-gray-800/50 text-gray-400 transition-all duration-300 hover:border-[#3b82f6] hover:bg-[#3b82f6]/20 hover:text-[#60a5fa] hover:-translate-y-1"
                style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(59, 130, 246, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.3)";
                }}
              >
                <social.icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-base font-bold text-white mb-5 relative inline-block">
            Navigasi Cepat
            <span
              className="absolute -bottom-1 left-0 h-0.5 w-12 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-full"
              style={{ boxShadow: "0 0 8px rgba(96, 165, 250, 0.6)" }}
            />
          </h4>
          <div className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center text-sm text-gray-400 transition-all duration-300 hover:text-[#60a5fa] hover:translate-x-1"
              >
                <span
                  className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-3 group-hover:bg-[#3b82f6]"
                  style={{ boxShadow: "0 0 0 rgba(59, 130, 246, 0)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 8px rgba(59, 130, 246, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 rgba(59, 130, 246, 0)";
                  }}
                />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display text-base font-bold text-white mb-5 relative inline-block">
            Hubungi Kami
            <span
              className="absolute -bottom-1 left-0 h-0.5 w-12 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-full"
              style={{ boxShadow: "0 0 8px rgba(96, 165, 250, 0.6)" }}
            />
          </h4>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:hello@coconut.or.id"
              className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#60a5fa]"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 transition-all duration-300 group-hover:bg-[#3b82f6]/20 group-hover:text-[#60a5fa]">
                <Mail className="h-4 w-4" />
              </div>
              <span>hello@coconut.or.id</span>
            </a>
            <a
              href="tel:+6281524800998"
              className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#60a5fa]"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 transition-all duration-300 group-hover:bg-[#3b82f6]/20 group-hover:text-[#60a5fa]">
                <Phone className="h-4 w-4" />
              </div>
              <span>+62 815-2480-0998</span>
            </a>
            <div className="group flex items-start gap-3 text-sm text-gray-400">
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 transition-all duration-300 group-hover:bg-[#3b82f6]/20 group-hover:text-[#60a5fa]">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="leading-relaxed">
                Algo Coffee & Snack
                <br />
                Jl. Emmy Saelan III No. 70, Karunrung
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://coconut.or.id/?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnrc2v0GfBXyqbIun7BRS88X6wbvm3EgocO1xblmWMDUPLeObp55vO-WC4PD0_aem_Yi158Gr3LYYPx28Egqjrtg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              COCONUT Computer Club
            </a>
            . All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made with{" "}
            <span className="inline-block animate-pulse text-red-500">❤️</span>{" "}
            by COCONUT Hacklab
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
