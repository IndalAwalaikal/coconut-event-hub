import { Monitor } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Monitor className="h-4 w-4 text-primary-foreground" />
            </div>
            COCONUT Computer Club
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Komunitas teknologi informasi yang berfokus pada pengembangan skill digital dan networking.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Navigasi</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
            <Link to="/events" className="hover:text-primary transition-colors">Event</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Pendaftaran</Link>
            <Link to="/documentation" className="hover:text-primary transition-colors">Dokumentasi</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Kontak</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Kontak</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>📧 coconut.cc@university.ac.id</p>
            <p>📱 +62 812-3456-7890</p>
            <p>📍 Gedung Fakultas Ilmu Komputer</p>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2025 COCONUT Computer Club. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
