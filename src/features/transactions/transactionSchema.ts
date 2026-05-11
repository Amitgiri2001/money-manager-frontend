import { z } from "zod";
import { transactionCategories, transactionTypes } from "../../dtos/enums";

export const transactionSchema = z
  .object({
    type: z.enum(transactionTypes),
    amount: z.coerce.number().min(0.0, "Amount must be at least 0.00"),
    effectiveAmountDifferent: z.boolean(),
    effectiveAmount: z.coerce.number().optional(),
    category: z.enum(transactionCategories),
    note: z.string().max(100, "Note must be 100 characters or less").optional(),
    time: z.string().min(1, "Transaction time is required"),
  })
  .superRefine((values, context) => {
    if (
      values.effectiveAmountDifferent &&
      (!values.effectiveAmount || values.effectiveAmount < 0.0)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["effectiveAmount"],
        message: "Effective amount must be st 0.00",
      });
    }
  });

export type TransactionFormValues = z.infer<typeof transactionSchema>;
