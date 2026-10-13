import ScreeningWizard from './components/screening-wizard';

export const metadata = {
  title: 'Screening Risiko ISPA — NapasSehat Palembang',
  description: 'Jawab 5 pertanyaan singkat untuk mengetahui tingkat risiko ISPA Anda.',
};

export default function ScreeningPage() {
  return <ScreeningWizard />;
}
