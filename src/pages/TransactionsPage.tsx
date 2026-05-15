import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import {
  createTransaction,
  deleteTransaction,
  searchTransactions,
  updateTransaction,
} from "../api/transactionsApi";
import {
  createTxnClassification,
  fetchTxnClassifications,
} from "../api/txnClassificationsApi";
import { queryKeys } from "../api/queryKeys";
import { toApiError } from "../api/http";
import { AppErrorAlert } from "../components/AppErrorAlert";
import { PageHeader } from "../components/PageHeader";
import type {
  TxnClassificationDto,
  TxnClassificationLevel,
} from "../dtos/txnClassification.dto";
import type {
  TxnRequestDto,
  TxnResponseDto,
  UpdateTxnDto,
} from "../dtos/txn.dto";
import { TransactionFiltersBar } from "../features/transactions/TransactionFiltersBar";
import { TransactionForm } from "../features/transactions/TransactionForm";
import type { TransactionFormValues } from "../features/transactions/transactionSchema";
import { TransactionsTable } from "../features/transactions/TransactionsTable";
import { useTransactionFilters } from "../features/transactions/useTransactionFilters";
import type { AppOutletContext } from "../types/app";

export function TransactionsPage() {
  const { userId } = useOutletContext<AppOutletContext>();
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TxnResponseDto | null>(null);
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
    queryKey: queryKeys.transactions.list(
      userId,
      transactionFilters.apiFilters,
      pageRequest,
    ),
    queryFn: () =>
      searchTransactions(userId, transactionFilters.apiFilters, pageRequest),
    placeholderData: (previousData) => previousData,
  });
  const { data: fetchedTypes = [] } = useQuery({
    queryKey: queryKeys.classifications.list(userId, "TYPE"),
    queryFn: () => fetchTxnClassifications(userId, "TYPE"),
  });
  const { data: fetchedCategories = [] } = useQuery({
    queryKey: queryKeys.classifications.list(userId, "CATEGORY"),
    queryFn: () => fetchTxnClassifications(userId, "CATEGORY"),
  });
  const typeOptions = useMemo(() => fetchedTypes, [fetchedTypes]);
  const categoryOptions = useMemo(() => fetchedCategories, [fetchedCategories]);

  const createMutation = useMutation({
    mutationFn: (values: TransactionFormValues) =>
      createTransaction(toCreatePayload(values, userId)),
    onSuccess: async () => {
      setFormOpen(false);
      setEditingTransaction(null);
      setPageIndex(0);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.analytics.all,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      transactionId,
      values,
    }: {
      transactionId: number;
      values: TransactionFormValues;
    }) => updateTransaction(transactionId, toUpdatePayload(values)),
    onSuccess: async () => {
      setFormOpen(false);
      setEditingTransaction(null);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.analytics.all,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.analytics.all,
      });
    },
  });
  const createClassificationMutation = useMutation({
    mutationFn: ({
      level,
      name,
      description,
      parentId,
    }: {
      level: TxnClassificationLevel;
      name: string;
      description: string;
      parentId?: number | null;
    }) =>
      createTxnClassification({
        level: level,
        name,
        description,
        createdBy: userId,
        parentId,
      }),
    onSuccess: async (classification) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.classifications.list(userId, classification.level),
      });
    },
  });

  return (
    <>
      <PageHeader
        title="Transactions"
        action={
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setFormOpen(true)}
          >
            New
          </Button>
        }
      />
      <Stack spacing={2}>
        <AppErrorAlert
          error={
            error
              ? toApiError(error)
              : createMutation.error
                ? toApiError(createMutation.error)
                : updateMutation.error
                  ? toApiError(updateMutation.error)
                  : deleteMutation.error
                    ? toApiError(deleteMutation.error)
                    : createClassificationMutation.error
                      ? toApiError(createClassificationMutation.error)
                      : null
          }
        />
        <TransactionFiltersBar
          filters={transactionFilters.filters}
          keyword={transactionFilters.keywordInput}
          sort={transactionFilters.sort}
          typeOptions={typeOptions}
          categoryOptions={categoryOptions}
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
          onEdit={(transaction) => {
            setEditingTransaction(transaction);
            setFormOpen(true);
          }}
          onDelete={(transactionId) => deleteMutation.mutate(transactionId)}
        />
      </Stack>
      <TransactionForm
        open={formOpen}
        loading={
          createMutation.isPending ||
          updateMutation.isPending ||
          createClassificationMutation.isPending ||
          isFetching
        }
        transaction={editingTransaction}
        typeOptions={typeOptions}
        categoryOptions={categoryOptions}
        onCreateClassification={async (values) =>
          createClassificationMutation.mutateAsync(values)
        }
        onClose={() => {
          setFormOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={async (values) => {
          if (editingTransaction) {
            await updateMutation.mutateAsync({
              transactionId: editingTransaction.id,
              values,
            });
            return;
          }

          await createMutation.mutateAsync(values);
        }}
      />
    </>
  );
}

function toCreatePayload(
  values: TransactionFormValues,
  userId: number,
): TxnRequestDto {
  return {
    amount: values.amount,
    effectiveAmount: values.effectiveAmount,
    note: values.note,
    time: values.time,
    userId,
    txnTypeId: values.txnTypeId,
    txnCategoryId: values.txnCategoryId,
  };
}

function toUpdatePayload(values: TransactionFormValues): UpdateTxnDto {
  return {
    amount: values.amount,
    effectiveAmount: values.effectiveAmount,
    note: values.note,
    time: values.time,
    txnTypeId: values.txnTypeId,
    txnCategoryId: values.txnCategoryId,
  };
}
