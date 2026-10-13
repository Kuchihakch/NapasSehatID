import { notFound } from 'next/navigation';
import ScreeningResult from './components/screening-result';

export const dynamic = 'force-dynamic';

interface HasilPageProps {
  searchParams: Promise<{ id?: string }>;
}

export const metadata = {
  title: 'Hasil Screening — NapasSehat Palembang',
};

export default async function HasilPage({ searchParams }: HasilPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const { CreateScreeningModule } = await import('@/lib/screening/screening-module');
  const service = CreateScreeningModule();
  const result = await service.getScreeningById(id);

  if (!result) {
    notFound();
  }

  return <ScreeningResult result={result} />;
}
