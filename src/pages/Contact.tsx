import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  MessageCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@coconut.or.id",
    href: "mailto:hello@coconut.or.id",
    iconColor: "from-[#2563eb] to-[#1d4ed8]",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "+62 815-2480-0998",
    href: "tel:+6281524800998",
    iconColor: "from-[#2563eb] to-[#1d4ed8]",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+62 815-2480-0998",
    href: "https://wa.me/6281524800998",
    iconColor: "from-green-500 to-green-600",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@coconutdotorg",
    href: "https://instagram.com/coconutdotorg",
    iconColor: "from-[#2563eb] to-[#1d4ed8]",
  },
  {
    icon: MapPin,
    label: "Alamat",
    value:
      "Algo Coffee & Snacks, Jl. Monumen Emmy Saelan III No. 70, Karunrung",
    iconColor: "from-slate-600 to-slate-700",
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="text-center animate-slide-up">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6 shadow-lg shadow-green-500/20">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                  <AlertCircle
                    className="h-12 w-12 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af] bg-clip-text text-transparent">
                  Info Kontak
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Untuk informasi lebih lanjut, silakan hubungi kami melalui
                kontak yang tersedia di bawah atau kunjungi lokasi kami
                langsung!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                  onClick={() => setSubmitted(false)}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Lihat Peta Lokasi
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-semibold"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Kembali ke Atas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a1628] border-b border-gray-800/50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -right-1/4 top-0 h-96 w-96 rounded-full bg-gradient-to-l from-[#1e40af]/20 to-[#2563eb]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "0.5s",
              boxShadow: "0 0 100px 50px rgba(30, 64, 175, 0.2)",
            }}
          />
          <div
            className="absolute left-1/4 bottom-0 h-96 w-96 rounded-full bg-gradient-to-t from-[#1d4ed8]/20 to-[#2563eb]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "1.5s",
              boxShadow: "0 0 100px 50px rgba(29, 78, 216, 0.2)",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white border border-white/20 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Lokasi Kami</span>
            </div>

            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-up drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af] bg-clip-text text-transparent">
                Temukan Kami di Sini
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-gray-300 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              Kunjungi Sekretariat COCONUT Computer Club di Algo Coffee &
              Snacks. Kami siap menyambut Anda!
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1e293b] to-[#2563eb] bg-clip-text text-transparent mb-3">
                Informasi Kontak
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Temukan berbagai cara untuk terhubung dengan kami. Kami siap
                menjawab pertanyaan Anda!
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.map((c, idx) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center text-center p-6 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg animate-slide-up ${
                    c.href ? "hover:border-gray-300" : ""
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${c.iconColor} text-white mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md`}
                  >
                    <c.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    {c.label}
                  </h3>
                  <p className="text-gray-600 text-sm">{c.value}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 flex items-start gap-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900 mb-1">
                  Petunjuk Menuju Lokasi
                </p>
                <p className="text-gray-600">
                  Gunakan peta di bawah untuk menemukan lokasi kami. Klik tombol
                  navigasi untuk mendapatkan arah jalan dari lokasi Anda.
                </p>
              </div>
            </div>

            {/* Full Width Map (but limited card width) */}
            <div className="mx-auto max-w-5xl">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "75%" }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5246.319513496706!2d119.4476604760843!3d-5.176822294800611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee3f711cca333%3A0xfb9cb4819c0a9337!2sAlgo%20Coffee%20%26%20Snacks!5e1!3m2!1sen!2sid!4v1770525511846!5m2!1sen!2sid"
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi COCONUT Computer Club"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="mt-8 text-center">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Algo%20Coffee%20%26%20Snacks%2C%20Makassar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="h-14 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/25 px-8"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Buka di Google Maps
                </Button>
              </a>
              <p className="text-center text-sm text-gray-500 mt-4">
                Klik tombol di atas untuk navigasi langsung ke lokasi kami
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a1628]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[#3b82f6]/20 blur-3xl animate-pulse"
            style={{ boxShadow: "0 0 100px 50px rgba(59, 130, 246, 0.2)" }}
          />
          <div
            className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-[#1e40af]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "1s",
              boxShadow: "0 0 100px 50px rgba(30, 64, 175, 0.2)",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Bergabung dengan Komunitas Teknologi?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Jadilah bagian dari komunitas COCONUT Computer Club dan kembangkan
              skill teknologimu bersama kami!
            </p>
            <Button
              size="lg"
              className="bg-white text-[#2563eb] hover:bg-gray-50 font-bold px-10 py-6 text-lg transition-all hover:scale-105 shadow-lg shadow-white/20"
            >
              Daftar Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
