import type { PageRequestDto } from '../dtos/api';
import type { TxnFilterDto } from '../dtos/txn.dto';

export const queryKeys = {
  analytics: {
    all: ['analytics'] as const,
    monthly: (userId: number, month: string) => ['analytics', 'monthly', userId, month] as const,
  },
  classifications: {
    all: ['classifications'] as const,
    list: (userId: number, level: 'TYPE' | 'CATEGORY') =>
      ['classifications', 'list', userId, level] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (userId: number, filters: TxnFilterDto, pageRequest: PageRequestDto) =>
      ['transactions', 'list', userId, filters, pageRequest] as const,
  },
  users: {
    all: ['users'] as const,
  },
};
