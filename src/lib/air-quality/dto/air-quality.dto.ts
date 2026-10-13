import { z } from 'zod';

// ── AQI Category ──────────────────────────────────────────────────────────────
export const AqiCategoryEnum = z.enum([
  'GOOD',
  'MODERATE',
  'UNHEALTHY_SENSITIVE',
  'UNHEALTHY',
  'VERY_UNHEALTHY',
  'HAZARDOUS',
]);
export type AqiCategory = z.infer<typeof AqiCategoryEnum>;

// ── Core Schema ───────────────────────────────────────────────────────────────
export const AirQualityLogSchema = z.object({
  id: z.string(),
  fetchedAt: z.string(),
  hourBucket: z.string(),
  usAqi: z.number().int().nonnegative(),
  pm25: z.number().nonnegative(),
  pm10: z.number().nonnegative().nullable(),
  carbonMonoxide: z.number().nullable(),
  temperature: z.number().nullable(),
  relativeHumidity: z.number().nonnegative().nullable(),
  windSpeed: z.number().nonnegative().nullable(),
  aqiCategory: AqiCategoryEnum,
});

// ── DTOs ──────────────────────────────────────────────────────────────────────
export const CreateAirQualityLogDTO = AirQualityLogSchema.omit({
  id: true,
  fetchedAt: true,
});

export const AirQualityCurrentResponseSchema = z.object({
  usAqi: z.number().int().nonnegative(),
  pm25: z.number().nonnegative(),
  pm10: z.number().nonnegative().nullable(),
  temperature: z.number().nullable(),
  relativeHumidity: z.number().nonnegative().nullable(),
  windSpeed: z.number().nonnegative().nullable(),
  aqiCategory: AqiCategoryEnum,
  aqiLabel: z.string(),
  updatedAt: z.string(),
});

// ── Types ─────────────────────────────────────────────────────────────────────
export type AirQualityLogType = z.infer<typeof AirQualityLogSchema>;
export type CreateAirQualityLogDTOType = z.infer<typeof CreateAirQualityLogDTO>;
export type AirQualityCurrentResponseType = z.infer<typeof AirQualityCurrentResponseSchema>;
