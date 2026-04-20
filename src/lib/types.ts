// ─── Types Core ────────────────────────────────────────────────────────────────

export type UserRole = 'CEO' | 'Manager' | 'Sales' | 'Support';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  zone: string;
  avatar: string;
  email: string;
}

export type SMEStatus = 'Lead' | 'Onboarding' | 'Active' | 'At Risk';
export type KYCStatus = 'Non soumis' | 'En attente' | 'Approuvé' | 'Rejeté';

export interface SME {
  id: string;
  businessName: string;
  sector: string;
  status: SMEStatus;
  gpsLocation: { lat: number; lng: number };
  revenue_mrr: number;
  kycStatus: KYCStatus;
  iaHealthScore: number;
  phone: string;
  address: string;
  contactName: string;
  zone: string;
  createdAt: string;
  assignedSalesId?: string;
  kycDocuments?: { id: string; name: string; url: string; uploadDate: string; type: string }[];
}

export type IssueCategory = 'Comptabilité' | 'Matériel' | 'IA' | 'Services Financiers';
export type TicketPriority = 'P1' | 'P2' | 'P3';
export type TicketStatus = 'Nouveau' | 'En cours' | 'Résolu';
export type SentimentAnalysis = 'Positif' | 'Neutre' | 'Négatif';

export interface Ticket {
  id: string;
  smeId: string;
  assignedAgentId: string;
  issueCategory: IssueCategory;
  priority: TicketPriority;
  status: TicketStatus;
  sopStepCurrent: number;
  sentimentAnalysis: SentimentAnalysis;
  createdAt: string;
  lastTouchedAt: string;
  description: string;
  title: string;
}

export interface SOPStep {
  id: string;
  category: IssueCategory;
  stepNumber: number;
  instructionText: string;
  requiredValidation: string;
  completed?: boolean;
}

export interface Activity {
  id: string;
  smeId: string;
  userId: string;
  type: 'Appel' | 'Visite' | 'Email' | 'Note' | 'Onboarding' | 'Résolution';
  notes: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  ticketId: string;
  sender: 'agent' | 'sme';
  message: string;
  timestamp: string;
}
