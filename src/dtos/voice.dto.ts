import type { TxnResponseDto } from './txn.dto';

export interface ParsedTxnDto {
  amount: number | null;
  note: string | null;
  time: string | null;
  originalCommand: string;
  valid: boolean;
  confirmationId: string;
  userId: number;
  txnTypeId: number | null;
  txnCategoryId: number | null;
}

export interface ConfirmTxnDto {
  confirmationId: string;
  confirmed: boolean;
  amount?: number | null;
  note?: string | null;
  time?: string | null;
  userId?: number | null;
  txnTypeId?: number | null;
  txnCategoryId?: number | null;
}

export type ConfirmTxnResponseDto = TxnResponseDto | null;
