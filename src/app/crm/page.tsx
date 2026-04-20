'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import AppShell from '@/components/AppShell';
import { SMEStatusBadge, KYCBadge, HealthScore } from '@/components/Badges';
import { mockSMEs, formatFCFA, mockUsers } from '@/lib/mockData';
import { SMEStatus, User } from '@/lib/types';
import { Search, MapPin, Phone, Plus, X } from 'lucide-react';

const sectors = ['Tous', ...Array.from(new Set(mockSMEs.map(s => s.sector)))];
const statuses: (SMEStatus | 'Tous')[] = ['Tous', 'Active', 'At Risk', 'Onboarding', 'Lead'];

export default function CRMPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('Tous');
  const [status, setStatus] = useState<SMEStatus | 'Tous'>('Tous');
  const [isCreating, setIsCreating] = useState(false);
  const [newSme, setNewSme] = useState({ businessName: '', sector: 'Général', phone: '', zone: '', assignedSalesId: '' });

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  const filtered = mockSMEs.filter(sme => {
    const matchSearch = search === '' ||
      sme.businessName.toLowerCase().includes(search.toLowerCase()) ||
      sme.contactName.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === 'Tous' || sme.sector === sector;
    const matchStatus = status === 'Tous' || sme.status === status;
    return matchSearch && matchSector && matchStatus;
  });

  const totalMRR = filtered.reduce((sum, s) => sum + s.revenue_mrr, 0);

  return (
    <AppShell title="CRM Terrain — Gestion PME">
      <div className="space-y-5 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['Active', 'At Risk', 'Onboarding', 'Lead'] as SMEStatus[]).map(s => {
            const count = mockSMEs.filter(x => x.status === s).length;
            const color = s === 'Active' ? 'text-green-500' : s === 'At Risk' ? 'text-red-500' : s === 'Onboarding' ? 'text-blue-500' : 'text-purple-500';
            return (
              <div key={s} className="card p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatus(s === status ? 'Tous' : s)}>
                <p className={`text-2xl font-bold ${color}`}>{count}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une PME ou contact..." className="input w-full pl-9" />
            </div>
            <select value={sector} onChange={e => setSector(e.target.value)} className="input">
              {sectors.map(s => <option key={s} value={s}>{s === 'Tous' ? 'Tous secteurs' : s}</option>)}
            </select>
            <select value={status} onChange={e => setStatus(e.target.value as SMEStatus | 'Tous')} className="input">
              {statuses.map(s => <option key={s} value={s}>{s === 'Tous' ? 'Tous statuts' : s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> PME(s) · MRR filtré : <strong style={{ color: 'var(--text-primary)' }}>{formatFCFA(totalMRR)}</strong>
          </p>
          {['Sales', 'Manager', 'CEO'].includes(user.role) && (
            <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
              <Plus size={16} /> Nouvelle PME
            </button>
          )}
        </div>

        {/* Modal Création PME */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card w-full max-w-md p-6 relative">
              <button 
                onClick={() => setIsCreating(false)} 
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold mb-4">Créer une PME</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium mb-1 block">Nom de l'entreprise</label>
                  <input className="input w-full" value={newSme.businessName} onChange={e => setNewSme({ ...newSme, businessName: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Secteur</label>
                  <select className="input w-full" value={newSme.sector} onChange={e => setNewSme({ ...newSme, sector: e.target.value })}>
                    <option value="Général">-- Choisir un secteur --</option>
                    {sectors.filter(s => s !== 'Tous').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    {!sectors.includes('Général') && <option value="Général">Général</option>}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Téléphone</label>
                  <input className="input w-full" value={newSme.phone} onChange={e => setNewSme({ ...newSme, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Pays</label>
                  <input className="input w-full" placeholder="Ex: Sénégal, Côte d'Ivoire..." value={newSme.zone} onChange={e => setNewSme({ ...newSme, zone: e.target.value })} />
                </div>
                {(user.role === 'Manager' || user.role === 'CEO') && (
                  <div>
                    <label className="text-xs font-medium mb-1 block">Assigner à (Agent Terrain)</label>
                    <select className="input w-full" value={newSme.assignedSalesId} onChange={e => setNewSme({ ...newSme, assignedSalesId: e.target.value })}>
                      <option value="">-- Sélectionner un agent --</option>
                      {mockUsers.filter(u => u.role === 'Sales').map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.zone})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="pt-2">
                  <button className="btn btn-primary w-full justify-center" onClick={() => {
                    alert('PME Créée ' + (user.role === 'Sales' ? '(auto-assignée à vous)' : ''));
                    setIsCreating(false);
                  }}>
                    Enregistrer la PME
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SME Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(sme => (
            <Link key={sme.id} href={`/crm/${sme.id}`}>
              <div className="card p-5 h-full cursor-pointer animate-fade-in group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {sme.businessName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-orange-500 transition-colors" style={{ color: 'var(--text-primary)' }}>{sme.businessName}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sme.sector}</p>
                    </div>
                  </div>
                  <SMEStatusBadge status={sme.status} />
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Score IA</span>
                    <div className="w-32"><HealthScore score={sme.iaHealthScore} /></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>MRR</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatFCFA(sme.revenue_mrr)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>KYC</span>
                    <KYCBadge status={sme.kycStatus} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> {sme.zone}
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Phone size={11} /> {sme.contactName}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
