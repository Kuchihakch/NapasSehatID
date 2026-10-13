'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Droplets, Thermometer, Wind, ArrowRight, Gauge } from 'lucide-react';
import type { AirQualityCurrentResponseType } from '@/lib/air-quality/dto/air-quality.dto';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  airQuality: AirQualityCurrentResponseType | null;
}

const HEADLINE_WORDS = [
  { text: 'Bernapas', colored: false },
  { text: 'Sehat,', colored: false },
  { text: 'Hidup', colored: true },
  { text: 'Lebih', colored: true },
  { text: 'Baik', colored: true },
  { text: 'di', colored: false },
  { text: 'Palembang', colored: false },
];

export default function HeroSection({ airQuality }: HeroSectionProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Refs for CountUp animated numbers
  const aqiValueRef = useRef<HTMLSpanElement>(null);
  const pm25ValueRef = useRef<HTMLSpanElement>(null);
  const tempValueRef = useRef<HTMLSpanElement>(null);
  const humidityValueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;

    const words = headlineRef.current.querySelectorAll<HTMLSpanElement>('.word-inner');

    const ctx = gsap.context(() => {
      // Badge fade in
      gsap.from(badgeRef.current, { opacity: 0, y: -16, duration: 0.5, ease: 'power2.out' });

      // Word-by-word slide up
      gsap.from(words, {
        opacity: 0,
        y: 40,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.15,
      });

      // Subtitle
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.6,
      });

      // CTA
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 18,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.8,
      });

      // Card slide from right
      gsap.from(cardRef.current, {
        opacity: 0,
        x: 40,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.3,
      });

      // CountUp animations
      if (airQuality) {
        const counters = [
          { ref: aqiValueRef, target: airQuality.usAqi, decimals: 0 },
          { ref: pm25ValueRef, target: airQuality.pm25, decimals: 1 },
          { ref: tempValueRef, target: airQuality.temperature ?? 31, decimals: 0 },
          { ref: humidityValueRef, target: airQuality.relativeHumidity ?? 68, decimals: 0 },
        ];
        counters.forEach(({ ref, target, decimals }) => {
          if (!ref.current) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            delay: 0.5,
            ease: 'power2.out',
            onUpdate() {
              if (ref.current) {
                ref.current.textContent = obj.val.toFixed(decimals);
              }
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, [airQuality]);

  const aqiLabel = airQuality?.aqiLabel ?? 'Sedang';

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 min-h-[90vh] flex items-center"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/30 to-teal-900/40 pointer-events-none" />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-2 w-full">
        {/* Left column */}
        <div>
          <div
            ref={badgeRef}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            Pemantauan Udara Real-Time
          </div>

          <h1
            ref={headlineRef}
            className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl drop-shadow-md"
          >
            {HEADLINE_WORDS.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden align-bottom">
                <span
                  className={`word-inner inline-block${word.colored ? ' text-teal-300' : ''}`}
                >
                  {word.text}&nbsp;
                </span>
              </span>
            ))}
          </h1>

          <p ref={subtitleRef} className="mt-4 max-w-md text-base text-white/80 md:text-lg drop-shadow-sm">
            Pantau kualitas udara kota Anda secara langsung dan kenali risiko ISPA lebih awal
            melalui skrining kesehatan gratis berbasis gejala.
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/screening"
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-400"
            >
              Mulai Screening Risiko ISPA Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#data-kualitas-udara"
              className="text-sm font-medium text-white/70 transition hover:text-teal-300"
            >
              Lihat Data Kualitas Udara
            </Link>
          </div>
        </div>

        {/* Right column — Liquid Glass AQI Card */}
        <div ref={cardRef} className="flex justify-center md:justify-end">
          <div
            className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.25)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                <MapPin className="h-4 w-4 text-teal-300" />
                Palembang, Sumatera Selatan
              </div>
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            </div>

            {/* Main AQI metric */}
            <div className="mb-4 flex items-end gap-3">
              <span className="font-heading text-6xl font-black text-white drop-shadow">
                <span ref={aqiValueRef}>{airQuality?.usAqi ?? 87}</span>
              </span>
              <div className="mb-1">
                <div className="flex items-center gap-1 text-xs font-medium text-white/60">
                  <Gauge className="h-3 w-3" />
                  US AQI
                </div>
                <div className="text-sm font-semibold text-teal-300">{aqiLabel}</div>
              </div>
            </div>

            {/* Sub-metrics grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-white/10 border border-white/10 p-3 text-center backdrop-blur-sm">
                <Wind className="mx-auto h-4 w-4 text-teal-300" />
                <div className="mt-1 font-heading text-xl font-bold text-white">
                  <span ref={pm25ValueRef}>{airQuality?.pm25?.toFixed(1) ?? '42.0'}</span>
                </div>
                <div className="text-[10px] text-white/60">PM2.5</div>
                <div className="text-[10px] text-white/60">μg/m³</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-3 text-center backdrop-blur-sm">
                <Thermometer className="mx-auto h-4 w-4 text-teal-300" />
                <div className="mt-1 font-heading text-xl font-bold text-white">
                  <span ref={tempValueRef}>{Math.round(airQuality?.temperature ?? 31)}</span>
                </div>
                <div className="text-[10px] text-white/60">Suhu</div>
                <div className="text-[10px] text-white/60">°C</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-3 text-center backdrop-blur-sm">
                <Droplets className="mx-auto h-4 w-4 text-teal-300" />
                <div className="mt-1 font-heading text-xl font-bold text-white">
                  <span ref={humidityValueRef}>
                    {Math.round(airQuality?.relativeHumidity ?? 68)}
                  </span>
                </div>
                <div className="text-[10px] text-white/60">Kelembapan</div>
                <div className="text-[10px] text-white/60">%</div>
              </div>
            </div>

            <p className="mt-3 text-center text-[10px] text-white/50">
              Diperbarui beberapa menit lalu
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
