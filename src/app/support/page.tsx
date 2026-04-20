'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import AppShell from '@/components/AppShell';
import { StatusBadge, PriorityBadge, SentimentBadge, HealthScore } from '@/components/Badges';
import { mockTickets, mockSMEs, mockUsers, getSOPsByCategory, getActivitiesBySME, getChatByTicket, formatFCFA } from '@/lib/mockData';
import { Ticket, IssueCategory, SOPStep } from '@/lib/types';
import { Search, Filter, ChevronRight, Clock, MessageCircle, CheckSquare, Square, ArrowUpRight, Phone, Send, AlertOctagon } from 'lucide-react';

const categories: IssueCategory[] = ['Comptabilité', 'Matériel', 'IA', 'Services Financiers'];

function TicketRow({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const sme = mockSMEs.find(s => s.id === ticket.smeId);
  const agent = mockUsers.find(u => u.id === ticket.assignedAgentId);
  const now = Date.now();
  const elapsed = Math.floor((now - new Date(ticket.lastTouchedAt).getTime()) / 60000);
  const slaAlert = ticket.priority === 'P1' && elapsed > 120 && ticket.status !== 'Résolu';

  return (
    <div onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${slaAlert ? 'border-red-300 dark:border-red-500/40 bg-red-50/50 dark:bg-red-500/5' : ''}`}
      style={{ background: slaAlert ? undefined : 'var(--bg-card)', borderColor: slaAlert ? undefined : 'var(--border)' }}>
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-2 flex-shrink-0">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{ticket.title}</p>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-muted)' }}>{sme?.businessName} · {ticket.issueCategory}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Clock size={11} /> {elapsed < 60 ? `${elapsed}min` : `${Math.floor(elapsed / 60)}h${elapsed % 60 > 0 ? elapsed % 60 + 'm' : ''}`}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Agent: {agent?.name.split(' ')[0]}</span>
            <SentimentBadge sentiment={ticket.sentimentAnalysis} />
            {slaAlert && <span className="text-xs text-red-500 font-bold">⚠️ SLA dépassé</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SOPChecklist({ category, currentStep, onStepChange }: { category: IssueCategory; currentStep: number; onStepChange: (step: number) => void }) {
  const steps = getSOPsByCategory(category);
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step.id}
            onClick={() => !done && onStepChange(i + 1)}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              active ? 'border-orange-300 dark:border-orange-500/40 bg-orange-50/50 dark:bg-orange-500/5' :
              done ? 'border-green-200 dark:border-green-500/20 bg-green-50/30 dark:bg-green-500/5' :
              'hover:border-orange-200 dark:hover:border-orange-500/20'
            }`}
            style={{ borderColor: active ? undefined : done ? undefined : 'var(--border)' }}>
            <span className="flex-shrink-0 mt-0.5">
              {done ? <CheckSquare size={18} className="text-green-500" /> : <Square size={18} style={{ color: active ? '#F97316' : 'var(--text-muted)' }} />}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${active ? 'bg-orange-500 text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                  Étape {step.stepNumber}
                </span>
                {active && <span className="text-xs text-orange-500 font-medium">En cours</span>}
              </div>
              <p className="text-sm" style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>
                {step.instructionText}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>✓ {step.requiredValidation}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TicketDetail({ ticket, onBack, onUpdate }: { ticket: Ticket; onBack: () => void; onUpdate: (t: Ticket) => void }) {
  const sme = mockSMEs.find(s => s.id === ticket.smeId)!;
  const agent = mockUsers.find(u => u.id === ticket.assignedAgentId);
  const activities = getActivitiesBySME(ticket.smeId).slice(0, 3);
  const chats = getChatByTicket(ticket.id);
  const [localTicket, setLocalTicket] = useState(ticket);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState(chats);
  const [category, setCategory] = useState<IssueCategory>(ticket.issueCategory);

  useEffect(() => {
    setLocalTicket(prev => ({ ...prev, issueCategory: category, sopStepCurrent: 0 }));
  }, [category]);

  const handleResolve = () => {
    const updated = { ...localTicket, status: 'Résolu' as const, lastTouchedAt: new Date().toISOString() };
    setLocalTicket(updated);
    onUpdate(updated);
  };

  const handleSendMessage = () => {
    if (!chatMsg.trim()) return;
    const newMsg = { id: `cm${Date.now()}`, ticketId: ticket.id, sender: 'agent' as const, message: chatMsg, timestamp: new Date().toISOString() };
    setMessages([...messages, newMsg]);
    setChatMsg('');
  };

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-6 hover:text-orange-500 transition-colors" style={{ color: 'var(--text-secondary)' }}>
        ← Retour à la file
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: SOP + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket header */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PriorityBadge priority={localTicket.priority} />
                  <StatusBadge status={localTicket.status} />
                  <SentimentBadge sentiment={localTicket.sentimentAnalysis} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{ticket.title}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{ticket.description}</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>#{ticket.id}</span>
            </div>

            {/* Category selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Catégorie :</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                    category === cat ? 'bg-orange-500 text-white border-orange-500' : 'hover:border-orange-300'
                  }`}
                  style={{ background: category === cat ? undefined : 'var(--bg-card)', borderColor: category === cat ? undefined : 'var(--border)', color: category === cat ? undefined : 'var(--text-secondary)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* SOP Resolver */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-500/10">
                <CheckSquare size={18} className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>SOP Resolver — {category}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Guide pas-à-pas SADA officiel</p>
              </div>
            </div>
            <SOPChecklist
              category={category}
              currentStep={localTicket.sopStepCurrent}
              onStepChange={step => setLocalTicket(prev => ({ ...prev, sopStepCurrent: step }))}
            />
          </div>

          {/* Actions */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Actions de résolution</h3>
            <div className="flex gap-3 flex-wrap">
              <button className="btn btn-danger" onClick={() => alert('Escalade au manager envoyée!')}>
                <AlertOctagon size={16} /> Escalader au Manager
              </button>
              <button className="btn btn-blue" onClick={() => alert(`Mise à jour WhatsApp envoyée à ${sme.phone}`)}>
                <Phone size={16} /> WhatsApp
              </button>
              <button className="btn btn-success" onClick={handleResolve} disabled={localTicket.status === 'Résolu'}>
                <CheckSquare size={16} /> {localTicket.status === 'Résolu' ? '✓ Résolu' : 'Marquer Résolu'}
              </button>
            </div>
          </div>

          {/* Chat */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle size={18} className="text-blue-500" />
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Journal de communication</h3>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender === 'agent'
                      ? 'bg-orange-500 text-white rounded-br-sm'
                      : 'rounded-bl-sm'
                  }`}
                  style={msg.sender === 'sme' ? { background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' } : {}}>
                    <p>{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'agent' ? 'text-orange-100' : ''}`} style={msg.sender === 'sme' ? { color: 'var(--text-muted)' } : {}}>{new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Envoyer un message..." className="input flex-1" />
              <button onClick={handleSendMessage} className="btn btn-primary px-4">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: SME Context */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Contexte PME</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {sme.businessName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{sme.businessName}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sme.sector} · {sme.zone}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>MRR</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatFCFA(sme.revenue_mrr)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: 'var(--text-muted)' }}>Score IA</span>
                <HealthScore score={sme.iaHealthScore} />
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>KYC</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{sme.kycStatus}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>Contact</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{sme.contactName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>Téléphone</span>
                <a href={`tel:${sme.phone}`} className="font-semibold text-blue-500">{sme.phone}</a>
              </div>
            </div>
            <Link href={`/crm/${sme.id}`} className="flex items-center gap-1 text-xs text-orange-500 font-medium mt-4 hover:underline">
              Voir le profil complet <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>3 dernières interactions</h3>
            <div className="space-y-3">
              {activities.map(act => (
                <div key={act.id} className="text-xs">
                  <div className="flex justify-between mb-0.5">
                    <span className="font-medium text-orange-500">{act.type}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date(act.timestamp).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>{act.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState(mockTickets);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('Tous');
  const [filterStatus, setFilterStatus] = useState<string>('Tous');

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  const myTickets = tickets.filter(t => {
    const matchSearch = search === '' || t.title.toLowerCase().includes(search.toLowerCase()) || mockSMEs.find(s => s.id === t.smeId)?.businessName.toLowerCase().includes(search.toLowerCase());
    const matchP = filterPriority === 'Tous' || t.priority === filterPriority;
    const matchS = filterStatus === 'Tous' || t.status === filterStatus;
    return matchSearch && matchP && matchS;
  });

  const sorted = [...myTickets].sort((a, b) => {
    const pOrder = { P1: 0, P2: 1, P3: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  const handleUpdate = (updated: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelected(updated);
  };

  if (selected) {
    return (
      <AppShell title="Support Hub — Détail Ticket">
        <TicketDetail ticket={selected} onBack={() => setSelected(null)} onUpdate={handleUpdate} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Support Hub — File de Tickets">
      <div className="space-y-5 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['P1', 'P2', 'P3'] as const).map(p => (
            <div key={p} className="card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: p === 'P1' ? '#EF4444' : p === 'P2' ? '#F59E0B' : 'var(--text-secondary)' }}>
                {tickets.filter(t => t.priority === p && t.status !== 'Résolu').length}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Tickets {p} ouverts</p>
            </div>
          ))}
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{tickets.filter(t => t.status === 'Résolu').length}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Résolus total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un ticket ou PME..." className="input w-full pl-9" />
            </div>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input">
              <option value="Tous">Toutes priorités</option>
              <option value="P1">P1 Critique</option>
              <option value="P2">P2 Important</option>
              <option value="P3">P3 Normal</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input">
              <option value="Tous">Tous statuts</option>
              <option value="Nouveau">Nouveau</option>
              <option value="En cours">En cours</option>
              <option value="Résolu">Résolu</option>
            </select>
          </div>
        </div>

        {/* Ticket list */}
        <div className="space-y-3">
          {sorted.map(ticket => (
            <TicketRow key={ticket.id} ticket={ticket} onClick={() => setSelected(ticket)} />
          ))}
          {sorted.length === 0 && (
            <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
              <Search size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">Aucun ticket trouvé</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
