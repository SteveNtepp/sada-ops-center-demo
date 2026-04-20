'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import AppShell from '@/components/AppShell';
import { SMEStatusBadge, KYCBadge, HealthScore } from '@/components/Badges';
import { mockTickets, getActivitiesBySME, getSMEById, formatFCFA, getUserById } from '@/lib/mockData';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import { Phone, MapPin, Mail, Calendar, Activity, FileText, User as UserIcon } from 'lucide-react';

export default function SMEProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const sme = getSMEById(params.id as string);
  const activities = getActivitiesBySME(params.id as string);
  const tickets = mockTickets.filter(t => t.smeId === params.id);

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user || !sme) return null;

  const accountManager = sme.assignedSalesId ? getUserById(sme.assignedSalesId) : null;

  const actTypeColor: Record<string, string> = {
    Appel: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600',
    Visite: 'bg-green-50 dark:bg-green-500/10 text-green-600',
    Email: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600',
    Note: 'bg-gray-50 dark:bg-gray-500/10 text-gray-600',
    Onboarding: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600',
    Résolution: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600',
  };

  return (
    <AppShell title={sme.businessName}>
      <div className="animate-fade-in">
        <Link href="/crm" className="text-sm text-orange-500 hover:underline mb-6 block">← Retour CRM</Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1 space-y-5">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {sme.businessName.charAt(0)}
              </div>
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{sme.businessName}</h2>
              <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{sme.sector}</p>
              
              {accountManager && (
                <div className="flex items-center justify-center gap-1.5 mb-3 text-xs bg-orange-50 dark:bg-orange-500/10 text-orange-600 w-max mx-auto px-2 py-1 rounded-full">
                  <UserIcon size={12} />
                  <span>Account Manager: <strong>{accountManager.name}</strong></span>
                </div>
              )}

              <div className="flex justify-center gap-2 mb-4">
                {(user.role === 'Sales' || user.role === 'Manager') ? (
                  <select 
                    className="input text-xs font-medium py-1 px-2 h-auto" 
                    defaultValue={sme.status}
                    onChange={(e) => alert(`Statut changé en: ${e.target.value}`)}
                  >
                    <option value="Active">Active</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Lead">Lead</option>
                  </select>
                ) : (
                  <SMEStatusBadge status={sme.status} />
                )}
                <KYCBadge status={sme.kycStatus} />
              </div>
              <div className="text-left space-y-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                  <a href={`tel:${sme.phone}`} className="text-blue-500 hover:underline">{sme.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{sme.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Depuis {new Date(sme.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Indicateurs financiers</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>MRR</span>
                    <span className="font-bold text-orange-500">{formatFCFA(sme.revenue_mrr)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span style={{ color: 'var(--text-muted)' }}>Score IA</span>
                    <span className="text-xs font-bold">{sme.iaHealthScore}/100</span>
                  </div>
                  <HealthScore score={sme.iaHealthScore} />
                </div>
              </div>
            </div>

            {/* Documents KYC */}
            {(user.role === 'CEO' || user.role === 'Manager') && (
              <div className="card p-5">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}><FileText size={16}/> Documents KYC</h3>
                {sme.kycDocuments && sme.kycDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {sme.kycDocuments.map(doc => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50/50 dark:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <FileText size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{doc.type} · {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-center py-3 border border-dashed rounded-xl" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Aucun document soumis</p>
                )}
              </div>
            )}

            {/* Field actions */}
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Actions terrain</h3>
              <div className="space-y-2">
                <button className="btn btn-primary w-full justify-center" onClick={() => alert('Check-in enregistré!')}>📍 Check-in Terrain</button>
                <button className="btn btn-secondary w-full justify-center" onClick={() => alert('Dictaphone activé...')}>🎙️ Note Vocale</button>
                <button className="btn btn-secondary w-full justify-center" onClick={() => alert('Caméra ouverte pour KYC...')}>📷 Photo KYC / Preuve</button>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tickets */}
            <div className="card p-6">
              <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Tickets associés ({tickets.length})</h3>
              {tickets.length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>Aucun ticket pour cette PME</p>
              ) : (
                <div className="space-y-3">
                  {tickets.map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                      <PriorityBadge priority={t.priority} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.issueCategory} · {new Date(t.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activities */}
            <div className="card p-6">
              <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Historique d'activités</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: 'var(--border)' }} />
                <div className="space-y-4">
                  {activities.map(act => {
                    const agent = getUserById(act.userId);
                    return (
                      <div key={act.id} className="flex gap-4 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ${actTypeColor[act.type]}`}>
                          {act.type.charAt(0)}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{act.type}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(act.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{act.notes}</p>
                          {agent && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>par {agent.name}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
