export const transactionTypes = ['INCOME', 'EXPENSE', 'INVESTMENT', 'LOAN'] as const;

export type TransactionType = (typeof transactionTypes)[number];

export const transactionCategories = [
  'FOOD',
  'TRAVEL',
  'SHOPPING',
  'SALARY',
  'HEALTH',
  'ENTERTAINMENT',
] as const;

export type TransactionCategory = (typeof transactionCategories)[number];
