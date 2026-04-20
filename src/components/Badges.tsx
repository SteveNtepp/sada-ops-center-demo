import React from 'react';
import { TicketStatus, TicketPriority, SMEStatus, KYCStatus, SentimentAnalysis } from '@/lib/types';

interface BadgeProps { label: string; className?: string; }

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: TicketStatus }) {
  const map: Record<TicketStatus, string> = {
    'Nouveau': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    'En cours': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
    'Résolu': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  };
  return <span className={`badge ${map[status]}`}>{status}</span>;
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const map: Record<TicketPriority, string> = {
    'P1': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    'P2': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    'P3': 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300',
  };
  const dot: Record<TicketPriority, string> = {
    P1: 'animate-pulse bg-red-500', P2: 'bg-orange-500', P3: 'bg-gray-400'
  };
  return (
    <span className={`badge ${map[priority]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[priority]}`} />
      {priority}
    </span>
  );
}

// ─── SME Status Badge ─────────────────────────────────────────────────────────
export function SMEStatusBadge({ status }: { status: SMEStatus }) {
  const map: Record<SMEStatus, string> = {
    'Active': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    'At Risk': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    'Onboarding': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    'Lead': 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  };
  return <span className={`badge ${map[status]}`}>{status}</span>;
}

// ─── KYC Badge ───────────────────────────────────────────────────────────────
export function KYCBadge({ status }: { status: KYCStatus }) {
  const map: Record<KYCStatus, string> = {
    'Approuvé': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    'En attente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
    'Rejeté': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    'Non soumis': 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300',
  };
  return <span className={`badge ${map[status]}`}>{status}</span>;
}

// ─── Sentiment Badge ──────────────────────────────────────────────────────────
export function SentimentBadge({ sentiment }: { sentiment: SentimentAnalysis }) {
  const map: Record<SentimentAnalysis, { cls: string; emoji: string }> = {
    'Positif': { cls: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300', emoji: '😊' },
    'Neutre': { cls: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300', emoji: '😐' },
    'Négatif': { cls: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300', emoji: '😟' },
  };
  const { cls, emoji } = map[sentiment];
  return <span className={`badge ${cls}`}>{emoji} {sentiment}</span>;
}

// ─── Health Score Bar ─────────────────────────────────────────────────────────
export function HealthScore({ score }: { score: number }) {
  const color = score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-3">
      <div className="progress flex-1" style={{ minWidth: 80 }}>
        <div className="progress-bar" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

// ─── Generic Badge ────────────────────────────────────────────────────────────
export function Badge({ label, className = '' }: BadgeProps) {
  return <span className={`badge ${className}`}>{label}</span>;
}
