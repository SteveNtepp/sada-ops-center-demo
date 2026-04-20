'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { UserRole } from '@/lib/types';
import { Zap, ChevronRight, Shield, TrendingUp, Headphones, Users } from 'lucide-react';

const roles: { role: UserRole; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  { role: 'CEO', label: 'Directeur Général', description: 'Vision macro, KPIs stratégiques', icon: <TrendingUp size={22} />, color: 'from-orange-500 to-orange-600' },
  { role: 'Manager', label: 'Manager', description: 'Équipe, alertes P1, suivi SLA', icon: <Shield size={22} />, color: 'from-blue-500 to-blue-600' },
  { role: 'Sales', label: 'Agent Terrain', description: 'Route du jour, onboarding PME', icon: <Users size={22} />, color: 'from-purple-500 to-purple-600' },
  { role: 'Support', label: 'Agent Support', description: 'File tickets, SOP Resolver', icon: <Headphones size={22} />, color: 'from-green-500 to-green-600' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      login(selected);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #F97316, transparent)' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #2563EB, transparent)' }} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl">SADA</span>
              <span className="text-gray-400 text-sm block leading-none">Ops Center</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Centre de <span style={{ background: 'linear-gradient(135deg, #F97316, #FDBA74)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              planification
            </span><br />
            de pilotage et d’optimisation opérationnel
          </h2>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: '10K+', label: 'PMEs actives' },
            { value: '98%', label: 'SLA maintenu' },
            { value: '15 pays', label: 'Zones couvertes' },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-xl border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-6 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>SADA Ops Center</span>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Connexion</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sélectionnez votre rôle pour accéder à l'espace dédié</p>
          </div>

          <div className="space-y-3 mb-8">
            {roles.map(r => (
              <button
                key={r.role}
                onClick={() => setSelected(r.role)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selected === r.role
                    ? 'border-orange-500 shadow-lg shadow-orange-500/10'
                    : 'border-transparent hover:border-orange-200 dark:hover:border-orange-500/20'
                }`}
                style={{ background: 'var(--bg-card)' }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white flex-shrink-0`}>
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.description}</p>
                </div>
                {selected === r.role && (
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selected || loading}
            className="btn btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Accéder à la plateforme <ChevronRight size={18} /></>
            )}
          </button>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            © 2026 SADA — Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
}
