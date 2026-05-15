import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import type { TxnClassificationDto } from '../../dtos/txnClassification.dto';
import type { ParsedTxnDto } from '../../dtos/voice.dto';
import { formatCurrency, fromDateTimeLocalValue } from '../../utils/date';

type ParsedTxnConfirmationDialogProps = {
  parsedTxn: ParsedTxnDto | null;
  loading: boolean;
  typeOptions: TxnClassificationDto[];
  categoryOptions: TxnClassificationDto[];
  onConfirm: (parsedTxn: ParsedTxnDto) => void;
  onCancel: () => void;
  onClose: () => void;
};

export function ParsedTxnConfirmationDialog({
  parsedTxn,
  loading,
  typeOptions,
  categoryOptions,
  onConfirm,
  onCancel,
  onClose,
}: ParsedTxnConfirmationDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [draft, setDraft] = useState<ParsedTxnDto | null>(parsedTxn);

  useEffect(() => {
    setDraft(parsedTxn);
  }, [parsedTxn]);

  const missingFields = useMemo(() => {
    if (!draft) {
      return [];
    }

    return [
      !draft.txnTypeId ? 'type' : '',
      !draft.amount || draft.amount <= 0 ? 'amount' : '',
      !draft.txnCategoryId ? 'category' : '',
      !draft.time ? 'time' : '',
    ].filter(Boolean);
  }, [draft]);

  const canConfirm = Boolean(draft) && missingFields.length === 0;

  function updateDraft(updates: Partial<ParsedTxnDto>) {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      const next = {
        ...current,
        ...updates,
      };

      return {
        ...next,
        valid: Boolean(next.txnTypeId && next.amount && next.amount > 0 && next.txnCategoryId && next.time),
      };
    });
  }

  return (
    <Dialog open={Boolean(parsedTxn)} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle>Confirm Transaction</DialogTitle>
      <DialogContent>
        {draft && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                color={canConfirm ? 'success' : 'warning'}
                label={canConfirm ? 'Ready to save' : 'Missing details'}
              />
              <Typography variant="body2" color="text.secondary">
                Confirmation ID: {draft.confirmationId}
              </Typography>
            </Stack>
            <Divider />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                required
                label="Type"
                value={draft.txnTypeId ?? ''}
                onChange={(event) => updateDraft({ txnTypeId: event.target.value ? Number(event.target.value) : null })}
                fullWidth
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                label="Amount"
                type="number"
                value={draft.amount ?? ''}
                onChange={(event) =>
                  updateDraft({ amount: event.target.value ? Number(event.target.value) : null })
                }
                inputProps={{ min: 0.01, step: 0.01 }}
                helperText={draft.amount ? formatCurrency(draft.amount) : 'Required'}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                required
                label="Category"
                value={draft.txnCategoryId ?? ''}
                onChange={(event) =>
                  updateDraft({ txnCategoryId: event.target.value ? Number(event.target.value) : null })
                }
                fullWidth
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                label="Time"
                type="datetime-local"
                value={toDateTimeInputValue(draft.time)}
                onChange={(event) => updateDraft({ time: fromDateTimeLocalValue(event.target.value) })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
            <TextField
              label="Note"
              value={draft.note ?? ''}
              onChange={(event) => updateDraft({ note: event.target.value })}
              multiline
              minRows={2}
              inputProps={{ maxLength: 100 }}
              helperText={`${draft.note?.length ?? 0}/100`}
            />
            {missingFields.length > 0 && (
              <Typography variant="body2" color="warning.main">
                Fill required fields: {missingFields.join(', ')}
              </Typography>
            )}
            <Detail label="Original command" value={draft.originalCommand} />
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
        <Button
          startIcon={<CloseIcon />}
          disabled={loading}
          onClick={onCancel}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Cancel
        </Button>
        <Button
          startIcon={<CheckIcon />}
          variant="contained"
          disabled={loading || !canConfirm || !draft}
          onClick={() => draft && onConfirm(draft)}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography align="right" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function toDateTimeInputValue(value: string | null) {
  return value ? value.slice(0, 16) : '';
}
