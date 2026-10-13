'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, ClipboardList, HeartPulse, TrendingUp } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: <Activity className="h-6 w-6" />,
    title: 'Pemantauan AQI Real-Time',
    description:
      'Data kualitas udara Palembang terkini, diperbarui secara berkala setiap beberapa menit.',
  },
  {
    icon: <ClipboardList className="h-6 w-6" />,
    title: 'Screening Risiko ISPA',
    description:
      'Kuesioner singkat berbasis gejala untuk menilai tingkat risiko gangguan pernapasan Anda.',
  },
  {
    icon: <HeartPulse className="h-6 w-6" />,
    title: 'Rekomendasi Kesehatan',
    description:
      'Saran tindakan medis yang personal dan mudah dipahami sesuai tingkat risiko Anda.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Tren Historis',
    description:
      'Pahami pola kualitas udara dari waktu ke waktu untuk perencanaan aktivitas luar ruang.',
  },
];

export default function FeatureGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!sectionRef.current || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 32,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play reverse play reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="data-kualitas-udara" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            Layanan Kami
          </span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Satu Platform, Udara Lebih Terpantau
          </h2>
          <p className="mt-3 text-muted-foreground">
            NapasSehat menggabungkan data lingkungan dan skrining kesehatan mandiri dalam satu
            pengalaman yang sederhana dan cepat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
