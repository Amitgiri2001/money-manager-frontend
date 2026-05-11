import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "../../utils/date";
import { transactionCategories, transactionTypes } from "../../dtos/enums";
import type { TxnResponseDto } from "../../dtos/txn.dto";
import {
  transactionSchema,
  type TransactionFormValues,
} from "./transactionSchema";

type TransactionFormProps = {
  open: boolean;
  loading: boolean;
  transaction?: TxnResponseDto | null;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
};

export function TransactionForm({
  open,
  loading,
  transaction,
  onClose,
  onSubmit,
}: TransactionFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaultValues(),
  });
  const effectiveAmountDifferent = watch("effectiveAmountDifferent");

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(transaction));
    }
  }, [open, reset, transaction]);

  const submit = handleSubmit(async (values) => {
    const effectiveAmount = values.effectiveAmountDifferent
      ? values.effectiveAmount
      : values.amount;

    await onSubmit({
      ...values,
      effectiveAmount,
      time: fromDateTimeLocalValue(values.time),
    });
    reset(getDefaultValues());
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle>
        {transaction ? "Edit Transaction" : "New Transaction"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Type"
                error={!!errors.type}
                helperText={errors.type?.message}
                {...field}
              >
                {transactionTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                label="Amount"
                type="number"
                inputProps={{ min: 0.0, step: 0.01 }}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="effectiveAmountDifferent"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                }
                label="Effective amount is different"
              />
            )}
          />
          {effectiveAmountDifferent && (
            <Controller
              name="effectiveAmount"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Effective Amount"
                  type="number"
                  inputProps={{ min: 0.0, step: 0.01 }}
                  error={!!errors.effectiveAmount}
                  helperText={
                    errors.effectiveAmount?.message ??
                    "Used for balance and analytics calculations"
                  }
                  {...field}
                />
              )}
            />
          )}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Category"
                error={!!errors.category}
                helperText={errors.category?.message}
                {...field}
              >
                {transactionCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <TextField
                label="Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                error={!!errors.time}
                helperText={errors.time?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                label="Note"
                multiline
                minRows={2}
                error={!!errors.note}
                helperText={errors.note?.message}
                {...field}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: 1,
        }}
      >
        <Button onClick={onClose} sx={{ width: { xs: "100%", sm: "auto" } }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={loading}
          onClick={submit}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {transaction ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getDefaultValues(
  transaction?: TxnResponseDto | null,
): TransactionFormValues {
  const amount = transaction?.amount ?? 0;
  const effectiveAmount = transaction?.effectiveAmount ?? amount;
  const effectiveAmountDifferent = Boolean(
    transaction && effectiveAmount !== amount,
  );

  return {
    type: transaction?.type ?? "EXPENSE",
    amount,
    effectiveAmountDifferent,
    effectiveAmount,
    category: transaction?.category ?? "FOOD",
    note: transaction?.note ?? "",
    time: transaction?.time
      ? transaction.time.slice(0, 16)
      : toDateTimeLocalValue(),
  };
}
