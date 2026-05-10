import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { TxnFilterDto } from '../../dtos/txn.dto';
import type { TransactionSortOptions } from './useTransactionFilters';

type AdvancedTransactionFiltersProps = {
  filters: TxnFilterDto;
  sort: TransactionSortOptions;
  onFiltersChange: (filters: TxnFilterDto) => void;
  onSortChange: (sort: TransactionSortOptions) => void;
};

const sortFields: Array<{ label: string; value: TransactionSortOptions['field'] }> = [
  { label: 'Transaction time', value: 'time' },
  { label: 'Amount', value: 'amount' },
  { label: 'Category', value: 'category' },
  { label: 'Type', value: 'type' },
];

export function AdvancedTransactionFilters({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
}: AdvancedTransactionFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Stack spacing={2}>
      <Divider />
      <Button
        color="inherit"
        onClick={() => setOpen((current) => !current)}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 160ms ease',
            }}
          />
        }
        sx={{ alignSelf: 'flex-start' }}
      >
        Advanced Filters
      </Button>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Use amount range and sorting when you need a narrower transaction view.
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Min amount"
              type="number"
              value={filters.minAmount ?? ''}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  minAmount: event.target.value ? Number(event.target.value) : undefined,
                })
              }
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ minWidth: { xs: '100%', md: 160 } }}
            />
            <TextField
              label="Max amount"
              type="number"
              value={filters.maxAmount ?? ''}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  maxAmount: event.target.value ? Number(event.target.value) : undefined,
                })
              }
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ minWidth: { xs: '100%', md: 160 } }}
            />
            <TextField
              select
              label="Sort by"
              value={sort.field}
              onChange={(event) =>
                onSortChange({
                  ...sort,
                  field: event.target.value as TransactionSortOptions['field'],
                })
              }
              sx={{ minWidth: { xs: '100%', md: 190 } }}
            >
              {sortFields.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {field.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Direction"
              value={sort.direction}
              onChange={(event) =>
                onSortChange({
                  ...sort,
                  direction: event.target.value as TransactionSortOptions['direction'],
                })
              }
              sx={{ minWidth: { xs: '100%', md: 150 } }}
            >
              <MenuItem value="desc">Newest / high first</MenuItem>
              <MenuItem value="asc">Oldest / low first</MenuItem>
            </TextField>
          </Stack>
        </Stack>
      </Collapse>
    </Stack>
  );
}
