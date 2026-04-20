'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import AppShell from '@/components/AppShell';
import { mockSMEs, mockTickets } from '@/lib/mockData';
import { SMEStatusBadge } from '@/components/Badges';

// Dynamic import to avoid SSR issues with Leaflet
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/LeafletMap'), { ssr: false, loading: () => (
  <div className="flex items-center justify-center h-96 rounded-xl" style={{ background: 'var(--bg-card)' }}>
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Chargement de la carte...</p>
    </div>
  </div>
)});

export default function HeatmapPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  const hotspots = [
    { lat: 14.6928, lng: -17.4467, label: 'Dakar', tickets: 8 },
    { lat: 5.3600, lng: -4.0083, label: 'Abidjan', tickets: 6 },
    { lat: 12.3714, lng: -15.0000, label: 'Bissau', tickets: 3 },
  ];

  return (
    <AppShell title="Carte Thermique — Densité PME">
      <div className="space-y-5 animate-fade-in">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'PMEs cartographiées', value: mockSMEs.length, color: 'text-orange-500' },
            { label: 'Zones actives', value: 5, color: 'text-blue-500' },
            { label: 'Hotspots tickets', value: hotspots.length, color: 'text-red-500' },
            { label: 'PMEs à risque', value: mockSMEs.filter(s => s.status === 'At Risk').length, color: 'text-yellow-500' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Carte des PMEs — Afrique de l'Ouest</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cliquez sur un marqueur pour voir les détails</p>
            </div>
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-4">
              {[
                { color: '#22C55E', label: 'Active' },
                { color: '#EF4444', label: 'À risque' },
                { color: '#3B82F6', label: 'Onboarding' },
                { color: '#A855F7', label: 'Lead' },
                { color: 'rgba(239,68,68,0.3)', label: 'Hotspot' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 480 }}>
            <Map smes={mockSMEs} hotspots={hotspots} />
          </div>
        </div>

        {/* SME list by zone */}
        <div className="card p-6">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>PMEs par zone</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockSMEs.map(sme => (
              <div key={sme.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {sme.businessName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs truncate" style={{ color: 'var(--text-primary)' }}>{sme.businessName}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sme.zone} · {sme.sector}</p>
                </div>
                <SMEStatusBadge status={sme.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
