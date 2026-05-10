import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { transactionCategories, transactionTypes } from '../../dtos/enums';
import type { TxnFilterDto } from '../../dtos/txn.dto';

type MainTransactionFiltersProps = {
  filters: TxnFilterDto;
  keyword: string;
  onFiltersChange: (filters: TxnFilterDto) => void;
  onKeywordChange: (keyword: string) => void;
  onReset: () => void;
};

export function MainTransactionFilters({
  filters,
  keyword,
  onFiltersChange,
  onKeywordChange,
  onReset,
}: MainTransactionFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
      <TextField
        select
        label="Type"
        value={filters.type ?? ''}
        onChange={(event) =>
          onFiltersChange({ ...filters, type: event.target.value as TxnFilterDto['type'] })
        }
        sx={{ minWidth: { xs: '100%', lg: 150 } }}
      >
        <MenuItem value="">All</MenuItem>
        {transactionTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Category"
        value={filters.category ?? ''}
        onChange={(event) =>
          onFiltersChange({ ...filters, category: event.target.value as TxnFilterDto['category'] })
        }
        sx={{ minWidth: { xs: '100%', lg: 180 } }}
      >
        <MenuItem value="">All</MenuItem>
        {transactionCategories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
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
    </Stack>
  );
}
