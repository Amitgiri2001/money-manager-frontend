import type { TransactionCategory, TransactionType } from './enums';

export interface TxnRequestDto {
  type: TransactionType;
  amount: number;
  effectiveAmount?: number;
  category: TransactionCategory;
  note?: string;
  time: string;
  userId: number;
  txnTypeId: number;
  txnCategoryId: number;
}

export interface UpdateTxnDto {
  type?: TransactionType;
  amount?: number;
  effectiveAmount?: number;
  category?: TransactionCategory;
  note?: string;
  time?: string;
  txnTypeId?: number;
  txnCategoryId?: number;
}

export interface TxnResponseDto {
  id: number;
  type: TransactionType;
  amount: number;
  effectiveAmount: number;
  category: TransactionCategory;
  note: string | null;
  userId: number;
  txnType?: { id: number; name: string };
  txnCategory?: { id: number; name: string };
  time: string;
  createdAt: string;
  updatedAt: string;
}

export interface TxnFilterDto {
  type?: TransactionType;
  category?: TransactionCategory;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface MonthlyAnalyticsDto {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  totalLoan: number;
  effectiveBalance: number;
  currentBalance: number;
  transactionCount: number;
}
