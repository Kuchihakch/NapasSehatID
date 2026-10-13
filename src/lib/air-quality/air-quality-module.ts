import { prisma } from '../../../prisma/global-prisma';
import { AirQualityRepository } from './repo/air-quality.repository';
import { AirQualityService } from './services/air-quality.service';

export function CreateAirQualityModule(): AirQualityService {
  const repo = new AirQualityRepository(prisma);
  const service = new AirQualityService(repo);
  return service;
}
