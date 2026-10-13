'use client';

import { useState } from 'react';
import { ArrowRight, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';

const SOCIAL_LINKS = [
  { href: '#', label: 'Facebook',  icon: <Facebook  className="h-5 w-5" /> },
  { href: '#', label: 'X / Twitter', icon: <Twitter   className="h-5 w-5" /> },
  { href: '#', label: 'YouTube',   icon: <Youtube   className="h-5 w-5" /> },
  { href: '#', label: 'Instagram', icon: <Instagram className="h-5 w-5" /> },
  { href: '#', label: 'LinkedIn',  icon: <Linkedin  className="h-5 w-5" /> },
];

export default function CtaBanner() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // newsletter submit placeholder
    setEmail('');
  }

  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/footer-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay so text stays legible */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6 text-center">
        {/* Heading */}
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          Terhubung dengan Kami
        </h2>
        <p className="mt-3 font-sans text-base text-white/70 md:text-lg max-w-xl mx-auto leading-relaxed">
          Dapatkan artikel eksklusif, pembaruan data udara, tips kesehatan, dan penawaran berkala
          yang dikirim langsung ke kotak masuk Anda. Anda dapat berhenti berlangganan kapan saja.
        </p>

        {/* Email form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex items-center mx-auto max-w-md rounded-full border border-white/30 bg-white/10 backdrop-blur-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/70"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="flex-1 bg-transparent px-5 py-3.5 text-sm text-white placeholder-white/50 outline-none font-sans"
          />
          <button
            type="submit"
            aria-label="Daftar Newsletter"
            className="m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/80"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Social icons */}
        <div className="mt-7 flex items-center justify-center gap-3">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
