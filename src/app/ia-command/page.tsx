'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import AppShell from '@/components/AppShell';
import KPICard from '@/components/KPICard';
import { HealthScore } from '@/components/Badges';
import { mockSMEs, formatFCFA, getTotalMRR } from '@/lib/mockData';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Zap, Target } from 'lucide-react';

const sectorHealth = [
  { sector: 'Alimentation', score: 82 }, { sector: 'Automobile', score: 72 },
  { sector: 'Santé', score: 34 }, { sector: 'Transport', score: 41 },
  { sector: 'Agriculture', score: 91 }, { sector: 'Construction', score: 68 },
];

const radarData = [
  { metric: 'Rétention', value: 88 }, { metric: 'MRR', value: 76 },
  { metric: 'Score IA', value: 82 }, { metric: 'SLA', value: 71 },
  { metric: 'KYC', value: 90 }, { metric: 'Onboarding', value: 65 },
];

const forecastData = [
  { mois: 'Mai', reel: null, prev: 68000000 }, { mois: 'Juin', reel: null, prev: 74000000 },
  { mois: 'Jul', reel: null, prev: 81000000 }, { mois: 'Août', reel: null, prev: 79000000 },
];

const statusDist = [
  { name: 'Active', value: mockSMEs.filter(s => s.status === 'Active').length, color: '#22C55E' },
  { name: 'Onboarding', value: mockSMEs.filter(s => s.status === 'Onboarding').length, color: '#3B82F6' },
  { name: 'At Risk', value: mockSMEs.filter(s => s.status === 'At Risk').length, color: '#EF4444' },
  { name: 'Lead', value: mockSMEs.filter(s => s.status === 'Lead').length, color: '#A855F7' },
];

const recommendations = [
  { priority: 'haute', text: 'Pharmacie Centrale Abidjan (score 34) — Intervention urgente requise, risque de churn élevé.', icon: '🚨' },
  { priority: 'haute', text: 'Transport Express Lomé (score 41) — KYC en attente depuis 30 jours, relance nécessaire.', icon: '⚠️' },
  { priority: 'moyenne', text: 'Boutique Mode Bamako (Lead) — Profil éligible au microcrédit SADA, conversion recommandée.', icon: '💡' },
  { priority: 'basse', text: 'Agro Sénégal SARL (score 91) — Bon candidat pour upgrade vers le forfait Premium.', icon: '⬆️' },
];

export default function IACommandPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  const avgScore = Math.round(mockSMEs.reduce((s, m) => s + m.iaHealthScore, 0) / mockSMEs.length);

  return (
    <AppShell title="Centre de Commande IA">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="Score IA Moyen" value={`${avgScore}/100`} sub="Toutes PMEs" icon={<Brain size={20} />} color="orange" trend={4.2} />
          <KPICard label="PMEs à risque" value={`${mockSMEs.filter(s => s.status === 'At Risk').length}`} sub="Intervention requise" icon={<AlertTriangle size={20} />} color="red" pulse />
          <KPICard label="Prev. MRR Mai" value={formatFCFA(68000000)} sub="+9.6% vs Avr" icon={<TrendingUp size={20} />} color="green" trend={9.6} />
          <KPICard label="Potentiel non capté" value={formatFCFA(12500000)} sub="Leads non convertis" icon={<Target size={20} />} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="card p-6">
            <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Santé opérationnelle globale</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="value" stroke="#F97316" fill="#F97316" fillOpacity={0.18} strokeWidth={2} dot={{ fill: '#F97316', r: 4 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="card p-6">
            <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Distribution statuts PME</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={true}>
                  {statusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prévisions MRR */}
        <div className="card p-6">
          <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>Prévisions MRR (4 prochains mois)</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Basé sur le modèle IA SADA v2.1 · Intervalle de confiance 87%</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatFCFA(v), 'Prévision MRR']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="prev" stroke="#2563EB" fill="url(#prevGrad)" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#2563EB', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Santé IA par secteur */}
        <div className="card p-6">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Score IA par secteur</h3>
          <div className="space-y-3">
            {sectorHealth.sort((a, b) => b.score - a.score).map(s => (
              <div key={s.sector} className="flex items-center gap-4">
                <span className="text-sm font-medium w-36 flex-shrink-0" style={{ color: 'var(--text-primary)' }}>{s.sector}</span>
                <div className="flex-1"><HealthScore score={s.score} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-500/10">
              <Zap size={18} className="text-orange-500" />
            </div>
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Recommandations IA</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className={`p-4 rounded-xl border-l-4 ${
                r.priority === 'haute' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-500/5' :
                r.priority === 'moyenne' ? 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-500/5' :
                'border-l-blue-500 bg-blue-50/50 dark:bg-blue-500/5'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{r.icon}</span>
                  <div>
                    <span className={`text-xs font-bold uppercase ${r.priority === 'haute' ? 'text-red-500' : r.priority === 'moyenne' ? 'text-yellow-600' : 'text-blue-500'}`}>
                      Priorité {r.priority}
                    </span>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
