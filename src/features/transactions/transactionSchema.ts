import { z } from 'zod';
import { transactionCategories, transactionTypes } from '../../dtos/enums';

export const transactionSchema = z.object({
  type: z.enum(transactionTypes),
  amount: z.coerce.number().min(0.01, 'Amount must be at least 0.01'),
  category: z.enum(transactionCategories),
  note: z.string().max(100, 'Note must be 100 characters or less').optional(),
  time: z.string().min(1, 'Transaction time is required'),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
