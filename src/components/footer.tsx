import Link from 'next/link';
import { Wind } from 'lucide-react';

const NAV_COLUMNS = [
  {
    heading: 'Tentang Kami',
    links: [
      { href: '/', label: 'Tentang NapasSehat' },
      { href: '/', label: 'Hubungi Kami' },
      { href: '/', label: 'Karir' },
      { href: '/', label: 'Permintaan Media' },
      { href: '/', label: 'Yayasan Udara Bersih' },
    ],
  },
  {
    heading: 'Layanan',
    links: [
      { href: '/screening', label: 'Screening Risiko ISPA' },
      { href: '/', label: 'Pemantauan AQI Real-Time' },
      { href: '/', label: 'Rekomendasi Kesehatan' },
      { href: '/', label: 'Tren Historis' },
      { href: '/', label: 'Notifikasi Udara' },
    ],
  },
  {
    heading: 'Sumber Daya',
    links: [
      { href: '/', label: 'Data Kualitas Udara' },
      { href: '/', label: 'Panduan ISPA' },
      { href: '/', label: 'Berita Kesehatan' },
      { href: '/', label: 'Basis Pengetahuan' },
      { href: '/', label: 'Kontributor Komunitas' },
    ],
  },
  {
    heading: 'Kualitas Udara',
    links: [
      { href: '/', label: 'AQI Palembang' },
      { href: '/', label: 'Indeks Kota Sumatera' },
      { href: '/', label: 'Data Historis' },
      { href: '/', label: 'Peta Polusi' },
      { href: '/', label: 'Peringkat Kota AQI' },
    ],
  },
  {
    heading: 'Dukungan',
    links: [
      { href: '/kontak', label: 'Hubungi Dukungan' },
      { href: '/', label: 'FAQ' },
      { href: '/', label: 'Kebijakan Privasi' },
      { href: '/', label: 'Syarat & Ketentuan' },
      { href: '/', label: 'Aksesibilitas' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950">
      {/* Main nav grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Brand row */}
        <div className="mb-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wind className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading text-lg font-bold text-white tracking-tight">
            NapasSehat
          </span>
        </div>

        {/* 5-column nav grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-heading mb-4 text-xs font-bold uppercase tracking-widest text-white">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="font-sans text-xs text-gray-500">
            © 2026 NapasSehat Palembang. Seluruh hak cipta dilindungi.
          </p>
          <p className="font-sans text-xs text-gray-500">
            Mendukung SDG 3, SDG 11 &amp; SDG 13 — Perserikatan Bangsa-Bangsa
          </p>
        </div>
      </div>
    </footer>
  );
}
