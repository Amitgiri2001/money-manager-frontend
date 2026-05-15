import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState, useMemo } from 'react';
import type { TxnFilterDto } from '../../dtos/txn.dto';
import type { TxnClassificationDto } from '../../dtos/txnClassification.dto';

type MainTransactionFiltersProps = {
  filters: TxnFilterDto;
  keyword: string;
  typeOptions: TxnClassificationDto[];
  categoryOptions: TxnClassificationDto[];
  onFiltersChange: (filters: TxnFilterDto) => void;
  onKeywordChange: (keyword: string) => void;
  onReset: () => void;
};

export function MainTransactionFilters({
  filters,
  keyword,
  typeOptions,
  categoryOptions,
  onFiltersChange,
  onKeywordChange,
  onReset,
}: MainTransactionFiltersProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!filters.txnTypeId) return categoryOptions.filter(cat => !cat.parentId);
    return categoryOptions.filter(cat => !cat.parentId || cat.parentId === filters.txnTypeId);
  }, [categoryOptions, filters.txnTypeId]);

  return (
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
      <TextField
        select
        label="Type"
        value={filters.txnTypeId ?? ''}
        onChange={(event) => {
          const newTypeId = event.target.value ? Number(event.target.value) : undefined;
          onFiltersChange({
            ...filters,
            txnTypeId: newTypeId,
            txnCategoryId: undefined, // Clear category when type changes
          });
        }}
        sx={{ minWidth: { xs: '100%', lg: 150 } }}
      >
        <MenuItem value="">All</MenuItem>
        {typeOptions.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Category"
        value={filters.txnCategoryId ?? ''}
        SelectProps={{
          onOpen: () => {
            if (!filters.txnTypeId) {
              setSnackbarOpen(true);
            }
          },
        }}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            txnCategoryId: event.target.value ? Number(event.target.value) : undefined,
          })
        }
        sx={{ minWidth: { xs: '100%', lg: 180 } }}
      >
        <MenuItem value="">All</MenuItem>
        {filteredCategories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Start date"
        type="date"
        value={filters.startDate ?? ''}
        onChange={(event) => onFiltersChange({ ...filters, startDate: event.target.value })}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: { xs: '100%', lg: 160 } }}
      />
      <TextField
        label="End date"
        type="date"
        value={filters.endDate ?? ''}
        onChange={(event) => onFiltersChange({ ...filters, endDate: event.target.value })}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: { xs: '100%', lg: 160 } }}
      />
      <TextField
        label="Search note"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        sx={{ flexGrow: 1, minWidth: { xs: '100%', lg: 220 } }}
      />
      <Button variant="outlined" onClick={onReset} sx={{ px: 3, width: { xs: '100%', lg: 'auto' } }}>
        Clear
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
          Please select a transaction type first.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
