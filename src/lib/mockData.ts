import { User, SME, Ticket, SOPStep, Activity, ChatMessage } from './types';

// ─── USERS ────────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'u1', name: 'Massamba SY', role: 'CEO', zone: 'Siège', avatar: 'MS', email: 'massamba@sada.io' },
  { id: 'u2', name: 'Fatou Owens', role: 'Manager', zone: 'Dakar', avatar: 'FO', email: 'fatou.owens@sada.io' },
  { id: 'u3', name: 'Ibrahima Sow', role: 'Sales', zone: 'Abidjan', avatar: 'IS', email: 'ibrahima@sada.io' },
  { id: 'u4', name: 'Mariam Coulibaly', role: 'Support', zone: 'Dakar', avatar: 'MC', email: 'mariam@sada.io' },
  { id: 'u5', name: 'Oumar Traoré', role: 'Support', zone: 'Conakry', avatar: 'OT', email: 'oumar@sada.io' },
  { id: 'u6', name: 'Aissatou Ba', role: 'Sales', zone: 'Bamako', avatar: 'AB', email: 'aissatou@sada.io' },
];

// ─── SMEs ─────────────────────────────────────────────────────────────────────
const dummyKycDocs = [
  { id: 'd1', name: 'RegistreCommerce_Copy.pdf', url: '#', uploadDate: '2024-01-16', type: 'Extrait RCCM' },
  { id: 'd2', name: 'CNI_Gerant.pdf', url: '#', uploadDate: '2024-01-16', type: 'Pièce d\'identité' },
];

export const mockSMEs: SME[] = [
  { id: 's1', businessName: 'Boulangerie Moderne Thiès', sector: 'Alimentation', status: 'Active', gpsLocation: { lat: 14.7886, lng: -16.9244 }, revenue_mrr: 1850000, kycStatus: 'Approuvé', iaHealthScore: 87, phone: '+221 77 123 4567', address: 'Rue 10, Thiès', contactName: 'Cheikh Ndiaye', zone: 'Dakar', createdAt: '2024-01-15', assignedSalesId: 'u3', kycDocuments: dummyKycDocs },
  { id: 's2', businessName: 'Garage Auto Dakar', sector: 'Automobile', status: 'Active', gpsLocation: { lat: 14.6928, lng: -17.4467 }, revenue_mrr: 3200000, kycStatus: 'Approuvé', iaHealthScore: 72, phone: '+221 70 234 5678', address: 'Av. Bourguiba, Dakar', contactName: 'Moussa Diop', zone: 'Dakar', createdAt: '2024-02-20', assignedSalesId: 'u6', kycDocuments: dummyKycDocs },
  { id: 's3', businessName: 'Pharmacie Centrale Abidjan', sector: 'Santé', status: 'At Risk', gpsLocation: { lat: 5.3600, lng: -4.0083 }, revenue_mrr: 5600000, kycStatus: 'Approuvé', iaHealthScore: 34, phone: '+225 07 000 1111', address: 'Plateau, Abidjan', contactName: 'Dr. Koné', zone: 'Abidjan', createdAt: '2024-01-05', assignedSalesId: 'u3', kycDocuments: dummyKycDocs },
  { id: 's4', businessName: 'Restaurant Le Baobab', sector: 'Restauration', status: 'Onboarding', gpsLocation: { lat: 12.3714, lng: -15.0000 }, revenue_mrr: 920000, kycStatus: 'En attente', iaHealthScore: 55, phone: '+245 96 111 222', address: 'Centre, Bissau', contactName: 'Ndeye Fall', zone: 'Dakar', createdAt: '2024-04-01', assignedSalesId: 'u6', kycDocuments: [dummyKycDocs[1]] },
  { id: 's5', businessName: 'Boutique Mode Bamako', sector: 'Textile', status: 'Lead', gpsLocation: { lat: 12.6392, lng: -8.0029 }, revenue_mrr: 0, kycStatus: 'Non soumis', iaHealthScore: 20, phone: '+223 66 222 333', address: 'Hippodrome, Bamako', contactName: 'Awa Keita', zone: 'Bamako', createdAt: '2024-04-10', assignedSalesId: 'u6', kycDocuments: [] },
  { id: 's6', businessName: 'Quincaillerie Conakry Pro', sector: 'Construction', status: 'Active', gpsLocation: { lat: 9.6412, lng: -13.5784 }, revenue_mrr: 2400000, kycStatus: 'Approuvé', iaHealthScore: 68, phone: '+224 622 444 555', address: 'Madina, Conakry', contactName: 'Mamadou Camara', zone: 'Conakry', createdAt: '2024-03-01', assignedSalesId: 'u3', kycDocuments: dummyKycDocs },
  { id: 's7', businessName: 'Agro Sénégal SARL', sector: 'Agriculture', status: 'Active', gpsLocation: { lat: 14.1652, lng: -15.6747 }, revenue_mrr: 4100000, kycStatus: 'Approuvé', iaHealthScore: 91, phone: '+221 76 555 666', address: 'Kaolack, Sénégal', contactName: 'Pape Diouf', zone: 'Dakar', createdAt: '2023-11-20', assignedSalesId: 'u3', kycDocuments: dummyKycDocs },
  { id: 's8', businessName: 'Transport Express Lomé', sector: 'Transport', status: 'At Risk', gpsLocation: { lat: 6.1375, lng: 1.2123 }, revenue_mrr: 1950000, kycStatus: 'En attente', iaHealthScore: 41, phone: '+228 90 777 888', address: 'Lomé Centre', contactName: 'Koffi Mensah', zone: 'Abidjan', createdAt: '2024-01-30', assignedSalesId: 'u6', kycDocuments: [dummyKycDocs[0]] },
];

// ─── TICKETS ─────────────────────────────────────────────────────────────────
export const mockTickets: Ticket[] = [
  { id: 't1', smeId: 's3', assignedAgentId: 'u4', issueCategory: 'Matériel', priority: 'P1', status: 'En cours', sopStepCurrent: 2, sentimentAnalysis: 'Négatif', createdAt: '2026-04-20T10:00:00Z', lastTouchedAt: '2026-04-20T10:30:00Z', title: 'Terminal TPE hors service', description: 'Le terminal de paiement ne s\'allume plus depuis ce matin.' },
  { id: 't2', smeId: 's8', assignedAgentId: 'u4', issueCategory: 'Comptabilité', priority: 'P1', status: 'Nouveau', sopStepCurrent: 0, sentimentAnalysis: 'Négatif', createdAt: '2026-04-20T08:00:00Z', lastTouchedAt: '2026-04-20T08:00:00Z', title: 'Erreur de rapprochement bancaire', description: 'Décalage de 450 000 FCFA dans le bilan du mois.' },
  { id: 't3', smeId: 's1', assignedAgentId: 'u5', issueCategory: 'IA', priority: 'P2', status: 'En cours', sopStepCurrent: 1, sentimentAnalysis: 'Neutre', createdAt: '2026-04-19T14:00:00Z', lastTouchedAt: '2026-04-20T09:00:00Z', title: 'Score IA en baisse', description: 'Le score IA est passé de 92 à 87 sans explication claire.' },
  { id: 't4', smeId: 's4', assignedAgentId: 'u4', issueCategory: 'Services Financiers', priority: 'P2', status: 'Nouveau', sopStepCurrent: 0, sentimentAnalysis: 'Neutre', createdAt: '2026-04-19T11:00:00Z', lastTouchedAt: '2026-04-19T11:00:00Z', title: 'Demande de microcrédit bloquée', description: 'La demande de crédit de 500 000 FCFA est en attente depuis 5 jours.' },
  { id: 't5', smeId: 's6', assignedAgentId: 'u5', issueCategory: 'Matériel', priority: 'P3', status: 'Résolu', sopStepCurrent: 4, sentimentAnalysis: 'Positif', createdAt: '2026-04-18T09:00:00Z', lastTouchedAt: '2026-04-19T16:00:00Z', title: 'Imprimante reçus défectueuse', description: 'L\'imprimante de tickets ne fonctionne pas correctement.' },
  { id: 't6', smeId: 's2', assignedAgentId: 'u4', issueCategory: 'IA', priority: 'P3', status: 'Résolu', sopStepCurrent: 3, sentimentAnalysis: 'Positif', createdAt: '2026-04-17T15:00:00Z', lastTouchedAt: '2026-04-18T10:00:00Z', title: 'Configuration module analytique', description: 'Besoin d\'aide pour paramétrer le tableau de bord IA.' },
  { id: 't7', smeId: 's7', assignedAgentId: 'u4', issueCategory: 'Comptabilité', priority: 'P2', status: 'En cours', sopStepCurrent: 1, sentimentAnalysis: 'Neutre', createdAt: '2026-04-20T07:00:00Z', lastTouchedAt: '2026-04-20T13:00:00Z', title: 'TVA mal calculée', description: 'La TVA sur les exportations n\'est pas correctement appliquée.' },
];

// ─── SOP LIBRARY ─────────────────────────────────────────────────────────────
export const mockSOPs: SOPStep[] = [
  // Matériel
  { id: 'sop1', category: 'Matériel', stepNumber: 1, instructionText: 'Vérifier l\'alimentation électrique du terminal TPE (câble, prise).', requiredValidation: 'Confirmer que le câble est branché' },
  { id: 'sop2', category: 'Matériel', stepNumber: 2, instructionText: 'Effectuer un redémarrage forcé (maintenir le bouton marche/arrêt 10 sec).', requiredValidation: 'Confirmer le redémarrage effectué' },
  { id: 'sop3', category: 'Matériel', stepNumber: 3, instructionText: 'Vérifier la connexion réseau (WiFi ou SIM) et relancer la synchronisation.', requiredValidation: 'Confirmer la connexion réseau' },
  { id: 'sop4', category: 'Matériel', stepNumber: 4, instructionText: 'Si le problème persiste, prendre une photo du terminal et escalader au support Niveau 2.', requiredValidation: 'Photo de preuve envoyée' },
  // Comptabilité
  { id: 'sop5', category: 'Comptabilité', stepNumber: 1, instructionText: 'Télécharger le relevé bancaire de la période concernée.', requiredValidation: 'Relevé téléchargé' },
  { id: 'sop6', category: 'Comptabilité', stepNumber: 2, instructionText: 'Comparer les écritures dans le module comptable avec le relevé.', requiredValidation: 'Comparaison effectuée' },
  { id: 'sop7', category: 'Comptabilité', stepNumber: 3, instructionText: 'Identifier et noter les écarts (montant et date).', requiredValidation: 'Écarts documentés' },
  { id: 'sop8', category: 'Comptabilité', stepNumber: 4, instructionText: 'Corriger les écritures erronées avec validation du manager.', requiredValidation: 'Validation manager obtenue' },
  // IA
  { id: 'sop9', category: 'IA', stepNumber: 1, instructionText: 'Analyser le rapport de score IA pour identifier les métriques en baisse.', requiredValidation: 'Rapport consulté' },
  { id: 'sop10', category: 'IA', stepNumber: 2, instructionText: 'Vérifier les données d\'entrée (CA, transactions, KYC) pour détecter les anomalies.', requiredValidation: 'Données vérifiées' },
  { id: 'sop11', category: 'IA', stepNumber: 3, instructionText: 'Mettre à jour les paramètres du profil PME si nécessaire.', requiredValidation: 'Paramètres mis à jour' },
  // Services Financiers
  { id: 'sop12', category: 'Services Financiers', stepNumber: 1, instructionText: 'Vérifier le statut KYC de la PME (complet et approuvé).', requiredValidation: 'KYC vérifié' },
  { id: 'sop13', category: 'Services Financiers', stepNumber: 2, instructionText: 'Contacter le département financier pour le déblocage du dossier.', requiredValidation: 'Contact établi' },
  { id: 'sop14', category: 'Services Financiers', stepNumber: 3, instructionText: 'Informer la PME du délai estimé et des pièces manquantes éventuelles.', requiredValidation: 'PME informée' },
];

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
export const mockActivities: Activity[] = [
  { id: 'a1', smeId: 's3', userId: 'u4', type: 'Appel', notes: 'Client mécontent, problème TPE urgent.', timestamp: '2026-04-20T10:00:00Z' },
  { id: 'a2', smeId: 's3', userId: 'u3', type: 'Visite', notes: 'Visite terrain effectuée, KYC validé sur place.', timestamp: '2026-04-15T14:30:00Z' },
  { id: 'a3', smeId: 's3', userId: 'u4', type: 'Email', notes: 'Envoi du rapport score IA mensuel.', timestamp: '2026-04-10T09:00:00Z' },
  { id: 'a4', smeId: 's1', userId: 'u5', type: 'Onboarding', notes: 'Session onboarding terminale TPE réussie.', timestamp: '2026-04-18T11:00:00Z' },
  { id: 'a5', smeId: 's2', userId: 'u3', type: 'Visite', notes: 'Installation module analytique IA.', timestamp: '2026-04-17T16:00:00Z' },
  { id: 'a6', smeId: 's7', userId: 'u4', type: 'Appel', notes: 'Discussion sur le module TVA export.', timestamp: '2026-04-20T07:30:00Z' },
  { id: 'a7', smeId: 's4', userId: 'u3', type: 'Visite', notes: 'Présentation des services financiers SADA.', timestamp: '2026-04-12T10:00:00Z' },
  { id: 'a8', smeId: 's8', userId: 'u5', type: 'Appel', notes: 'Alerte rapprochement bancaire signalée.', timestamp: '2026-04-20T08:00:00Z' },
];

// ─── CHAT MESSAGES ────────────────────────────────────────────────────────────
export const mockChatMessages: ChatMessage[] = [
  { id: 'cm1', ticketId: 't1', sender: 'sme', message: 'Bonjour, notre terminal ne marche plus du tout depuis ce matin!', timestamp: '2026-04-20T10:00:00Z' },
  { id: 'cm2', ticketId: 't1', sender: 'agent', message: 'Bonjour, je prends en charge votre ticket. Pouvez-vous vérifier si le câble d\'alimentation est bien branché?', timestamp: '2026-04-20T10:05:00Z' },
  { id: 'cm3', ticketId: 't1', sender: 'sme', message: 'Oui c\'est bien branché mais rien ne se passe.', timestamp: '2026-04-20T10:15:00Z' },
  { id: 'cm4', ticketId: 't1', sender: 'agent', message: 'D\'accord, essayons un redémarrage forcé. Maintenez le bouton marche/arrêt pendant 10 secondes.', timestamp: '2026-04-20T10:20:00Z' },
  { id: 'cm5', ticketId: 't2', sender: 'sme', message: 'Il y a une erreur dans notre bilan, un écart de 450 000 FCFA.', timestamp: '2026-04-20T08:00:00Z' },
  { id: 'cm6', ticketId: 't2', sender: 'agent', message: 'Je comprends, je vais analyser votre relevé bancaire. Pouvez-vous m\'indiquer la période concernée?', timestamp: '2026-04-20T08:10:00Z' },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSOPsByCategory(category: string): SOPStep[] {
  return mockSOPs.filter(s => s.category === category).sort((a, b) => a.stepNumber - b.stepNumber);
}

export function getSMEById(id: string): SME | undefined {
  return mockSMEs.find(s => s.id === id);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

export function getActivitiesBySME(smeId: string): Activity[] {
  return mockActivities.filter(a => a.smeId === smeId).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getChatByTicket(ticketId: string): ChatMessage[] {
  return mockChatMessages.filter(m => m.ticketId === ticketId);
}

export function isP1Alert(ticket: Ticket): boolean {
  if (ticket.priority !== 'P1' || ticket.status === 'Résolu') return false;
  const last = new Date(ticket.lastTouchedAt).getTime();
  const now = Date.now();
  const diffHours = (now - last) / (1000 * 60 * 60);
  return diffHours > 2;
}

export function getTotalMRR(): number {
  return mockSMEs.reduce((sum, s) => sum + s.revenue_mrr, 0);
}

export function getGlobalSLA(): number {
  const resolved = mockTickets.filter(t => t.status === 'Résolu').length;
  return Math.round((resolved / mockTickets.length) * 100);
}

export function getRetentionRate(): number {
  const active = mockSMEs.filter(s => s.status === 'Active').length;
  return Math.round((active / mockSMEs.length) * 100);
}
