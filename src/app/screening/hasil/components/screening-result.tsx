'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Activity,
  Stethoscope,
} from 'lucide-react';
import type { ScreeningResponseType } from '@/lib/screening/dto/screening.dto';

interface ScreeningResultProps {
  result: ScreeningResponseType;
}

const riskConfig = {
  LOW: {
    label: 'Risiko Rendah',
    description:
      'Kondisi pernapasan Anda relatif baik. Tetap jaga kesehatan dan pantau kualitas udara secara berkala.',
    colorClass: 'text-green-600',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200',
    barClass: 'bg-green-500',
    Icon: CheckCircle2,
  },
  MEDIUM: {
    label: 'Risiko Sedang',
    description: 'Terdapat beberapa gejala yang perlu diperhatikan. Waspadai paparan udara buruk.',
    colorClass: 'text-yellow-600',
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-200',
    barClass: 'bg-yellow-500',
    Icon: AlertTriangle,
  },
  HIGH: {
    label: 'Risiko Tinggi',
    description: 'Gejala Anda cukup serius. Segera konsultasikan dengan tenaga medis.',
    colorClass: 'text-destructive',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    barClass: 'bg-destructive',
    Icon: AlertCircle,
  },
};

export default function ScreeningResult({ result }: ScreeningResultProps) {
  const config = riskConfig[result.riskLevel];
  const { Icon } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const recItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
      gsap.from(recItemRefs.current, {
        opacity: 0,
        x: -20,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-muted py-12">
      <div ref={containerRef} className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1.5 text-xs font-medium text-primary">
            <Activity className="h-3 w-3" />
            Hasil Screening
          </span>
          <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
            Ringkasan Risiko Kesehatan Anda
          </h1>
          <p className="mt-2 text-muted-foreground">
            Berikut hasil analisis berdasarkan jawaban yang Anda berikan pada kuesioner screening.
          </p>
        </div>

        {/* Risk level card */}
        <div
          className={`mb-6 rounded-2xl border ${config.borderClass} ${config.bgClass} p-8 text-center`}
        >
          <div className="flex justify-center">
            <Icon className={`h-10 w-10 ${config.colorClass}`} />
          </div>
          <h2 className={`mt-3 text-xl font-bold ${config.colorClass}`}>{config.label}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{config.description}</p>
          <div className="mx-auto mt-5 max-w-xs">
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full ${config.barClass}`}
                style={{ width: `${(result.calculatedScore / 100) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Skor: {result.calculatedScore} dari 100
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-5 font-semibold text-card-foreground">Rekomendasi Kesehatan</h3>
          <div className="space-y-4">
            {result.recommendationList.map((rec, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  recItemRefs.current[idx] = el;
                }}
                className="flex items-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Hasil ini merupakan skrining awal berbasis gejala dan bukan pengganti diagnosis medis
          profesional. Selalu konsultasikan kondisi Anda dengan tenaga kesehatan.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/screening"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" />
            Ulangi Screening
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Kembali ke Beranda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
