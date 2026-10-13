import HeroSection from './components/hero-section';
import FeatureGrid from './components/feature-grid';
import AccordionGoals from './components/accordion-goals';
import CtaBanner from './components/cta-banner';
import type { AirQualityCurrentResponseType } from '@/lib/air-quality/dto/air-quality.dto';

export const dynamic = 'force-dynamic';

async function getAirQuality(): Promise<AirQualityCurrentResponseType | null> {
  try {
    const { CreateAirQualityModule } = await import('@/lib/air-quality/air-quality-module');
    const service = CreateAirQualityModule();
    return await service.getCurrentAirQuality();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[HomePage] Failed to fetch air quality:', error.message);
    }
    return null;
  }
}

export default async function HomePage() {
  const airQuality = await getAirQuality();

  return (
    <>
      <HeroSection airQuality={airQuality} />
      <FeatureGrid />
      <AccordionGoals />
      <CtaBanner />
    </>
  );
}
