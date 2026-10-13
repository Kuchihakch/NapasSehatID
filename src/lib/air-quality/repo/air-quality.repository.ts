import type { DbClient } from '../../types/db';
import type { CreateAirQualityLogDTOType, AirQualityLogType } from '../dto/air-quality.dto';
import { translateDatabaseError } from '../../errors/database-error-translator';

export class AirQualityRepository {
  constructor(private readonly db: DbClient) {}

  async createLog(data: CreateAirQualityLogDTOType): Promise<AirQualityLogType> {
    try {
      const result = await this.db.airQualityLog.create({
        data: {
          hourBucket: new Date(data.hourBucket),
          usAqi: data.usAqi,
          pm25: data.pm25,
          pm10: data.pm10 ?? null,
          carbonMonoxide: data.carbonMonoxide ?? null,
          temperature: data.temperature ?? null,
          relativeHumidity: data.relativeHumidity ?? null,
          windSpeed: data.windSpeed ?? null,
          aqiCategory: data.aqiCategory,
        },
      });

      return {
        id: result.id,
        fetchedAt: result.fetchedAt.toISOString(),
        hourBucket: result.hourBucket.toISOString(),
        usAqi: result.usAqi,
        pm25: result.pm25,
        pm10: result.pm10 ?? null,
        carbonMonoxide: result.carbonMonoxide ?? null,
        temperature: result.temperature ?? null,
        relativeHumidity: result.relativeHumidity ?? null,
        windSpeed: result.windSpeed ?? null,
        aqiCategory: result.aqiCategory as AirQualityLogType['aqiCategory'],
      };
    } catch (error: unknown) {
      throw translateDatabaseError(error);
    }
  }

  async findLatest(): Promise<AirQualityLogType | null> {
    try {
      const result = await this.db.airQualityLog.findFirst({
        orderBy: { fetchedAt: 'desc' },
      });

      if (!result) return null;

      return {
        id: result.id,
        fetchedAt: result.fetchedAt.toISOString(),
        hourBucket: result.hourBucket.toISOString(),
        usAqi: result.usAqi,
        pm25: result.pm25,
        pm10: result.pm10 ?? null,
        carbonMonoxide: result.carbonMonoxide ?? null,
        temperature: result.temperature ?? null,
        relativeHumidity: result.relativeHumidity ?? null,
        windSpeed: result.windSpeed ?? null,
        aqiCategory: result.aqiCategory as AirQualityLogType['aqiCategory'],
      };
    } catch (error: unknown) {
      throw translateDatabaseError(error);
    }
  }

  async findRecentLogs(limit = 24): Promise<AirQualityLogType[]> {
    try {
      const results = await this.db.airQualityLog.findMany({
        orderBy: { fetchedAt: 'desc' },
        take: limit,
      });

      return results.map((r) => ({
        id: r.id,
        fetchedAt: r.fetchedAt.toISOString(),
        hourBucket: r.hourBucket.toISOString(),
        usAqi: r.usAqi,
        pm25: r.pm25,
        pm10: r.pm10 ?? null,
        carbonMonoxide: r.carbonMonoxide ?? null,
        temperature: r.temperature ?? null,
        relativeHumidity: r.relativeHumidity ?? null,
        windSpeed: r.windSpeed ?? null,
        aqiCategory: r.aqiCategory as AirQualityLogType['aqiCategory'],
      }));
    } catch (error: unknown) {
      throw translateDatabaseError(error);
    }
  }
}
