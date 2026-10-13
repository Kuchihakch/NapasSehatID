import type { AirQualityRepository } from '../repo/air-quality.repository';
import type {
  AirQualityCurrentResponseType,
  AirQualityLogType,
  AqiCategory,
} from '../dto/air-quality.dto';
import { CreateAirQualityLogDTO } from '../dto/air-quality.dto';

// ── Palembang coordinates ────────────────────────────────────────────────────
const PALEMBANG_LAT = -2.9909;
const PALEMBANG_LON = 104.7566;

// ── AQI helpers ───────────────────────────────────────────────────────────────
function resolveAqiCategory(usAqi: number): AqiCategory {
  if (usAqi <= 50) return 'GOOD';
  if (usAqi <= 100) return 'MODERATE';
  if (usAqi <= 150) return 'UNHEALTHY_SENSITIVE';
  if (usAqi <= 200) return 'UNHEALTHY';
  if (usAqi <= 300) return 'VERY_UNHEALTHY';
  return 'HAZARDOUS';
}

export function resolveAqiLabel(category: AqiCategory): string {
  const labels: Record<AqiCategory, string> = {
    GOOD: 'Baik',
    MODERATE: 'Sedang',
    UNHEALTHY_SENSITIVE: 'Tidak Sehat (Sensitif)',
    UNHEALTHY: 'Tidak Sehat',
    VERY_UNHEALTHY: 'Sangat Tidak Sehat',
    HAZARDOUS: 'Berbahaya',
  };
  return labels[category];
}

// ── Open-Meteo API response types ─────────────────────────────────────────────
interface OpenMeteoAirQualityResponse {
  current: {
    us_aqi: number;
    pm2_5: number;
    pm10: number;
    carbon_monoxide: number;
    wind_speed_10m: number;
  };
}

interface OpenMeteoWeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
  };
}

async function fetchAirQualityFromApi(): Promise<OpenMeteoAirQualityResponse> {
  const baseUrl =
    process.env['OPEN_METEO_BASE_URL'] ?? 'https://air-quality-api.open-meteo.com/v1';

  const params = new URLSearchParams({
    latitude: String(PALEMBANG_LAT),
    longitude: String(PALEMBANG_LON),
    current: 'us_aqi,pm2_5,pm10,carbon_monoxide,wind_speed_10m',
  });

  const response = await fetch(`${baseUrl}/air-quality?${params.toString()}`, {
    next: { revalidate: 600 }, // cache for 10 minutes
  });

  if (!response.ok) {
    throw new Error(
      `Open-Meteo air quality API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<OpenMeteoAirQualityResponse>;
}

async function fetchWeatherFromApi(): Promise<OpenMeteoWeatherResponse> {
  const baseUrl =
    process.env['OPEN_METEO_WEATHER_URL'] ?? 'https://api.open-meteo.com/v1';

  const params = new URLSearchParams({
    latitude: String(PALEMBANG_LAT),
    longitude: String(PALEMBANG_LON),
    current: 'temperature_2m,relative_humidity_2m',
  });

  const response = await fetch(`${baseUrl}/forecast?${params.toString()}`, {
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    throw new Error(
      `Open-Meteo weather API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<OpenMeteoWeatherResponse>;
}

// ── Service ───────────────────────────────────────────────────────────────────
export class AirQualityService {
  constructor(private readonly repo: AirQualityRepository) {}

  /**
   * Fetches current air quality from Open-Meteo, persists a log entry, and
   * returns a formatted response ready for the UI.
   */
  async getCurrentAirQuality(): Promise<AirQualityCurrentResponseType> {
    try {
      const [aqData, weatherData] = await Promise.all([
        fetchAirQualityFromApi(),
        fetchWeatherFromApi(),
      ]);

      const usAqi = aqData.current.us_aqi;
      const pm25 = aqData.current.pm2_5;
      const pm10 = aqData.current.pm10;
      const carbonMonoxide = aqData.current.carbon_monoxide;
      const windSpeed = aqData.current.wind_speed_10m;
      const temperature = weatherData.current.temperature_2m;
      const relativeHumidity = weatherData.current.relative_humidity_2m;

      const aqiCategory = resolveAqiCategory(usAqi);
      const now = new Date();
      const hourBucket = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
      ).toISOString();

      const dto = CreateAirQualityLogDTO.parse({
        hourBucket,
        usAqi,
        pm25,
        pm10,
        carbonMonoxide,
        temperature,
        relativeHumidity,
        windSpeed,
        aqiCategory,
      });

      // Fire-and-forget — we don't block the response on DB write
      void this.repo.createLog(dto).catch((err: unknown) => {
        if (err instanceof Error) {
          console.error('[AirQualityService] Failed to persist log:', err.message);
        }
      });

      return {
        usAqi,
        pm25,
        pm10,
        temperature,
        relativeHumidity,
        windSpeed,
        aqiCategory,
        aqiLabel: resolveAqiLabel(aqiCategory),
        updatedAt: now.toISOString(),
      };
    } catch (error: unknown) {
      // If the API call fails, try the cached DB entry
      const cached = await this.repo.findLatest();
      if (cached) {
        return {
          usAqi: cached.usAqi,
          pm25: cached.pm25,
          pm10: cached.pm10,
          temperature: cached.temperature,
          relativeHumidity: cached.relativeHumidity,
          windSpeed: cached.windSpeed,
          aqiCategory: cached.aqiCategory,
          aqiLabel: resolveAqiLabel(cached.aqiCategory),
          updatedAt: cached.fetchedAt,
        };
      }

      throw error;
    }
  }

  async getRecentLogs(limit: number = 24): Promise<AirQualityLogType[]> {
    return this.repo.findRecentLogs(limit);
  }
}
