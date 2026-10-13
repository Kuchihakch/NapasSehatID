'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wind } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/screening', label: 'Screening' },
  { href: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wind className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground font-heading">
            NapasSehat <span className="text-primary">Palembang</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/screening"
          className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:block"
        >
          Mulai Screening
        </Link>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden"
          aria-label="Buka menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
