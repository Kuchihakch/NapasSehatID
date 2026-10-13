'use client';

import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

export default function ContactForm() {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    // Simulated send — in production wire up an email API
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));
    setStatus('sent');
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-5 font-semibold text-card-foreground">Kirim Pesan</h3>
      {status === 'sent' ? (
        <div className="rounded-xl bg-accent py-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-3 font-semibold text-foreground">Pesan terkirim!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Kami akan menghubungi Anda segera melalui email.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="fullName"
              value={formState.fullName}
              onChange={handleChange}
              placeholder="Masukkan nama Anda"
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Pesan</label>
            <textarea
              name="message"
              value={formState.message}
              onChange={handleChange}
              placeholder="Tuliskan pertanyaan atau masukan Anda..."
              rows={5}
              required
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {status === 'sending' ? 'Mengirim...' : 'Kirim Pesan'}
            {status === 'idle' && <Send className="h-4 w-4" />}
          </button>
        </form>
      )}
    </div>
  );
}
