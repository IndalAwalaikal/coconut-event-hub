export type EventCategory = "open-class" | "webinar" | "seminar" | "bootcamp";

export interface Event {
  id: string;
  category: EventCategory;
  categoryLabel: string;
  title: string;
  description: string;
  rules: string[];
  benefits: string[];
  date: string;
  time: string;
  speaker1: string;
  speaker2?: string;
  speaker3?: string;
  moderator: string;
  location: string;
  quota: number;
  registered: number;
  poster: string;
  available: boolean;
}

export interface Registrant {
  id: string;
  eventId: string;
  name: string;
  whatsapp: string;
  institution: string;
  proofImage: string;
  registeredAt: string;
}

export interface Documentation {
  id: string;
  eventId: string;
  category: EventCategory;
  categoryLabel: string;
  eventTitle: string;
  year: number;
  images: string[];
  description: string;
}

export const categoryLabels: Record<EventCategory, string> = {
  "open-class": "COCONUT Open Class",
  webinar: "Webinar",
  seminar: "Seminar",
  bootcamp: "Bootcamp",
};

export const categoryColors: Record<EventCategory, string> = {
  "open-class": "bg-primary",
  webinar: "bg-glow-secondary",
  seminar: "bg-emerald-500",
  bootcamp: "bg-amber-500",
};

export const mockEvents: Event[] = [
  {
    id: "oc-1",
    category: "open-class",
    categoryLabel: "COCONUT Open Class",
    title: "Pengenalan Web Development dengan React",
    description: "Pelajari dasar-dasar pengembangan web modern menggunakan React.js. Materi mencakup komponen, state management, dan pembuatan UI interaktif.",
    rules: [
      "Peserta wajib hadir 15 menit sebelum acara dimulai",
      "Membawa laptop pribadi dengan Node.js terinstall",
      "Mengikuti seluruh rangkaian acara hingga selesai",
      "Menjaga ketertiban selama acara berlangsung",
    ],
    benefits: [
      "E-Sertifikat kehadiran",
      "Materi pembelajaran lengkap",
      "Akses ke grup diskusi eksklusif",
      "Hands-on project portfolio",
    ],
    date: "2025-03-15",
    time: "09:00 - 12:00 WIB",
    speaker1: "Ahmad Rizky, S.Kom",
    speaker2: "Dewi Sartika, M.Cs",
    moderator: "Budi Santoso",
    location: "Lab Komputer Gedung A Lt.3",
    quota: 50,
    registered: 32,
    poster: "/placeholder.svg",
    available: true,
  },
  {
    id: "oc-2",
    category: "open-class",
    categoryLabel: "COCONUT Open Class",
    title: "UI/UX Design Fundamentals",
    description: "Workshop desain UI/UX untuk pemula. Belajar prinsip desain, wireframing, dan prototyping menggunakan Figma.",
    rules: [
      "Peserta wajib membuat akun Figma sebelum acara",
      "Hadir tepat waktu",
      "Mengikuti seluruh sesi workshop",
    ],
    benefits: [
      "E-Sertifikat",
      "Template Figma gratis",
      "Portfolio project",
      "Networking dengan desainer profesional",
    ],
    date: "2025-03-22",
    time: "13:00 - 16:00 WIB",
    speaker1: "Sarah Amanda, S.Ds",
    moderator: "Rina Kartika",
    location: "Aula Fakultas Ilmu Komputer",
    quota: 40,
    registered: 40,
    poster: "/placeholder.svg",
    available: true,
  },
  {
    id: "wb-1",
    category: "webinar",
    categoryLabel: "Webinar",
    title: "Karir di Dunia IT: Peluang dan Tantangan",
    description: "Webinar online membahas berbagai jalur karir di industri teknologi informasi, tips memulai karir, dan skill yang dibutuhkan.",
    rules: [
      "Peserta wajib join Zoom 10 menit sebelum acara",
      "Menjaga mikrofon dalam keadaan mute",
      "Pertanyaan diajukan melalui fitur Q&A",
    ],
    benefits: [
      "E-Sertifikat",
      "Rekaman webinar",
      "Slide presentasi",
      "Kesempatan tanya jawab langsung",
    ],
    date: "2025-04-05",
    time: "19:00 - 21:00 WIB",
    speaker1: "Dr. Hendra Wijaya",
    speaker2: "Fitri Rahmawati, M.T",
    moderator: "Dimas Prasetyo",
    location: "Online via Zoom",
    quota: 200,
    registered: 87,
    poster: "/placeholder.svg",
    available: true,
  },
  {
    id: "sm-1",
    category: "seminar",
    categoryLabel: "Seminar",
    title: "Artificial Intelligence & Masa Depan Teknologi",
    description: "Seminar nasional tentang perkembangan AI, machine learning, dan dampaknya terhadap berbagai industri di Indonesia.",
    rules: [
      "Peserta wajib melakukan registrasi ulang di tempat",
      "Berpakaian rapi dan sopan",
      "Dilarang membawa makanan ke dalam ruangan",
      "Mengikuti seluruh rangkaian acara",
    ],
    benefits: [
      "Sertifikat seminar nasional",
      "Goodie bag eksklusif",
      "Networking session",
      "Lunch & coffee break",
      "Materi presentasi digital",
    ],
    date: "2025-04-20",
    time: "08:00 - 15:00 WIB",
    speaker1: "Prof. Agus Setiawan, Ph.D",
    speaker2: "Maria Chen, MSc",
    speaker3: "Robert Tanaka",
    moderator: "Lisa Permata, S.Kom",
    location: "Auditorium Universitas, Gedung Utama",
    quota: 300,
    registered: 156,
    poster: "/placeholder.svg",
    available: true,
  },
  {
    id: "bc-1",
    category: "bootcamp",
    categoryLabel: "Bootcamp",
    title: "Full-Stack Developer Bootcamp",
    description: "Bootcamp intensif selama 3 hari untuk mempelajari pengembangan aplikasi full-stack dengan teknologi modern.",
    rules: [
      "Peserta wajib hadir selama 3 hari penuh",
      "Membawa laptop dengan spesifikasi minimum yang ditentukan",
      "Menyelesaikan pre-assignment sebelum bootcamp",
      "Bekerja dalam tim selama bootcamp",
    ],
    benefits: [
      "Sertifikat kompetensi",
      "Project portfolio lengkap",
      "Mentoring 1-on-1",
      "Akses materi seumur hidup",
      "Rekomendasi kerja",
    ],
    date: "2025-05-10",
    time: "08:00 - 17:00 WIB (3 hari)",
    speaker1: "Yusuf Hakim, S.T",
    speaker2: "Nina Saraswati, M.Kom",
    moderator: "Andi Firmansyah",
    location: "Co-working Space TechHub, Lantai 5",
    quota: 30,
    registered: 28,
    poster: "/placeholder.svg",
    available: true,
  },
  {
    id: "wb-2",
    category: "webinar",
    categoryLabel: "Webinar",
    title: "Cybersecurity Awareness",
    description: "Webinar tentang keamanan siber untuk mahasiswa dan umum.",
    rules: ["Hadir tepat waktu", "Menjaga mikrofon mute"],
    benefits: ["E-Sertifikat", "Materi presentasi"],
    date: "2025-06-01",
    time: "14:00 - 16:00 WIB",
    speaker1: "TBA",
    moderator: "TBA",
    location: "Online via Zoom",
    quota: 150,
    registered: 0,
    poster: "/placeholder.svg",
    available: false,
  },
];

export const mockDocumentation: Documentation[] = [
  {
    id: "doc-1",
    eventId: "oc-past-1",
    category: "open-class",
    categoryLabel: "COCONUT Open Class",
    eventTitle: "Belajar Python dari Nol",
    year: 2024,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    description: "Dokumentasi kegiatan Open Class Python yang diikuti oleh 45 peserta.",
  },
  {
    id: "doc-2",
    eventId: "sm-past-1",
    category: "seminar",
    categoryLabel: "Seminar",
    eventTitle: "Seminar Teknologi Cloud Computing",
    year: 2024,
    images: ["/placeholder.svg", "/placeholder.svg"],
    description: "Seminar nasional dengan 250+ peserta membahas cloud computing.",
  },
  {
    id: "doc-3",
    eventId: "wb-past-1",
    category: "webinar",
    categoryLabel: "Webinar",
    eventTitle: "Webinar Data Science for Beginners",
    year: 2023,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    description: "Webinar online yang diikuti oleh 180 peserta dari berbagai universitas.",
  },
  {
    id: "doc-4",
    eventId: "bc-past-1",
    category: "bootcamp",
    categoryLabel: "Bootcamp",
    eventTitle: "Mobile App Development Bootcamp",
    year: 2023,
    images: ["/placeholder.svg", "/placeholder.svg"],
    description: "Bootcamp 3 hari pengembangan aplikasi mobile dengan Flutter.",
  },
];

export const mockRegistrants: Registrant[] = [
  {
    id: "reg-1",
    eventId: "oc-1",
    name: "Muhammad Faisal",
    whatsapp: "081234567890",
    institution: "Universitas Indonesia",
    proofImage: "/placeholder.svg",
    registeredAt: "2025-02-20T10:30:00",
  },
  {
    id: "reg-2",
    eventId: "oc-1",
    name: "Siti Nurhaliza",
    whatsapp: "082345678901",
    institution: "Institut Teknologi Bandung",
    proofImage: "/placeholder.svg",
    registeredAt: "2025-02-21T14:15:00",
  },
  {
    id: "reg-3",
    eventId: "wb-1",
    name: "Andi Pratama",
    whatsapp: "083456789012",
    institution: "Universitas Gadjah Mada",
    proofImage: "/placeholder.svg",
    registeredAt: "2025-03-01T09:00:00",
  },
  {
    id: "reg-4",
    eventId: "sm-1",
    name: "Rina Susanti",
    whatsapp: "084567890123",
    institution: "SMA Negeri 1 Jakarta",
    proofImage: "/placeholder.svg",
    registeredAt: "2025-03-05T16:45:00",
  },
];
