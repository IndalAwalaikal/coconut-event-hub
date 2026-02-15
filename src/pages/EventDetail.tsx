import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Award,
  Info,
  Share2,
  Tag,
  CreditCard,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryColors } from "@/data/mockData";
import { mediaUrl } from "@/lib/utils";

const EventDetail = () => {
  const { id } = useParams();
  const API = import.meta.env.VITE_API_URL || "";
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API}/api/events/detail?id=${encodeURIComponent(id)}`,
        );
        if (!res.ok) throw new Error("event not found");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.warn(err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [API, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#2563eb] mx-auto mb-6"></div>
            <p className="text-gray-600 font-medium">Memuat detail event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
              Event tidak ditemukan
            </h2>
            <p className="text-gray-600 mb-6">
              Event yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Link to="/events">
              <Button className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white shadow-lg shadow-blue-500/25">
                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFull = event.registered >= event.quota;
  const progressPercentage = Math.min(
    (event.registered / event.quota) * 100,
    100,
  );
  const isPaid = event.eventType === "paid";
  const price = isPaid ? Number(event.price) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Event
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main Content - Left Column (3/5 width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* PRICE BADGE - VERY PROMINENT */}
            <div className="mb-6 flex justify-center">
              {isPaid ? (
                <div className="relative">
                  {/* Decorative circles */}
                  <div className="absolute -top-2 -left-2 w-12 h-12 bg-red-400/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-red-600/20 rounded-full blur-xl animate-pulse delay-75"></div>

                  {/* Main badge */}
                  <div className="relative inline-flex items-center gap-3 rounded-[2rem_1rem_2rem_1rem] bg-gradient-to-br from-red-500 via-red-600 to-red-700 px-8 py-5 shadow-2xl transform hover:scale-105 transition-transform">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-[2rem_1rem_2rem_1rem] blur-sm"></div>
                    <CreditCard className="h-8 w-8 text-white relative z-10 animate-bounce" />
                    <div className="text-center relative z-10">
                      <p className="text-xs font-bold text-white/90 uppercase tracking-widest mb-1">
                        Event Berbayar
                      </p>
                      <p className="font-display text-3xl md:text-4xl font-bold text-white">
                        Rp {price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Decorative circles */}
                  <div className="absolute -top-2 -left-2 w-12 h-12 bg-green-400/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-emerald-600/20 rounded-full blur-xl animate-pulse delay-75"></div>

                  {/* Main badge */}
                  <div className="relative inline-flex items-center gap-3 rounded-[1rem_2rem_1rem_2rem] bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 px-8 py-5 shadow-2xl transform hover:scale-105 transition-transform">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-[1rem_2rem_1rem_2rem] blur-sm"></div>
                    <Gift className="h-8 w-8 text-white relative z-10 animate-bounce" />
                    <div className="text-center relative z-10">
                      <p className="text-xs font-bold text-white/90 uppercase tracking-widest mb-1">
                        Event Gratis
                      </p>
                      <p className="font-display text-3xl md:text-4xl font-bold text-white">
                        100% FREE
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Title & Description */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {event.title}
              </h1>

              <p className="text-base md:text-lg text-gray-600 leading-relaxed text-justify">
                {event.description}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="group rounded-xl border border-gray-200 bg-white p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    Tanggal
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="group rounded-xl border border-gray-200 bg-white p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    Waktu
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {event.time}
                  </p>
                </div>
              </div>

              <div className="group rounded-xl border border-gray-200 bg-white p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    Lokasi
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="group rounded-xl border border-gray-200 bg-white p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    Kuota Peserta
                  </p>
                  <p className="text-sm font-bold text-gray-900 mb-3">
                    {event.registered} / {event.quota} terdaftar
                  </p>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    {isFull
                      ? "Kuota penuh"
                      : `${event.quota - event.registered} slot tersisa`}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                  <Award className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Benefit & Fasilitas
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {event.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700 font-medium">
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Tata Tertib / Persyaratan
                </h2>
              </div>
              <div className="space-y-3">
                {event.rules.map((rule, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-xs font-bold text-white shadow-sm">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 pt-0.5">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (2/5 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* PRICE CARD - SECONDARY PROMINENT DISPLAY */}
              <div className="rounded-2xl border-2 bg-white p-6 shadow-xl">
                {isPaid ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <CreditCard className="h-6 w-6 text-red-600" />
                      <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
                        BERBAYAR
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        Rp {price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Harga tiket event
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Tag className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-red-800 font-medium">
                          Segera daftar sebelum harga naik atau kuota habis!
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Gift className="h-6 w-6 text-green-600" />
                      <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
                        GRATIS
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        100% FREE
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tanpa biaya pendaftaran
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-green-800 font-medium">
                          Daftar sekarang, tempat terbatas!
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Speakers & Moderator Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Info className="h-5 w-5 text-[#2563eb]" />
                  <h3 className="font-display font-bold text-lg text-gray-900">
                    Narasumber
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
                      Pemateri
                    </p>
                    <div className="space-y-2">
                      {[event.speaker1, event.speaker2, event.speaker3]
                        .filter(Boolean)
                        .map((speaker, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md">
                              <User className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {speaker}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
                      Moderator
                    </p>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200/50 border border-slate-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-md">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {event.moderator}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Poster */}
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-lg">
                <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="relative w-full">
                    <img
                      src={
                        event.poster
                          ? mediaUrl(event.poster)
                          : event.image
                            ? mediaUrl(event.image)
                            : "/placeholder.svg?height=600&width=800"
                      }
                      alt={event.title || "Event COCONUT"}
                      className="w-full h-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=600&width=800";
                        e.currentTarget.alt = "Gambar tidak tersedia";
                      }}
                      loading="lazy"
                    />

                    {/* Category Badge */}
                    {event.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-white/95 backdrop-blur-sm text-[#2563eb] border-0 px-4 py-1.5 text-sm font-bold shadow-lg">
                          {event.categoryLabel || event.category}
                        </Badge>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge
                        className={`${
                          isFull
                            ? "bg-red-500/95 text-white"
                            : "bg-green-500/95 text-white"
                        } backdrop-blur-sm border-0 px-4 py-1.5 text-sm font-bold shadow-lg`}
                      >
                        {isFull ? "Penuh" : "Tersedia"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Button */}
              <Link to={`/register?event=${event.id}`} className="block">
                <Button
                  size="lg"
                  className={`w-full font-bold text-base py-6 transition-all duration-300 ${
                    isFull
                      ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                      : isPaid
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-lg shadow-red-500/30"
                        : "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] hover:scale-105 shadow-lg shadow-blue-500/30"
                  } text-white border-0 rounded-xl`}
                  disabled={isFull}
                >
                  {isFull ? (
                    <>
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Kuota Penuh
                    </>
                  ) : isPaid ? (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Bayar & Daftar Sekarang
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Daftar Gratis Sekarang
                    </>
                  )}
                </Button>
              </Link>

              {!isFull && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Hanya{" "}
                    <span className="text-[#2563eb]">
                      {event.quota - event.registered} slot
                    </span>{" "}
                    tersisa!
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-white shrink-0">
                    <Info className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-gray-900 mb-2">
                      Informasi Penting
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Pastikan data pendaftaran Anda sudah benar sebelum submit.
                      Konfirmasi akan dikirim via Whatsapp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
