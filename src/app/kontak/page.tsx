import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from './components/contact-form';
import LocationMap from './components/location-map';

export const metadata = {
  title: 'Kontak — NapasSehat Palembang',
  description: 'Hubungi tim NapasSehat Palembang untuk pertanyaan dan masukan.',
};

const contactDetails = [
  {
    label: 'ALAMAT',
    value: 'Jl. Jenderal Sudirman, Ilir Barat I, Palembang, Sumatera Selatan',
    Icon: MapPin,
  },
  {
    label: 'TELEPON',
    value: '(0711) 123-456',
    Icon: Phone,
  },
  {
    label: 'EMAIL',
    value: 'halo@napassehat.id',
    Icon: Mail,
  },
  {
    label: 'JAM OPERASIONAL',
    value: 'Senin – Jumat, 08.00 – 17.00 WIB',
    Icon: Clock,
  },
];

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            Kontak
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">Hubungi Kami</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Ada pertanyaan tentang kualitas udara atau layanan screening kami? Tim NapasSehat siap
            membantu Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            {/* Contact details */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-5 font-semibold text-card-foreground">Informasi Kontak</h3>
              <div className="space-y-4">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                      <detail.Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {detail.label}
                      </p>
                      <p className="text-sm text-foreground">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <ContactForm />
          </div>

          {/* Right column – Map */}
          <LocationMap />
        </div>
      </div>
    </div>
  );
}
