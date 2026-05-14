import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import type { TxnFilterDto } from '../../dtos/txn.dto';
import type { TxnClassificationDto } from '../../dtos/txnClassification.dto';
import { AdvancedTransactionFilters } from './AdvancedTransactionFilters';
import { MainTransactionFilters } from './MainTransactionFilters';
import type { TransactionSortOptions } from './useTransactionFilters';

type TransactionFiltersBarProps = {
  filters: TxnFilterDto;
  keyword: string;
  sort: TransactionSortOptions;
  typeOptions: TxnClassificationDto[];
  categoryOptions: TxnClassificationDto[];
  onChange: (filters: TxnFilterDto) => void;
  onKeywordChange: (keyword: string) => void;
  onSortChange: (sort: TransactionSortOptions) => void;
  onReset: () => void;
};

export function TransactionFiltersBar({
  filters,
  keyword,
  sort,
  typeOptions,
  categoryOptions,
  onChange,
  onKeywordChange,
  onSortChange,
  onReset,
}: TransactionFiltersBarProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <MainTransactionFilters
          filters={filters}
          keyword={keyword}
          typeOptions={typeOptions}
          categoryOptions={categoryOptions}
          onFiltersChange={onChange}
          onKeywordChange={onKeywordChange}
          onReset={onReset}
        />
        <AdvancedTransactionFilters
          filters={filters}
          sort={sort}
          onFiltersChange={onChange}
          onSortChange={onSortChange}
        />
      </Stack>
    </Paper>
  );
}
