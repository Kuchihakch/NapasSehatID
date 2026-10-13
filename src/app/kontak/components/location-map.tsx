'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

export default function LocationMap() {
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        // Gracefully ignore permission denial
      },
    );
  }, []);

  return (
    <div className="relative h-80 overflow-hidden rounded-2xl border border-border bg-secondary md:h-full md:min-h-[400px]">
      {/* Stylised static map representation */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-teal-100">
        {/* Grid lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          viewBox="0 0 400 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[50, 100, 150, 200, 250, 300, 350].map((v) => (
            <g key={v}>
              <line x1={v} y1="0" x2={v} y2="400" stroke="#666" strokeWidth="0.5" />
              <line x1="0" y1={v} x2="400" y2={v} stroke="#666" strokeWidth="0.5" />
            </g>
          ))}
        </svg>

        {/* Palembang marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="mt-2 rounded-lg bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow">
              Palembang, Sumatera Selatan
            </div>
          </div>
        </div>
      </div>

      {/* User location badge */}
      {userCoords && (
        <div className="absolute bottom-4 left-4 rounded-xl bg-card px-3 py-2 shadow-md">
          <p className="text-[10px] font-medium text-muted-foreground">Lokasi Anda Saat Ini</p>
          <p className="text-xs font-semibold text-foreground">
            {userCoords.lat.toFixed(4)}° {userCoords.lat < 0 ? 'S' : 'N'},{' '}
            {userCoords.lon.toFixed(4)}° {userCoords.lon > 0 ? 'E' : 'W'}
          </p>
        </div>
      )}
    </div>
  );
}
