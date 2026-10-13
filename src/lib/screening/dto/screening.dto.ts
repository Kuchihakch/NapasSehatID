import { z } from 'zod';

// ── Risk Level ────────────────────────────────────────────────────────────────
export const RiskLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export type RiskLevel = z.infer<typeof RiskLevelEnum>;

// ── Core Schema ───────────────────────────────────────────────────────────────
export const ScreeningCoreSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2, { message: 'Nama minimal 2 karakter' }),
  age: z.number().int().positive({ message: 'Umur harus bilangan positif' }),
  hasShortnessOfBreath: z.boolean(),
  hasChronicCough: z.boolean(),
  hasPreExistingCondition: z.boolean(),
  hasSoreThroat: z.boolean(),
  hasIrritatedEyes: z.boolean(),
  calculatedScore: z.number().int().min(0).max(100),
  riskLevel: RiskLevelEnum,
  recommendations: z.string(), // stored as JSON string
  createdAt: z.string(),
});

// ── Input DTO (what the wizard form submits) ──────────────────────────────────
export const CreateScreeningDTO = ScreeningCoreSchema.omit({
  id: true,
  calculatedScore: true,
  riskLevel: true,
  recommendations: true,
  createdAt: true,
});

// ── Questionnaire step types ──────────────────────────────────────────────────
export const ScreeningAnswerSchema = z.object({
  hasShortnessOfBreath: z.boolean(),
  hasChronicCough: z.boolean(),
  hasPreExistingCondition: z.boolean(),
  hasSoreThroat: z.boolean(),
  hasIrritatedEyes: z.boolean(),
});

// ── Response type (what the server returns) ───────────────────────────────────
export const ScreeningResponseSchema = ScreeningCoreSchema.extend({
  recommendationList: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
});

// ── TypeScript types ──────────────────────────────────────────────────────────
export type ScreeningCoreType = z.infer<typeof ScreeningCoreSchema>;
export type CreateScreeningDTOType = z.infer<typeof CreateScreeningDTO>;
export type ScreeningAnswerType = z.infer<typeof ScreeningAnswerSchema>;
export type ScreeningResponseType = z.infer<typeof ScreeningResponseSchema>;

export interface RecommendationItem {
  title: string;
  description: string;
}
