'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import AppShell from '@/components/AppShell';
import { mockUsers, mockSOPs, mockTickets, mockSMEs } from '@/lib/mockData';
import { User, UserRole, SOPStep, IssueCategory } from '@/lib/types';
import { Plus, Pencil, Trash2, Save, X, Users, BookOpen, Trophy } from 'lucide-react';

type AdminTab = 'users' | 'sop' | 'leaderboard';

const roleColors: Record<UserRole, string> = {
  CEO: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  Manager: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  Sales: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  Support: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
};

const categories: IssueCategory[] = ['Comptabilité', 'Matériel', 'IA', 'Services Financiers'];

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [sops, setSops] = useState<SOPStep[]>(mockSOPs);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingSOP, setEditingSOP] = useState<SOPStep | null>(null);
  const [sopCategory, setSopCategory] = useState<IssueCategory>('Matériel');

  useEffect(() => { if (!user || (user.role !== 'CEO' && user.role !== 'Manager')) router.push('/dashboard'); }, [user, router]);
  if (!user) return null;

  const filteredSOPs = sops.filter(s => s.category === sopCategory).sort((a, b) => a.stepNumber - b.stepNumber);

  const handleSaveUser = (u: User) => {
    setUsers(prev => prev.some(x => x.id === u.id) ? prev.map(x => x.id === u.id ? u : x) : [...prev, u]);
    setEditingUser(null);
  };

  const handleSaveSOP = (s: SOPStep) => {
    setSops(prev => prev.some(x => x.id === s.id) ? prev.map(x => x.id === s.id ? s : x) : [...prev, s]);
    setEditingSOP(null);
  };

  return (
    <AppShell title="Administration">
      <div className="space-y-5 animate-fade-in">
        {/* Tabs */}
        <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border)' }}>
          {([
            { key: 'users', label: 'Utilisateurs', icon: <Users size={16} /> },
            { key: 'sop', label: 'Bibliothèque SOP', icon: <BookOpen size={16} /> },
            { key: 'leaderboard', label: 'Classements', icon: <Trophy size={16} /> },
          ] as { key: AdminTab; label: string; icon: React.ReactNode }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.key ? 'border-orange-500 text-orange-500' : 'border-transparent hover:text-orange-400'
              }`}
              style={{ color: tab === t.key ? '#F97316' : 'var(--text-secondary)' }}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Users tab */}
        {tab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={() => setEditingUser({ id: `u${Date.now()}`, name: '', role: 'Support', zone: '', avatar: '', email: '' })}>
                <Plus size={16} /> Ajouter un utilisateur
              </button>
            </div>

            {editingUser && (
              <div className="card p-6 border-2 border-orange-300 dark:border-orange-500/30">
                <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                  {users.some(u => u.id === editingUser.id) ? 'Modifier' : 'Nouvel'} utilisateur
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Nom complet</label>
                    <input className="input w-full" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} placeholder="Prénom Nom" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
                    <input className="input w-full" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} placeholder="email@sada.io" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Rôle</label>
                    <select className="input w-full" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}>
                      {(['CEO', 'Manager', 'Sales', 'Support'] as UserRole[]).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Zone</label>
                    <input className="input w-full" value={editingUser.zone} onChange={e => setEditingUser({ ...editingUser, zone: e.target.value })} placeholder="Ex: Dakar" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button className="btn btn-primary" onClick={() => handleSaveUser({ ...editingUser, avatar: editingUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() })}>
                    <Save size={16} /> Enregistrer
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditingUser(null)}><X size={16} /> Annuler</button>
                </div>
              </div>
            )}

            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Utilisateur', 'Email', 'Rôle', 'Zone', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="table-row border-b" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">{u.avatar}</div>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td className="px-4 py-3"><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.zone}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingUser(u)} className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"><Pencil size={14} className="text-orange-500" /></button>
                          <button onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={14} className="text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SOP tab */}
        {tab === 'sop' && (
          <div className="space-y-4">
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSopCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    sopCategory === cat ? 'bg-orange-500 text-white border-orange-500' : 'hover:border-orange-300'
                  }`}
                  style={{ background: sopCategory === cat ? undefined : 'var(--bg-card)', borderColor: sopCategory === cat ? undefined : 'var(--border)', color: sopCategory === cat ? undefined : 'var(--text-secondary)' }}
                >
                  {cat}
                </button>
              ))}
              <button className="btn btn-primary ml-auto" onClick={() => setEditingSOP({ id: `sop${Date.now()}`, category: sopCategory, stepNumber: filteredSOPs.length + 1, instructionText: '', requiredValidation: '' })}>
                <Plus size={16} /> Ajouter une étape
              </button>
            </div>

            {editingSOP && (
              <div className="card p-6 border-2 border-orange-300 dark:border-orange-500/30">
                <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Étape SOP — {sopCategory}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>N° d'étape</label>
                    <input type="number" className="input w-24" value={editingSOP.stepNumber} onChange={e => setEditingSOP({ ...editingSOP, stepNumber: Number(e.target.value) })} min={1} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Instruction</label>
                    <textarea className="input w-full h-24 resize-none" value={editingSOP.instructionText} onChange={e => setEditingSOP({ ...editingSOP, instructionText: e.target.value })} placeholder="Décrivez l'étape de résolution..." />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Validation requise</label>
                    <input className="input w-full" value={editingSOP.requiredValidation} onChange={e => setEditingSOP({ ...editingSOP, requiredValidation: e.target.value })} placeholder="Ex: Confirmer la démarche effectuée" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button className="btn btn-primary" onClick={() => handleSaveSOP({ ...editingSOP, category: sopCategory })}><Save size={16} /> Enregistrer</button>
                  <button className="btn btn-secondary" onClick={() => setEditingSOP(null)}><X size={16} /> Annuler</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {filteredSOPs.map(step => (
                <div key={step.id} className="card p-4 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{step.stepNumber}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{step.instructionText}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>✓ {step.requiredValidation}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setEditingSOP(step)} className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"><Pencil size={14} className="text-orange-500" /></button>
                    <button onClick={() => setSops(prev => prev.filter(s => s.id !== step.id))} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={14} className="text-red-500" /></button>
                  </div>
                </div>
              ))}
              {filteredSOPs.length === 0 && (
                <div className="text-center py-12 card">
                  <BookOpen size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aucune étape SOP pour cette catégorie</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard tab */}
        {tab === 'leaderboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Trophy className="text-orange-500" size={18} /> Top Agents Terrain (Sales)</h3>
              <div className="space-y-3">
                {mockUsers.filter(u => u.role === 'Sales').map(u => ({ user: u, score: mockSMEs.filter(s => s.assignedSalesId === u.id).length })).sort((a, b) => b.score - a.score).map((board, i) => (
                  <div key={board.user.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 flex items-center justify-center font-bold text-xs">{board.user.avatar}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{board.user.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{board.user.zone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-orange-500">{board.score}</p>
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>PMEs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Trophy className="text-blue-500" size={18} /> Top Agents Support</h3>
              <div className="space-y-3">
                {mockUsers.filter(u => u.role === 'Support').map(u => ({ user: u, score: mockTickets.filter(t => t.assignedAgentId === u.id && t.status === 'Resolved').length })).sort((a, b) => b.score - a.score).map((board, i) => (
                  <div key={board.user.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center font-bold text-xs">{board.user.avatar}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{board.user.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{board.user.zone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-500">{board.score}</p>
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Résolus</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
