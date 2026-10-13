import type { DbClient } from '../../types/db';
import type { ScreeningCoreType } from '../dto/screening.dto';
import { translateDatabaseError } from '../../errors/database-error-translator';

interface CreateScreeningPayload {
  fullName: string;
  age: number;
  hasShortnessOfBreath: boolean;
  hasChronicCough: boolean;
  hasPreExistingCondition: boolean;
  hasSoreThroat: boolean;
  hasIrritatedEyes: boolean;
  calculatedScore: number;
  riskLevel: string;
  recommendations: string;
}

export class ScreeningRepository {
  constructor(private readonly db: DbClient) {}

  async create(payload: CreateScreeningPayload): Promise<ScreeningCoreType> {
    try {
      const result = await this.db.screeningAssessment.create({
        data: {
          fullName: payload.fullName,
          age: payload.age,
          hasShortnessOfBreath: payload.hasShortnessOfBreath,
          hasChronicCough: payload.hasChronicCough,
          hasPreExistingCondition: payload.hasPreExistingCondition,
          hasSoreThroat: payload.hasSoreThroat,
          hasIrritatedEyes: payload.hasIrritatedEyes,
          calculatedScore: payload.calculatedScore,
          riskLevel: payload.riskLevel,
          recommendations: payload.recommendations,
        },
      });

      return {
        id: result.id,
        fullName: result.fullName,
        age: result.age,
        hasShortnessOfBreath: result.hasShortnessOfBreath,
        hasChronicCough: result.hasChronicCough,
        hasPreExistingCondition: result.hasPreExistingCondition,
        hasSoreThroat: result.hasSoreThroat,
        hasIrritatedEyes: result.hasIrritatedEyes,
        calculatedScore: result.calculatedScore,
        riskLevel: result.riskLevel as ScreeningCoreType['riskLevel'],
        recommendations: result.recommendations,
        createdAt: result.createdAt.toISOString(),
      };
    } catch (error: unknown) {
      throw translateDatabaseError(error);
    }
  }

  async findById(id: string): Promise<ScreeningCoreType | null> {
    try {
      const result = await this.db.screeningAssessment.findUnique({
        where: { id },
      });

      if (!result) return null;

      return {
        id: result.id,
        fullName: result.fullName,
        age: result.age,
        hasShortnessOfBreath: result.hasShortnessOfBreath,
        hasChronicCough: result.hasChronicCough,
        hasPreExistingCondition: result.hasPreExistingCondition,
        hasSoreThroat: result.hasSoreThroat,
        hasIrritatedEyes: result.hasIrritatedEyes,
        calculatedScore: result.calculatedScore,
        riskLevel: result.riskLevel as ScreeningCoreType['riskLevel'],
        recommendations: result.recommendations,
        createdAt: result.createdAt.toISOString(),
      };
    } catch (error: unknown) {
      throw translateDatabaseError(error);
    }
  }
}
