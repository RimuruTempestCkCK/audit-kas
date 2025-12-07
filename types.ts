export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  evidenceRef: string; // Proof/Audit trail reference
  auditorNotes?: string;
}

export interface CashCount {
  denomination: number;
  count: number;
}

export interface AuditState {
  transactions: Transaction[];
  physicalCashTotal: number | null;
  auditorName: string;
  auditDate: string;
}

export const CATEGORIES = [
  'Penjualan',
  'Operasional',
  'Gaji',
  'Perlengkapan',
  'Jasa',
  'Lain-lain'
];

export const DENOMINATIONS = [
  100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100
];