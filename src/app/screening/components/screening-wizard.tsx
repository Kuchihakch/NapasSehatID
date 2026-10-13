'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ArrowRight, Stethoscope } from 'lucide-react';
import { submitScreeningAction } from '@/app/actions/screening.actions';

type SymptomKey =
  | 'hasShortnessOfBreath'
  | 'hasChronicCough'
  | 'hasPreExistingCondition'
  | 'hasSoreThroat'
  | 'hasIrritatedEyes';

interface AnswerState {
  fullName: string;
  age: string;
  hasShortnessOfBreath: boolean | null;
  hasChronicCough: boolean | null;
  hasPreExistingCondition: boolean | null;
  hasSoreThroat: boolean | null;
  hasIrritatedEyes: boolean | null;
}

interface Question {
  id: SymptomKey;
  question: string;
  options: { label: string; value: boolean }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'hasChronicCough',
    question: 'Apakah Anda mengalami batuk dalam 3 hari terakhir?',
    options: [
      { label: 'Tidak sama sekali', value: false },
      { label: 'Kadang-kadang', value: true },
      { label: 'Sering', value: true },
      { label: 'Terus-menerus', value: true },
    ],
  },
  {
    id: 'hasShortnessOfBreath',
    question: 'Apakah Anda merasakan sesak napas atau kesulitan bernapas?',
    options: [
      { label: 'Tidak sama sekali', value: false },
      { label: 'Ringan', value: false },
      { label: 'Sedang', value: true },
      { label: 'Berat', value: true },
    ],
  },
  {
    id: 'hasSoreThroat',
    question: 'Apakah Anda mengalami sakit tenggorokan belakangan ini?',
    options: [
      { label: 'Tidak', value: false },
      { label: 'Ya, sedikit tidak nyaman', value: true },
      { label: 'Ya, cukup nyeri', value: true },
      { label: 'Ya, sangat nyeri', value: true },
    ],
  },
  {
    id: 'hasIrritatedEyes',
    question: 'Apakah mata Anda terasa perih, merah, atau berair akhir-akhir ini?',
    options: [
      { label: 'Tidak sama sekali', value: false },
      { label: 'Sedikit', value: true },
      { label: 'Cukup mengganggu', value: true },
      { label: 'Sangat mengganggu', value: true },
    ],
  },
  {
    id: 'hasPreExistingCondition',
    question: 'Apakah Anda memiliki riwayat penyakit pernapasan atau kondisi kronis?',
    options: [
      { label: 'Tidak ada', value: false },
      { label: 'Asma', value: true },
      { label: 'PPOK / Bronkitis kronis', value: true },
      { label: 'Kondisi lainnya', value: true },
    ],
  },
];

const TOTAL_STEPS = QUESTIONS.length + 1; // +1 for personal info

export default function ScreeningWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({
    fullName: '',
    age: '',
    hasShortnessOfBreath: null,
    hasChronicCough: null,
    hasPreExistingCondition: null,
    hasSoreThroat: null,
    hasIrritatedEyes: null,
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' },
    );
  }, [currentStep]);

  function handleOptionSelect(optionIdx: number, value: boolean) {
    setSelectedOption(optionIdx);
    const question = QUESTIONS[currentStep - 1];
    if (question) {
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    }
  }

  async function handleNext() {
    if (currentStep === 0) {
      if (!answers.fullName.trim() || !answers.age) {
        setError('Mohon lengkapi nama dan umur Anda.');
        return;
      }
      setError(null);
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setSelectedOption(null);
      setCurrentStep((s) => s + 1);
      return;
    }

    // Final submit
    setIsSubmitting(true);
    setError(null);

    const payload = {
      fullName: answers.fullName,
      age: parseInt(answers.age, 10),
      hasShortnessOfBreath: answers.hasShortnessOfBreath ?? false,
      hasChronicCough: answers.hasChronicCough ?? false,
      hasPreExistingCondition: answers.hasPreExistingCondition ?? false,
      hasSoreThroat: answers.hasSoreThroat ?? false,
      hasIrritatedEyes: answers.hasIrritatedEyes ?? false,
    };

    const result = await submitScreeningAction(payload);

    if (result.success && result.data) {
      router.push(`/screening/hasil?id=${result.data.id}`);
    } else {
      setError(result.error ?? 'Terjadi kesalahan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  }

  const progress = Math.round((currentStep / TOTAL_STEPS) * 100);
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const canProceed =
    currentStep === 0
      ? answers.fullName.trim().length >= 2 && parseInt(answers.age) > 0
      : selectedOption !== null;

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary">
            <Stethoscope className="h-3 w-3" />
            Screening Risiko ISPA
          </span>
          <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
            Cek Risiko Kesehatan Pernapasan Anda
          </h1>
          <p className="mt-2 text-muted-foreground">
            Jawab {QUESTIONS.length} pertanyaan singkat berikut untuk mengetahui tingkat risiko ISPA
            Anda.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Pertanyaan {Math.min(currentStep + 1, TOTAL_STEPS)} dari {TOTAL_STEPS}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          {currentStep === 0 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">
                Perkenalkan diri Anda terlebih dahulu
              </h2>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={answers.fullName}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Masukkan nama Anda"
                  className="w-full rounded-xl border border-input px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 bg-background text-foreground"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Umur</label>
                <input
                  type="number"
                  value={answers.age}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, age: e.target.value }))}
                  placeholder="Umur Anda dalam tahun"
                  min={1}
                  max={120}
                  className="w-full rounded-xl border border-input px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 bg-background text-foreground"
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="mb-6 text-base font-semibold text-foreground md:text-lg">
                {QUESTIONS[currentStep - 1]?.question}
              </h2>
              <div className="space-y-3">
                {QUESTIONS[currentStep - 1]?.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx, option.value)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
                      selectedOption === idx
                        ? 'border-primary bg-accent text-primary'
                        : 'border-border text-foreground hover:border-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span
                      className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                        selectedOption === idx ? 'border-primary bg-primary' : 'border-border'
                      }`}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                'Memproses...'
              ) : isLastStep ? (
                'Lihat Hasil'
              ) : (
                <>
                  Lanjut
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
