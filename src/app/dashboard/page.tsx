'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import AppShell from '@/components/AppShell';
import KPICard from '@/components/KPICard';
import { PriorityBadge, StatusBadge, SMEStatusBadge, HealthScore } from '@/components/Badges';
import { mockTickets, mockSMEs, mockUsers, formatFCFA, getTotalMRR, getGlobalSLA, getRetentionRate, isP1Alert } from '@/lib/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { TrendingUp, Users, AlertTriangle, Clock, CheckCircle, Target, Activity } from 'lucide-react';

const mrrData = [
  { mois: 'Nov', mrr: 38000000 }, { mois: 'Déc', mrr: 42000000 },
  { mois: 'Jan', mrr: 45000000 }, { mois: 'Fév', mrr: 51000000 },
  { mois: 'Mar', mrr: 56000000 }, { mois: 'Avr', mrr: 62000000 },
];

const sectorData = [
  { sector: 'Aliment.', tickets: 12 }, { sector: 'Auto', tickets: 8 },
  { sector: 'Santé', tickets: 15 }, { sector: 'Transport', tickets: 10 },
  { sector: 'Textile', tickets: 4 }, { sector: 'Construc.', tickets: 7 },
];

function CEODashboard() {
  const mrr = getTotalMRR();
  const sla = getGlobalSLA();
  const retention = getRetentionRate();
  const activeSMEs = mockSMEs.filter(s => s.status === 'Active').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard label="MRR Total" value={formatFCFA(mrr)} sub="Ce mois" icon={<TrendingUp size={20} />} trend={9.2} color="orange" />
        <KPICard label="SLA Global" value={`${sla}%`} sub="Tickets résolus" icon={<CheckCircle size={20} />} trend={2.1} color="green" />
        <KPICard label="Rétention PME" value={`${retention}%`} sub="PMEs actives" icon={<Target size={20} />} trend={-1.3} color="blue" />
        <KPICard label="PMEs Actives" value={`${activeSMEs}`} sub={`sur ${mockSMEs.length} total`} icon={<Users size={20} />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Évolution MRR (6 mois)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mrrData}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatFCFA(v), 'MRR']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="mrr" stroke="#F97316" fill="url(#mrrGrad)" strokeWidth={2} dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Tickets par Secteur</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectorData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="sector" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="tickets" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PME at Risk */}
      <div className="card p-6">
        <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>PMEs à risque</h3>
        <div className="space-y-3">
          {mockSMEs.filter(s => s.status === 'At Risk').map(sme => (
            <div key={sme.id} className="flex items-center gap-4 p-3 rounded-lg table-row">
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{sme.businessName}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sme.sector} · {sme.zone}</p>
              </div>
              <HealthScore score={sme.iaHealthScore} />
              <SMEStatusBadge status={sme.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  const p1Tickets = mockTickets.filter(t => t.priority === 'P1' && t.status !== 'Résolu');
  const alerts = p1Tickets.filter(isP1Alert);
  const agentWorkload = mockUsers.filter(u => u.role === 'Support').map(agent => ({
    agent,
    count: mockTickets.filter(t => t.assignedAgentId === agent.id && t.status !== 'Résolu').length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {alerts.length > 0 && (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-500/30 flex items-start gap-3 animate-pulse-slow"
          style={{ background: 'rgba(239,68,68,0.08)' }}>
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-600 dark:text-red-400 text-sm">🚨 Alerte P1 — {alerts.length} ticket(s) non traité(s) depuis +2h</p>
            <p className="text-xs text-red-500 mt-1">Action immédiate requise · Ces tickets n'ont pas été mis à jour depuis plus de 2 heures</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard label="Tickets P1 ouverts" value={`${p1Tickets.length}`} sub="Traitement urgent" icon={<AlertTriangle size={20} />} color="red" pulse={p1Tickets.length > 0} />
        <KPICard label="En cours" value={`${mockTickets.filter(t => t.status === 'En cours').length}`} sub="tickets actifs" icon={<Clock size={20} />} color="yellow" />
        <KPICard label="Résolus aujourd'hui" value={`${mockTickets.filter(t => t.status === 'Résolu').length}`} sub="tickets" icon={<CheckCircle size={20} />} color="green" />
        <KPICard label="SLA Équipe" value={`${getGlobalSLA()}%`} sub="objectif 95%" icon={<Target size={20} />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Charge de l'équipe support</h3>
          <div className="space-y-4">
            {agentWorkload.map(({ agent, count }) => (
              <div key={agent.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {agent.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-primary)' }} className="font-medium">{agent.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} tickets</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${Math.min((count / 5) * 100, 100)}%`, background: count > 3 ? '#EF4444' : count > 1 ? '#F59E0B' : '#22C55E' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Tickets P1 critiques</h3>
          <div className="space-y-3">
            {p1Tickets.map(ticket => {
              const sme = mockSMEs.find(s => s.id === ticket.smeId);
              const alert = isP1Alert(ticket);
              return (
                <div key={ticket.id} className={`p-3 rounded-lg border ${alert ? 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/5' : ''}`}
                  style={{ borderColor: alert ? undefined : 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{ticket.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sme?.businessName} · {ticket.issueCategory}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <PriorityBadge priority={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                  {alert && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ Plus de 2h sans mise à jour</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldDashboard() {
  const myTasks = mockSMEs.filter(s => s.status === 'Onboarding' || s.status === 'Lead').slice(0, 4);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Visites planifiées" value="6" sub="Aujourd'hui" icon={<Activity size={20} />} color="blue" />
        <KPICard label="Onboardings à faire" value={`${mockSMEs.filter(s => s.status === 'Onboarding').length}`} sub="PMEs en cours" icon={<Users size={20} />} color="orange" />
        <KPICard label="PMEs Lead" value={`${mockSMEs.filter(s => s.status === 'Lead').length}`} sub="À convertir" icon={<Target size={20} />} color="yellow" />
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Route du jour</h3>
        <div className="space-y-3">
          {myTasks.map((sme, i) => (
            <div key={sme.id} className="flex items-center gap-4 p-3 rounded-lg table-row">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{sme.businessName}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sme.address} · {sme.contactName}</p>
              </div>
              <SMEStatusBadge status={sme.status} />
              <button className="btn btn-secondary text-xs py-1.5 px-3">Check-in</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupportDashboard() {
  const myTickets = mockTickets.filter(t => t.assignedAgentId === 'u4');
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Mes tickets" value={`${myTickets.length}`} sub="assignés" icon={<Activity size={20} />} color="blue" />
        <KPICard label="En attente" value={`${myTickets.filter(t => t.status === 'Nouveau').length}`} sub="Nouveau" icon={<Clock size={20} />} color="red" pulse />
        <KPICard label="Résolus" value={`${myTickets.filter(t => t.status === 'Résolu').length}`} sub="Ce mois" icon={<CheckCircle size={20} />} color="green" />
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Ma file de tickets</h3>
        <div className="space-y-2">
          {myTickets.sort((a, b) => (a.priority > b.priority ? 1 : -1)).map(ticket => {
            const sme = mockSMEs.find(s => s.id === ticket.smeId);
            return (
              <div key={ticket.id} className="flex items-center gap-3 p-3 rounded-lg border table-row" style={{ borderColor: 'var(--border)' }}>
                <PriorityBadge priority={ticket.priority} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{ticket.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sme?.businessName}</p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  const titleMap: Record<string, string> = {
    CEO: 'Tableau de bord — Vision Stratégique',
    Manager: 'Tableau de bord — Management',
    Sales: 'Tableau de bord — Terrain',
    Support: 'Tableau de bord — Support',
  };

  return (
    <AppShell title={titleMap[user.role] || 'Tableau de bord'}>
      {user.role === 'CEO' && <CEODashboard />}
      {user.role === 'Manager' && <ManagerDashboard />}
      {user.role === 'Sales' && <FieldDashboard />}
      {user.role === 'Support' && <SupportDashboard />}
    </AppShell>
  );
}
