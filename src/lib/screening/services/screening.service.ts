import type { ScreeningRepository } from '../repo/screening.repository';
import type {
  CreateScreeningDTOType,
  RecommendationItem,
  RiskLevel,
  ScreeningResponseType,
} from '../dto/screening.dto';
import { CreateScreeningDTO } from '../dto/screening.dto';

// ── 100-point scoring matrix ──────────────────────────────────────────────────
// Each symptom carries a weight. The total is normalised out of 100.

interface SymptomWeights {
  hasShortnessOfBreath: number;
  hasChronicCough: number;
  hasPreExistingCondition: number;
  hasSoreThroat: number;
  hasIrritatedEyes: number;
}

const SYMPTOM_WEIGHTS: SymptomWeights = {
  hasShortnessOfBreath: 30,  // severe respiratory indicator
  hasChronicCough: 25,       // strong ISPA indicator
  hasPreExistingCondition: 25, // comorbidity multiplier
  hasSoreThroat: 10,         // mild upper-respiratory
  hasIrritatedEyes: 10,      // air-quality exposure marker
};

function calculateScore(dto: CreateScreeningDTOType): number {
  let raw = 0;
  if (dto.hasShortnessOfBreath) raw += SYMPTOM_WEIGHTS.hasShortnessOfBreath;
  if (dto.hasChronicCough) raw += SYMPTOM_WEIGHTS.hasChronicCough;
  if (dto.hasPreExistingCondition) raw += SYMPTOM_WEIGHTS.hasPreExistingCondition;
  if (dto.hasSoreThroat) raw += SYMPTOM_WEIGHTS.hasSoreThroat;
  if (dto.hasIrritatedEyes) raw += SYMPTOM_WEIGHTS.hasIrritatedEyes;
  return raw; // max 100
}

function resolveRiskLevel(score: number): RiskLevel {
  if (score <= 20) return 'LOW';
  if (score <= 55) return 'MEDIUM';
  return 'HIGH';
}

// ── Recommendation matrix ─────────────────────────────────────────────────────
function generateRecommendations(
  riskLevel: RiskLevel,
  dto: CreateScreeningDTOType,
): RecommendationItem[] {
  const base: RecommendationItem[] = [];

  if (riskLevel === 'LOW') {
    base.push({
      title: 'Jaga Kebersihan Udara Dalam Ruangan',
      description:
        'Gunakan ventilasi yang baik dan hindari asap rokok di dalam ruangan untuk mempertahankan kualitas udara.',
    });
    base.push({
      title: 'Pantau Kualitas Udara Kota',
      description:
        'Cek indeks udara harian sebelum beraktivitas di luar untuk menjaga kondisi paru-paru Anda.',
    });
  }

  if (riskLevel === 'MEDIUM') {
    base.push({
      title: 'Gunakan Masker di Luar Ruangan',
      description:
        'Kenakan masker standar medis saat beraktivitas di luar, terutama saat kualitas udara sedang–buruk.',
    });
    base.push({
      title: 'Pantau Perkembangan Gejala',
      description:
        'Catat frekuensi batuk, sesak napas, atau demam selama beberapa hari ke depan.',
    });
    base.push({
      title: 'Kurangi Paparan Luar Ruang',
      description:
        'Batasi aktivitas outdoor saat AQI berada pada level sedang hingga tidak sehat.',
    });
    base.push({
      title: 'Konsultasi Jika Gejala Berlanjut',
      description:
        'Jika gejala tidak membaik dalam 3–5 hari, segera periksakan diri ke fasilitas kesehatan terdekat.',
    });
  }

  if (riskLevel === 'HIGH') {
    base.push({
      title: 'Segera Konsultasi ke Dokter',
      description:
        'Tingkat risiko Anda tinggi. Segera periksakan diri ke klinik atau puskesmas terdekat.',
    });
    base.push({
      title: 'Hindari Aktivitas Luar Ruangan',
      description:
        'Tetap di dalam ruangan dengan ventilasi terbatas dan gunakan filter udara bila tersedia.',
    });
    base.push({
      title: 'Gunakan Masker N95/KN95',
      description:
        'Jika harus keluar, selalu kenakan masker N95 atau KN95 untuk melindungi saluran napas.',
    });
  }

  // Condition-specific additions
  if (dto.hasPreExistingCondition) {
    base.push({
      title: 'Perhatikan Kondisi Penyakit Penyerta',
      description:
        'Konsultasikan dengan dokter Anda mengenai penyesuaian dosis obat atau tindakan pencegahan ekstra.',
    });
  }

  if (dto.hasIrritatedEyes) {
    base.push({
      title: 'Lindungi Mata dari Polutan',
      description:
        'Gunakan kacamata pelindung di luar dan bilas mata dengan air bersih jika terasa perih.',
    });
  }

  return base;
}

// ── Service ───────────────────────────────────────────────────────────────────
export class ScreeningService {
  constructor(private readonly repo: ScreeningRepository) {}

  async submitScreening(input: unknown): Promise<ScreeningResponseType> {
    // Validate input with Zod
    const dto = CreateScreeningDTO.parse(input);

    const score = calculateScore(dto);
    const riskLevel = resolveRiskLevel(score);
    const recommendationList = generateRecommendations(riskLevel, dto);
    const recommendations = JSON.stringify(recommendationList);

    const saved = await this.repo.create({
      ...dto,
      calculatedScore: score,
      riskLevel,
      recommendations,
    });

    return {
      ...saved,
      recommendationList,
    };
  }

  async getScreeningById(id: string): Promise<ScreeningResponseType | null> {
    const record = await this.repo.findById(id);
    if (!record) return null;

    let recommendationList: RecommendationItem[] = [];
    try {
      recommendationList = JSON.parse(record.recommendations) as RecommendationItem[];
    } catch {
      recommendationList = [];
    }

    return {
      ...record,
      recommendationList,
    };
  }
}
