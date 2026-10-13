'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const accordionItems = [
  {
    title: 'Deteksi Dini',
    content:
      'Memberikan alat skrining berbasis gejala yang mudah diakses oleh seluruh lapisan masyarakat Palembang, sehingga potensi ISPA dapat teridentifikasi sejak tahap awal sebelum berkembang menjadi komplikasi serius.',
  },
  {
    title: 'Edukasi Masyarakat',
    content:
      'Menyebarkan informasi akurat mengenai dampak polusi udara terhadap kesehatan pernapasan, serta cara-cara praktis yang dapat dilakukan masyarakat untuk melindungi diri dari paparan udara buruk.',
  },
  {
    title: 'Data Terbuka & Transparan',
    content:
      'Menyediakan data kualitas udara real-time Palembang yang dapat diakses secara terbuka oleh siapa saja — dari masyarakat biasa hingga peneliti dan pembuat kebijakan.',
  },
  {
    title: 'Kolaborasi Multi-Pihak',
    content:
      'Mendorong sinergi antara pemerintah daerah, fasilitas kesehatan, akademisi, dan komunitas dalam menangani masalah kualitas udara dan kesehatan pernapasan secara terpadu.',
  },
];

const sdgImages = [
  { src: '/sdg-3.png', alt: 'SDG 3 – Good Health and Well-Being', label: 'SDG 3' },
  { src: '/sdg-11.png', alt: 'SDG 11 – Sustainable Cities and Communities', label: 'SDG 11' },
  { src: '/sdg-13.png', alt: 'SDG 13 – Climate Action', label: 'SDG 13' },
];

interface AccordionItemProps {
  title: string;
  content: string;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

function AccordionItemComponent({ title, content, index, isOpen, onToggle }: AccordionItemProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    if (isOpen) {
      gsap.set(panel, { height: 'auto', display: 'block' });
      const h = panel.offsetHeight;
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.38, ease: 'power2.out' },
      );
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => gsap.set(panel, { display: 'none' }),
      });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
      >
        <span className="font-sans">{title}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        ref={panelRef}
        style={{ height: 0, display: 'none', overflow: 'hidden' }}
      >
        <div ref={innerRef} className="pb-5">
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">{content}</p>
        </div>
      </div>
    </div>
  );
}

export default function AccordionGoals() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sdgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  useEffect(() => {
    const sdgEls = sdgRefs.current.filter(Boolean);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading fade-in
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse',
          },
        });
      }

      // SDG logos glide in with stagger from their asymmetric positions
      if (sdgEls.length > 0) {
        gsap.from(sdgEls[0], {
          opacity: 0,
          x: -30,
          y: 20,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play reverse play reverse',
          },
        });
        gsap.from(sdgEls[1], {
          opacity: 0,
          x: 30,
          y: -20,
          duration: 0.65,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play reverse play reverse',
          },
        });
        gsap.from(sdgEls[2], {
          opacity: 0,
          x: -20,
          y: -30,
          duration: 0.65,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play reverse play reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div ref={headingRef} className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            Profil &amp; Tujuan
          </span>
          <h2 className="font-heading mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Misi Kami
          </h2>
          <p className="mt-3 font-sans text-muted-foreground">
            Berkomitmen menghadirkan udara yang lebih sehat bagi setiap warga Palembang melalui
            teknologi yang mudah diakses.
          </p>
        </div>

        {/* Two-column layout: 55/45 split */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left column — Accordion */}
          <div className="flex-[55] min-w-0">
            <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
              {accordionItems.map((item, index) => (
                <AccordionItemComponent
                  key={index}
                  title={item.title}
                  content={item.content}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>

          {/* Right column — SDG Asymmetric Puzzle Layout */}
          <div className="flex-[45] min-w-0">
            <div className="mb-5">
              <h3 className="font-heading font-semibold text-foreground">
                Mendukung Tujuan Pembangunan Berkelanjutan
              </h3>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                Selaras dengan Sustainable Development Goals (SDGs) PBB
              </p>
            </div>

            {/*
              Asymmetric triangular cluster:
              - SDG 3  → top-left, large
              - SDG 11 → top-right, slightly smaller, elevated
              - SDG 13 → bottom-center, large, overlapping both
            */}
            <div className="relative h-72 sm:h-80">
              {/* SDG 3 — top-left */}
              <div
                ref={(el) => { sdgRefs.current[0] = el; }}
                className="absolute top-0 left-0 z-10 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/60 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ width: '48%', aspectRatio: '1/1' }}
              >
                <Image
                  src="/sdg-3.png"
                  alt={sdgImages[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 48vw, 22vw"
                />
              </div>

              {/* SDG 11 — top-right, slightly lower */}
              <div
                ref={(el) => { sdgRefs.current[1] = el; }}
                className="absolute top-4 right-0 z-10 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/60 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ width: '44%', aspectRatio: '1/1' }}
              >
                <Image
                  src="/sdg-11.png"
                  alt={sdgImages[1].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 44vw, 20vw"
                />
              </div>

              {/* SDG 13 — bottom-center, overlapping both */}
              <div
                ref={(el) => { sdgRefs.current[2] = el; }}
                className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 overflow-hidden rounded-2xl shadow-xl ring-4 ring-background transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{ width: '46%', aspectRatio: '1/1' }}
              >
                <Image
                  src="/sdg-13.png"
                  alt={sdgImages[2].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 46vw, 21vw"
                />
              </div>
            </div>

            <p className="mt-4 font-sans text-xs text-muted-foreground text-center">
              SDG 3 · SDG 11 · SDG 13 — United Nations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
