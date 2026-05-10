import type { TransactionCategory, TransactionType } from './enums';

export interface TxnRequestDto {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  note?: string;
  time: string;
  userId: number;
}

export interface UpdateTxnDto {
  type?: TransactionType;
  amount?: number;
  category?: TransactionCategory;
  note?: string;
  time?: string;
}

export interface TxnResponseDto {
  id: number;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  note: string | null;
  userId: number;
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
