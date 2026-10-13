import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'NapasSehat Palembang — Pemantauan Udara & Deteksi Risiko ISPA',
  description:
    'Platform pemantauan kualitas udara real-time dan skrining risiko ISPA gratis untuk warga Kota Palembang, Sumatera Selatan.',
  keywords: ['kualitas udara', 'ISPA', 'Palembang', 'AQI', 'kesehatan pernapasan'],
  icons: {
    icon: '/NapasSehat.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Poppins (body) + Outfit (headings) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
