import { Mail, Phone, MapPin, Instagram, MessageCircle } from "lucide-react";

const contacts = [
  { icon: Mail, label: "Email", value: "coconut.cc@university.ac.id", href: "mailto:coconut.cc@university.ac.id" },
  { icon: Phone, label: "Telepon", value: "+62 812-3456-7890", href: "tel:+6281234567890" },
  { icon: MessageCircle, label: "WhatsApp", value: "+62 812-3456-7890", href: "https://wa.me/6281234567890" },
  { icon: Instagram, label: "Instagram", value: "@coconut_cc", href: "https://instagram.com/coconut_cc" },
  { icon: MapPin, label: "Alamat", value: "Gedung Fakultas Ilmu Komputer, Universitas XYZ" },
];

const Contact = () => (
  <div className="py-12">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-glow-sm md:text-4xl">Hubungi Kami</h1>
        <p className="mt-2 text-muted-foreground">
          Punya pertanyaan? Jangan ragu untuk menghubungi tim COCONUT Computer Club
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl space-y-4">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href?.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:box-glow hover:border-primary/20"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
              <c.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="font-medium">{c.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default Contact;
