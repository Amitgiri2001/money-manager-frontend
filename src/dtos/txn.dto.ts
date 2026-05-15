export interface TxnRequestDto {
  amount: number;
  effectiveAmount?: number;
  note?: string;
  time: string;
  userId: number;
  txnTypeId: number;
  txnCategoryId: number;
}

export interface UpdateTxnDto {
  amount?: number;
  effectiveAmount?: number;
  note?: string;
  time?: string;
  txnTypeId?: number;
  txnCategoryId?: number;
}

export interface TxnResponseDto {
  id: number;
  amount: number;
  effectiveAmount: number;
  note: string | null;
  userId: number;
  txnType?: { id: number; name: string };
  txnCategory?: { id: number; name: string };
  time: string;
  createdAt: string;
  updatedAt: string;
}

export interface TxnFilterDto {
  txnTypeId?: number;
  txnCategoryId?: number;
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
