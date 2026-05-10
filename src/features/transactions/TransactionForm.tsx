import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '../../utils/date';
import { transactionCategories, transactionTypes } from '../../dtos/enums';
import { transactionSchema, type TransactionFormValues } from './transactionSchema';

type TransactionFormProps = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
};

export function TransactionForm({ open, loading, onClose, onSubmit }: TransactionFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: 0,
      category: 'FOOD',
      note: '',
      time: toDateTimeLocalValue(),
    },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      time: fromDateTimeLocalValue(values.time),
    });
    reset();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle>New Transaction</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField select label="Type" error={!!errors.type} helperText={errors.type?.message} {...field}>
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
                inputProps={{ min: 0.01, step: 0.01 }}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                {...field}
              />
            )}
          />
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
      <DialogActions sx={{ px: 3, pb: 2, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
        <Button onClick={onClose} sx={{ width: { xs: '100%', sm: 'auto' } }}>Cancel</Button>
        <Button variant="contained" disabled={loading} onClick={submit} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
