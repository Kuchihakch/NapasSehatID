/**
 * Database Error Translator
 *
 * Maps Prisma v7 known request errors and raw PostgreSQL driver error codes
 * into friendly, client-facing Bahasa Indonesia messages.
 */

import { Prisma } from '@prisma/client';

export class DatabaseError extends Error {
  public readonly code: string;
  public readonly clientMessage: string;

  constructor(code: string, clientMessage: string, cause?: unknown) {
    super(clientMessage);
    this.name = 'DatabaseError';
    this.code = code;
    this.clientMessage = clientMessage;
    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}

interface PgDriverError {
  code?: string;
  message?: string;
}

function isPgDriverError(err: unknown): err is PgDriverError {
  return typeof err === 'object' && err !== null && 'code' in err;
}

const PRISMA_CODE_MESSAGES: Record<string, string> = {
  // Unique constraint violation
  P2002: 'Data yang Anda masukkan sudah terdaftar (duplikat).',
  // Record not found
  P2001: 'Data yang dicari tidak ditemukan.',
  P2025: 'Data yang dicari tidak ditemukan.',
  // Foreign key constraint violation
  P2003: 'Referensi data tidak ditemukan. Pastikan data terkait sudah ada.',
  // Null constraint violation
  P2011: 'Ada kolom wajib yang tidak diisi. Mohon lengkapi data Anda.',
  // Value out of range
  P2006: 'Nilai yang dimasukkan tidak valid untuk tipe datanya.',
};

const PG_CODE_MESSAGES: Record<string, string> = {
  // unique_violation
  '23505': 'Data yang Anda masukkan sudah terdaftar (duplikat).',
  // foreign_key_violation
  '23503': 'Referensi data tidak ditemukan. Pastikan data terkait sudah ada.',
  // not_null_violation
  '23502': 'Ada kolom wajib yang tidak diisi. Mohon lengkapi data Anda.',
  // check_violation
  '23514': 'Nilai yang dimasukkan tidak memenuhi aturan validasi database.',
  // connection errors
  '08000': 'Koneksi database gagal. Silakan coba lagi beberapa saat.',
  '08003': 'Koneksi database gagal. Silakan coba lagi beberapa saat.',
  '08006': 'Koneksi database gagal. Silakan coba lagi beberapa saat.',
};

/**
 * Translates a raw Prisma or pg driver error into a `DatabaseError` with a
 * human-friendly Bahasa Indonesia message.
 */
export function translateDatabaseError(error: unknown): DatabaseError {
  if (error instanceof DatabaseError) return error;

  // Standard Prisma v7 known request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const msg =
      PRISMA_CODE_MESSAGES[error.code] ??
      `Terjadi kesalahan database (kode: ${error.code}). Hubungi administrator.`;
    return new DatabaseError(error.code, msg, error);
  }

  // Raw pg driver errors (code property on the error object)
  if (isPgDriverError(error)) {
    const code = error.code ?? 'UNKNOWN';
    const msg =
      PG_CODE_MESSAGES[code] ??
      `Terjadi kesalahan database (kode: ${code}). Hubungi administrator.`;
    return new DatabaseError(code, msg, error);
  }

  if (error instanceof Error) {
    return new DatabaseError('UNKNOWN', 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.', error);
  }

  return new DatabaseError('UNKNOWN', 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.');
}
