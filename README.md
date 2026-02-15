# Join Event COCONUT Computer Club
**Sistem Informasi & Pendaftaran Kegiatan  
:contentReference[oaicite:0]{index=0}**

Website ini adalah aplikasi yang digunakan sebagai platform pengelolaan informasi dan pendaftaran kegiatan eksternal milik COCONUT Computer Club, yang mencakup berbagai program seperti **Open Class, Webinar, Seminar, serta Bootcamp profesional**.

Dibangun sebagai antarmuka utama bagi peserta untuk melihat informasi kegiatan, detail agenda, serta melakukan proses pendaftaran secara online.

![Vite](https://img.shields.io/badge/Vite-5.4.19-646cff?logo=vite)
![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38bdf8?logo=tailwindcss)

---

## Daftar Isi

- [Tentang Sistem](#-tentang-sistem)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Struktur Project](#-struktur-project)

---

## Tentang Sistem

**Join Event COCONUT** adalah aplikasi web modern yang berfungsi sebagai pusat informasi kegiatan eksternal COCONUT Computer Club, dan wadah pendaftaran peserta secara online.

Aplikasi ini dirancang agar:

- mudah digunakan oleh calon peserta,
- responsif di berbagai perangkat,
- siap terintegrasi dengan backend API untuk kebutuhan pendaftaran, validasi, dan manajemen data event.

Jenis kegiatan yang didukung antara lain:

- Open Class
- Webinar
- Seminar
- Bootcamp profesional

---

## Fitur Utama

- **Daftar Event Terpusat**  
  Menampilkan seluruh kegiatan aktif yang diselenggarakan oleh COCONUT Computer Club.

- **Form Pendaftaran Online**  
  Peserta dapat melakukan pendaftaran langsung melalui website.

- **Detail Informasi Event**  
  Menampilkan deskripsi, waktu pelaksanaan, lokasi, kuota, dan jenis kegiatan.

- **Kategorisasi Event**  
  Event dikelompokkan berdasarkan tipe kegiatan (Open Class, Webinar, Seminar, Bootcamp).

- **Galeri Event Terdahulu**  
  Menampilkan dokumentasi event-event yang telah dilaksanakan.

---

## Tech Stack

### Frontend

- **Build Tool** : Vite `v5.4.19`
- **Framework / Library** : React `v18.3.1`
- **Language** : TypeScript `v5.8.3`
- **Styling** : Tailwind CSS `v3.4.17`

### Supporting Tools

- React Hooks
- PostCSS
- ESLint

---

## Quick Start

### Prerequisites

```bash
Node.js >= 22.22.0
npm >= 10.9.4
```

---

### Installation

```bash
# 1. Clone repository
git clone https://github.com/CCNT-hacklab/Join-Event.git

# 2. Masuk ke folder project
cd join-event

# 3. Install dependencies
npm install
```

---

### Run Development Server

```bash
npm run dev
```

Akses aplikasi melalui browser:

```text
http://localhost:5173
```

---

### Build for Production

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

---

## Struktur Project

Struktur dasar project ini mengikuti standar Vite + React + TypeScript.

```
join-event-frontend/
├── public/                 # Static assets
│
├── src/
│   ├── assets/             # Gambar, icon, ilustrasi
│   │
│   ├── components/         # Reusable UI components
│   │   ├── ui/
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── NavLink.tsx
│   │   ├── PublicLayout.tsx
│   │   └── EventCard.tsx
│   │
│   ├── pages/              # Halaman utama aplikasi
│   │   ├── admin/
│   │   │   ├──AdminDashboard.tsx
│   │   │   ├──AdminDocumentations.tsx
│   │   │   └── ...
│   │   │
│   │   ├── Index.tsx
│   │   ├── Events.tsx
│   │   ├── DocumentationPage.tsx
│   │   ├── Contact.tsx
│   │   ├── NotFound.tsx
│   │   ├── EventDetail.tsx
│   │   └── Register.tsx
│   │
│   ├── data/               # Data dummy / mock / helper
│   │
│   ├── lib/                # Utility & helper functions
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── README.md
```

**Penjelasan singkat folder utama:**

* `components/`
  Komponen UI yang dapat digunakan ulang (button, card event, modal, dsb).

* `pages/`
  Halaman utama seperti landing page, detail event, dan form pendaftaran.

* `data/`
  Berisi data statis / mock selama tahap pengembangan.

* `lib/`
  Helper dan utility (formatter, helper API, dll).

---

> Aplikasi ini disiapkan sebagai bagian dari ekosistem sistem pendaftaran kegiatan COCONUT Computer Club dan dapat langsung diintegrasikan dengan backend REST API.

```
```
