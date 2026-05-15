import { useMemo, useState } from 'react';
import type { PageRequestDto } from '../../dtos/api';
import type { TxnFilterDto } from '../../dtos/txn.dto';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export type TransactionSortField = 'time' | 'amount' | 'txnCategory.name' | 'txnType.name';

export type TransactionSortOptions = {
  field: TransactionSortField;
  direction: 'asc' | 'desc';
};

const defaultSort: TransactionSortOptions = {
  field: 'time',
  direction: 'desc',
};

export function useTransactionFilters() {
  const [filters, setFilters] = useState<TxnFilterDto>({});
  const [keywordInput, setKeywordInput] = useState('');
  const [sort, setSort] = useState<TransactionSortOptions>(defaultSort);
  const debouncedKeyword = useDebouncedValue(keywordInput);

  const apiFilters = useMemo<TxnFilterDto>(
    () => ({
      ...filters,
      keyword: debouncedKeyword.trim() || undefined,
    }),
    [debouncedKeyword, filters],
  );

  function updateFilters(nextFilters: TxnFilterDto) {
    setFilters(removeEmptyValues(nextFilters));
  }

  function clearFilters() {
    setFilters({});
    setKeywordInput('');
    setSort(defaultSort);
  }

  function buildPageRequest(page: number, size: number): PageRequestDto {
    return {
      page,
      size,
      sort,
    };
  }

  return {
    filters,
    apiFilters,
    keywordInput,
    setKeywordInput,
    updateFilters,
    clearFilters,
    sort,
    setSort,
    buildPageRequest,
  };
}

function removeEmptyValues(filters: TxnFilterDto) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
  ) as TxnFilterDto;
}
