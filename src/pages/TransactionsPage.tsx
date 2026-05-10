import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { createTransaction, deleteTransaction, searchTransactions } from '../api/transactionsApi';
import { AppErrorAlert } from '../components/AppErrorAlert';
import { PageHeader } from '../components/PageHeader';
import type { SpringPage } from '../dtos/api';
import type { TxnResponseDto } from '../dtos/txn.dto';
import { TransactionFiltersBar } from '../features/transactions/TransactionFiltersBar';
import { TransactionForm } from '../features/transactions/TransactionForm';
import type { TransactionFormValues } from '../features/transactions/transactionSchema';
import { TransactionsTable } from '../features/transactions/TransactionsTable';
import { useTransactionFilters } from '../features/transactions/useTransactionFilters';
import { useApiAction } from '../hooks/useApiAction';
import type { AppOutletContext } from '../types/app';

export function TransactionsPage() {
  const { userId } = useOutletContext<AppOutletContext>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState<SpringPage<TxnResponseDto> | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const { loading, error, run } = useApiAction();
  const transactionFilters = useTransactionFilters();

  async function loadTransactions() {
    await run(async () => {
      const data = await searchTransactions(
        userId,
        transactionFilters.apiFilters,
        transactionFilters.buildPageRequest(pageIndex, pageSize),
      );
      setPage(data);
    });
  }

  useEffect(() => {
    void loadTransactions();
  }, [userId, transactionFilters.apiFilters, transactionFilters.sort, pageIndex, pageSize]);

  async function handleCreate(values: TransactionFormValues) {
    await run(async () => {
      await createTransaction({ ...values, userId });
      setFormOpen(false);
      setPageIndex(0);
      await loadTransactions();
    });
  }

  async function handleDelete(transactionId: number) {
    await run(async () => {
      await deleteTransaction(transactionId);
      await loadTransactions();
    });
  }

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
        <AppErrorAlert error={error} />
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
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize);
            setPageIndex(0);
          }}
          onDelete={handleDelete}
        />
      </Stack>
      <TransactionForm
        open={formOpen}
        loading={loading}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  );
}
