import { Project, Experience, Profile } from './types';
import avatarImg from './assets/images/brillian_profile_1782349458172.jpeg';

export const DEFAULT_PROFILE: Profile = {
  name: "BRILLIAN DANIAR KAUTAMA",
  role: "Software Developer & Network Specialist",
  location: "Blitar, Indonesia",
  bio: "Berfokus pada pengembangan antarmuka digital yang fungsional namun memiliki jiwa artistik yang kuat.",
  avatarUrl: avatarImg,
  email: "desipoetibril@gmail.com",
  github: "https://github.com/notbourbae",
  instagram: "https://www.instagram.com/brillian_d.k/",
  tiktok: "https://www.tiktok.com/@_brilliand",
  
  aboutParagraph1: "Perjalanan saya di dunia teknologi dimulai dari ketertarikan mendalam pada infrastruktur jaringan dan sistem komputer. Dengan latar belakang pendidikan Teknik Komputer dan Jaringan hingga kini mendalami Teknik Informatika, saya berdedikasi untuk membangun solusi digital yang tidak hanya fungsional secara teknis tetapi juga memiliki nilai estetika yang kuat.",
  aboutParagraph2: "Saya percaya bahwa teknologi adalah seni yang ditulis dalam bahasa logika. Setiap piksel membawa makna, setiap baris kode menyimpan cerita. Berangkat dari fondasi Teknik Komputer dan Jaringan hingga menapaki dunia Teknik Informatika, saya terus merangkai solusi digital yang memadukan ketepatan, estetika, dan manfaat. Karena bagi saya, sebuah karya tidak hanya dinilai dari bagaimana ia bekerja, tetapi juga dari bagaimana ia memberi kesan bagi setiap orang yang menggunakannya.",
  aboutQuote: "Kode adalah puisi yang dipahami mesin, sementara desain adalah bahasa yang menyentuh manusia. Ketika keduanya berpadu, lahirlah karya yang tak sekadar berfungsi, tetapi juga menginspirasi.",

  skillCat1Title: "Creative Design",
  skillCat1Desc: "Merancang antarmuka pengguna (UI/UX) dengan fokus pada efisiensi teknis dan kemudahan navigasi bagi pengguna.",
  skillCat1Tags: "FIGMA, UI/UX, DESIGN SYSTEM",

  skillCat2Title: "Development",
  skillCat2Desc: "Fokus pada pengembangan perangkat lunak, infrastruktur jaringan, dan solusi teknologi modern.",
  skillCat2Tags: "NETWORKING, VIBE CODING wkwk, WEB DEV, LINUX",

  skillCat3Title: "Networking & Infrastructure",
  skillCat3Desc: "Perancangan jaringan, administrasi server, dan keamanan sistem komputer.",
  skillCat3Tags: "CISCO, MIKROTIK, LINUX",

  contactTitle: "Berikan Pendapat Kamu.",
  contactDesc: "Sebelum meninggalkan halaman ini, saya akan senang mendengar pendapat Anda. Kritik yang membangun, apresiasi, maupun saran pengembangan sangat saya hargai."
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Sistem Manajemen Jaringan Enterprise",
    category: "Code",
    description: "Perancangan dan implementasi infrastruktur jaringan terdistribusi berbasis Cisco dan Mikrotik.",
    longDescription: "Proyek ini mencakup integrasi routing dinamis OSPF, pengamanan perimeter firewall menggunakan Mikrotik RouterOS, serta konfigurasi monitoring lalu lintas real-time menggunakan Prometheus dan Grafana untuk kestabilan operasional server.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    tags: ["Cisco", "Mikrotik", "Routing", "Monitoring"],
    role: "Network Engineer Specialist",
    year: "2025",
    client: "Nusantara Enterprise",
    link: "https://example.com/network"
  },
  {
    id: "proj-2",
    title: "E-Commerce Landing Page Minimalis",
    category: "Design",
    description: "Desain UI/UX fungsional dengan estetika monokrom modern untuk jenama pakaian lokal premium.",
    longDescription: "Merancang tata letak web dengan pendekatan minimalist yang menonjolkan produk secara elegan. Mengimplementasikan interaksi mikro menggunakan Tailwind CSS dan Framer Motion untuk menghasilkan animasi transisi halaman yang mewah dan responsif.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Figma", "UI/UX", "Tailwind CSS", "Monochrome"],
    role: "Art Director & Lead UI Designer",
    year: "2024",
    client: "Karsa Apparel",
    link: "https://example.com/karsa"
  },
  {
    id: "proj-3",
    title: "Aplikasi Portal Akademik Mahasiswa",
    category: "Code",
    description: "Sistem portal web terintegrasi untuk pengelolaan nilai, penjadwalan kuliah, dan kuesioner dosen.",
    longDescription: "Membangun sistem informasi mahasiswa berskala tinggi menggunakan kerangka kerja React, Node.js, dan database PostgreSQL. Menyertakan sistem otentikasi aman JWT dan panel dasbor manajemen performa akademik yang interaktif.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Express", "TypeScript", "PostgreSQL"],
    role: "Fullstack Web Developer",
    year: "2025",
    client: "Universitas Indonesia",
    link: "https://example.com/academic"
  }
];

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: "edu-1",
    role: "Pendidikan Tinggi",
    company: "Universitas Muhammadiyah Malang",
    period: "2024 — Sekarang",
    description: "Melanjutkan studi di tingkat universitas dengan fokus pada pengembangan kompetensi profesional dan akademik.",
    major: "Teknik Informatika"
  },
  {
    id: "edu-2",
    role: "Sekolah Menengah Kejuruan",
    company: "SMKN 1 Doko",
    period: "2021 — 2024",
    description: "Fokus pada penguasaan keterampilan teknis dan praktik industri yang relevan dengan bidang keahlian.",
    major: "Teknik Komputer dan Jaringan"
  },
  {
    id: "edu-3",
    role: "Sekolah Menengah Pertama",
    company: "SMPN 1 Selorejo",
    period: "2018 — 2021",
    description: "Membangun landasan akademik yang kuat dan aktif dalam berbagai kegiatan pengembangan diri siswa."
  },
  {
    id: "edu-4",
    role: "Sekolah Dasar",
    company: "SDN Ngrendeng 02",
    period: "2012 — 2018",
    description: "Tahap awal pendidikan formal dengan fokus pada literasi dasar, numerasi, dan pembentukan karakter."
  }
];

