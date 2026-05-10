import type { TransactionCategory, TransactionType } from './enums';
import type { TxnResponseDto } from './txn.dto';

export interface ParsedTxnDto {
  type: TransactionType | null;
  amount: number | null;
  category: TransactionCategory | null;
  note: string | null;
  time: string | null;
  originalCommand: string;
  valid: boolean;
  confirmationId: string;
  userId: number;
}

export interface ConfirmTxnDto {
  confirmationId: string;
  confirmed: boolean;
  type?: TransactionType | null;
  amount?: number | null;
  category?: TransactionCategory | null;
  note?: string | null;
  time?: string | null;
  userId?: number | null;
}

export type ConfirmTxnResponseDto = TxnResponseDto | null;
