export const transactionTypes = ['INCOME', 'EXPENSE', 'INVESTMENT', 'LOAN'] as const;

export type TransactionType = string;

export const transactionCategories = [
  'FOOD',
  'TRAVEL',
  'SHOPPING',
  'SALARY',
  'HEALTH',
  'ENTERTAINMENT',
] as const;

export type TransactionCategory = string;
