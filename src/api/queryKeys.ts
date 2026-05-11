import type { PageRequestDto } from '../dtos/api';
import type { TxnFilterDto } from '../dtos/txn.dto';

export const queryKeys = {
  analytics: {
    all: ['analytics'] as const,
    monthly: (userId: number, month: string) => ['analytics', 'monthly', userId, month] as const,
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
