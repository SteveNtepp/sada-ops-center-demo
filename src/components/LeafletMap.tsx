'use client';
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SME } from '@/lib/types';
import { formatFCFA } from '@/lib/mockData';
import Link from 'next/link';

interface LeafletMapProps {
  smes: SME[];
  hotspots: { lat: number; lng: number; label: string; tickets: number }[];
}

const statusColor: Record<string, string> = {
  Active: '#22C55E',
  'At Risk': '#EF4444',
  Onboarding: '#3B82F6',
  Lead: '#A855F7',
};

export default function LeafletMap({ smes, hotspots }: LeafletMapProps) {
  return (
    <MapContainer
      center={[10.0, -5.0]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Hotspot circles */}
      {hotspots.map((h, i) => (
        <Circle
          key={i}
          center={[h.lat, h.lng]}
          radius={80000}
          pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.12, weight: 1.5 }}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, padding: 4 }}>
              <strong>🔥 Hotspot : {h.label}</strong>
              <br />{h.tickets} tickets signalés
            </div>
          </Popup>
        </Circle>
      ))}

      {/* SME markers */}
      {smes.map(sme => (
        <CircleMarker
          key={sme.id}
          center={[sme.gpsLocation.lat, sme.gpsLocation.lng]}
          radius={10}
          pathOptions={{
            color: statusColor[sme.status] || '#94A3B8',
            fillColor: statusColor[sme.status] || '#94A3B8',
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, minWidth: 180 }}>
              <strong style={{ color: '#F97316' }}>{sme.businessName}</strong>
              <div style={{ marginTop: 6, lineHeight: 1.8 }}>
                <span>📊 Score IA : <strong>{sme.iaHealthScore}</strong></span><br />
                <span>💰 MRR : <strong>{formatFCFA(sme.revenue_mrr)}</strong></span><br />
                <span>📍 {sme.zone} · {sme.sector}</span><br />
                <span>🔖 {sme.status}</span>
              </div>
              <a href={`/crm/${sme.id}`} style={{ color: '#2563EB', fontWeight: 600, marginTop: 8, display: 'block' }}>
                Voir le profil →
              </a>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
