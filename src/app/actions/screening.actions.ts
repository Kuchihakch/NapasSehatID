'use server';

import { CreateScreeningModule } from '@/lib/screening/screening-module';
import { DatabaseError } from '@/lib/errors/database-error-translator';
import type { ScreeningResponseType } from '@/lib/screening/dto/screening.dto';
import { z } from 'zod';

interface ActionResult {
  success: boolean;
  data?: ScreeningResponseType;
  error?: string;
}

export async function submitScreeningAction(
  formData: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    const service = CreateScreeningModule();
    const result = await service.submitScreening(formData);
    return { success: true, data: result };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false,
        error: firstIssue?.message ?? 'Data tidak valid. Periksa kembali isian Anda.',
      };
    }
    if (error instanceof DatabaseError) {
      return { success: false, error: error.clientMessage };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}
