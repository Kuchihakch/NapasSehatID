import { prisma } from '../../../prisma/global-prisma';
import { ScreeningRepository } from './repo/screening.repository';
import { ScreeningService } from './services/screening.service';

export function CreateScreeningModule(): ScreeningService {
  const repo = new ScreeningRepository(prisma);
  const service = new ScreeningService(repo);
  return service;
}
