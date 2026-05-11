import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { createTransaction, deleteTransaction, searchTransactions } from '../api/transactionsApi';
import { queryKeys } from '../api/queryKeys';
import { toApiError } from '../api/http';
import { AppErrorAlert } from '../components/AppErrorAlert';
import { PageHeader } from '../components/PageHeader';
import { TransactionFiltersBar } from '../features/transactions/TransactionFiltersBar';
import { TransactionForm } from '../features/transactions/TransactionForm';
import type { TransactionFormValues } from '../features/transactions/transactionSchema';
import { TransactionsTable } from '../features/transactions/TransactionsTable';
import { useTransactionFilters } from '../features/transactions/useTransactionFilters';
import type { AppOutletContext } from '../types/app';

export function TransactionsPage() {
  const { userId } = useOutletContext<AppOutletContext>();
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const transactionFilters = useTransactionFilters();
  const pageRequest = useMemo(
    () => transactionFilters.buildPageRequest(pageIndex, pageSize),
    [pageIndex, pageSize, transactionFilters.sort],
  );

  const {
    data: page = null,
    error,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.transactions.list(userId, transactionFilters.apiFilters, pageRequest),
    queryFn: () => searchTransactions(userId, transactionFilters.apiFilters, pageRequest),
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: (values: TransactionFormValues) => createTransaction({ ...values, userId }),
    onSuccess: async () => {
      setFormOpen(false);
      setPageIndex(0);
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });

  return (
    <>
      <PageHeader
        title="Transactions"
        action={
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setFormOpen(true)}>
            New
          </Button>
        }
      />
      <Stack spacing={2}>
        <AppErrorAlert
          error={error ? toApiError(error) : createMutation.error ? toApiError(createMutation.error) : deleteMutation.error ? toApiError(deleteMutation.error) : null}
        />
        <TransactionFiltersBar
          filters={transactionFilters.filters}
          keyword={transactionFilters.keywordInput}
          sort={transactionFilters.sort}
          onChange={(nextFilters) => {
            transactionFilters.updateFilters(nextFilters);
            setPageIndex(0);
          }}
          onKeywordChange={(keyword) => {
            transactionFilters.setKeywordInput(keyword);
            setPageIndex(0);
          }}
          onSortChange={(sort) => {
            transactionFilters.setSort(sort);
            setPageIndex(0);
          }}
          onReset={() => {
            transactionFilters.clearFilters();
            setPageIndex(0);
          }}
        />
        <TransactionsTable
          page={page}
          loading={isLoading && !page}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize);
            setPageIndex(0);
          }}
          onDelete={(transactionId) => deleteMutation.mutate(transactionId)}
        />
      </Stack>
      <TransactionForm
        open={formOpen}
        loading={createMutation.isPending || isFetching}
        onClose={() => setFormOpen(false)}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
      />
    </>
  );
}
